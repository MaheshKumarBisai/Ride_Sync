const express = require("express");
const { body, validationResult } = require("express-validator");
const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Get bookings (role-based)
router.get("/", auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10, vendor } = req.query;
    let bookings;

    if (req.user.role === "vendor" || req.query.vendor === "true") {
      // Get vendor bookings
      bookings = await Booking.getVendorBookings(req.user._id, status);
    } else {
      // Get customer bookings
      bookings = await Booking.getCustomerBookings(req.user._id, status);
    }

    // Apply pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedBookings = bookings.slice(startIndex, endIndex);

    res.json({
      bookings: paginatedBookings,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(bookings.length / Number(limit)),
        total: bookings.length,
        hasNextPage: endIndex < bookings.length,
        hasPrevPage: Number(page) > 1,
      },
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({
      message: "Server error while fetching bookings",
    });
  }
});

// Get single booking
router.get("/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("customer", "name email phone")
      .populate("vendor", "name email phone vendorInfo")
      .populate("vehicle", "make model type image location pricePerDay");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Check if user has access to this booking
    const hasAccess =
      booking.customer._id.toString() === req.user._id.toString() ||
      booking.vendor._id.toString() === req.user._id.toString() ||
      req.user.role === "admin";

    if (!hasAccess) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    res.json({ booking });
  } catch (error) {
    console.error("Get booking error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid booking ID format",
      });
    }
    res.status(500).json({
      message: "Server error while fetching booking",
    });
  }
});

// Create booking (customers only)
router.post(
  "/",
  auth,
  [
    body("vehicleId")
      .notEmpty()
      .isMongoId()
      .withMessage("Valid vehicle ID is required"),
    body("startDate").isISO8601().withMessage("Valid start date is required"),
    body("endDate").isISO8601().withMessage("Valid end date is required"),
    body("pickupLocation")
      .trim()
      .notEmpty()
      .withMessage("Pickup location is required"),
    body("totalAmount")
      .isFloat({ min: 0 })
      .withMessage("Total amount must be positive"),
  ],
  async (req, res) => {
    try {
      // Only customers can create bookings
      if (req.user.role !== "customer") {
        return res.status(403).json({
          message: "Only customers can create bookings",
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: errors.array()[0].msg,
          errors: errors.array(),
        });
      }

      const {
        vehicleId,
        startDate,
        endDate,
        totalAmount,
        pickupLocation,
        dropoffLocation,
        customerNotes,
      } = req.body;

      // Get vehicle and verify it's available
      const vehicle = await Vehicle.findById(vehicleId).populate("owner");
      if (!vehicle) {
        return res.status(404).json({
          message: "Vehicle not found",
        });
      }

      if (vehicle.status !== "Available") {
        return res.status(400).json({
          message: "Vehicle is not available for booking",
        });
      }

      // Calculate booking details
      const start = new Date(startDate);
      const end = new Date(endDate);
      const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

      if (totalDays <= 0) {
        return res.status(400).json({
          message: "End date must be after start date",
        });
      }

      if (start < new Date(Date.now() - 24 * 60 * 60 * 1000)) {
        return res.status(400).json({
          message: "Start date cannot be in the past",
        });
      }

      // Create booking
      const bookingData = {
        customer: req.user._id,
        vendor: vehicle.owner._id,
        vehicle: vehicleId,
        startDate: start,
        endDate: end,
        totalDays,
        pricePerDay: vehicle.pricePerDay,
        totalAmount,
        pickupLocation: pickupLocation.trim(),
        dropoffLocation: dropoffLocation?.trim() || pickupLocation.trim(),
        customerNotes: customerNotes?.trim(),
        status: "Pending",
      };

      const booking = new Booking(bookingData);

      // Check for booking conflicts
      const hasConflict = await booking.hasConflict();
      if (hasConflict) {
        return res.status(400).json({
          message: "Vehicle is not available for the selected dates",
        });
      }

      await booking.save();
      await booking.populate([
        { path: "customer", select: "name email phone" },
        { path: "vendor", select: "name email phone" },
        { path: "vehicle", select: "make model type image location" },
      ]);

      // Update customer booking count
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { "customerInfo.totalBookings": 1 },
      });

      res.status(201).json({
        message: "Booking request sent successfully",
        booking,
        referenceNumber: booking.referenceNumber,
      });
    } catch (error) {
      console.error("Create booking error:", error);
      res.status(500).json({
        message: "Server error while creating booking",
      });
    }
  }
);

// Update booking status (vendors can approve/reject, both can cancel)
router.put(
  "/:id/status",
  auth,
  [
    body("status")
      .isIn([
        "Pending",
        "Confirmed",
        "In Progress",
        "Completed",
        "Cancelled",
        "Rejected",
      ])
      .withMessage("Invalid status"),
    body("notes")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Notes cannot exceed 500 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: errors.array()[0].msg,
        });
      }

      const { status, notes } = req.body;

      const booking = await Booking.findById(req.params.id)
        .populate("customer", "name email")
        .populate("vendor", "name email")
        .populate("vehicle", "make model");

      if (!booking) {
        return res.status(404).json({
          message: "Booking not found",
        });
      }

      // Check permissions
      const isCustomer =
        booking.customer._id.toString() === req.user._id.toString();
      const isVendor =
        booking.vendor._id.toString() === req.user._id.toString();
      const isAdmin = req.user.role === "admin";

      if (!isCustomer && !isVendor && !isAdmin) {
        return res.status(403).json({
          message: "Access denied",
        });
      }

      // Status transition validation
      const currentStatus = booking.status;
      let isValidTransition = false;

      if (isVendor) {
        // Vendor can confirm/reject pending bookings, start confirmed bookings, complete in-progress bookings
        if (
          currentStatus === "Pending" &&
          ["Confirmed", "Rejected"].includes(status)
        ) {
          isValidTransition = true;
        } else if (currentStatus === "Confirmed" && status === "In Progress") {
          isValidTransition = true;
        } else if (currentStatus === "In Progress" && status === "Completed") {
          isValidTransition = true;
        }
      }

      if (isCustomer) {
        // Customer can cancel pending or confirmed bookings
        if (
          ["Pending", "Confirmed"].includes(currentStatus) &&
          status === "Cancelled"
        ) {
          isValidTransition = true;
        }
      }

      if (isAdmin) {
        // Admin can change any status
        isValidTransition = true;
      }

      if (!isValidTransition) {
        return res.status(400).json({
          message: `Cannot change booking status from ${currentStatus} to ${status}`,
        });
      }

      // Update booking
      booking.status = status;

      // Update timestamps and notes
      const now = new Date();
      switch (status) {
        case "Confirmed":
          booking.confirmedAt = now;
          if (notes) booking.vendorNotes = notes;
          break;
        case "Rejected":
          if (notes) booking.vendorNotes = notes;
          break;
        case "In Progress":
          booking.startedAt = now;
          break;
        case "Completed":
          booking.completedAt = now;
          // Update vehicle and user stats
          await Promise.all([
            Vehicle.findByIdAndUpdate(booking.vehicle._id, {
              $inc: { totalBookings: 1, totalEarnings: booking.totalAmount },
            }),
            User.findByIdAndUpdate(booking.vendor._id, {
              $inc: { "vendorInfo.totalEarnings": booking.totalAmount },
            }),
            User.findByIdAndUpdate(booking.customer._id, {
              $inc: { "customerInfo.totalSpent": booking.totalAmount },
            }),
          ]);
          break;
        case "Cancelled":
          booking.cancelledAt = now;
          if (notes) {
            if (isCustomer) booking.customerNotes = notes;
            else booking.vendorNotes = notes;
          }
          break;
      }

      await booking.save();

      res.json({
        message: `Booking ${status.toLowerCase()} successfully`,
        booking,
      });
    } catch (error) {
      console.error("Update booking status error:", error);
      if (error.name === "CastError") {
        return res.status(400).json({
          message: "Invalid booking ID format",
        });
      }
      res.status(500).json({
        message: "Server error while updating booking status",
      });
    }
  }
);


// Get booking analytics (vendors)
router.get("/analytics/summary", auth, async (req, res) => {
  try {
    if (req.user.role !== "vendor") {
      return res.status(403).json({
        message: "Only vendors can access booking analytics",
      });
    }

    const { startDate, endDate } = req.query;

    // Build date filter
    let dateFilter = { vendor: req.user._id };
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Get analytics
    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalEarnings,
      averageBookingValue,
    ] = await Promise.all([
      Booking.countDocuments(dateFilter),
      Booking.countDocuments({ ...dateFilter, status: "Pending" }),
      Booking.countDocuments({ ...dateFilter, status: "Confirmed" }),
      Booking.countDocuments({ ...dateFilter, status: "Completed" }),
      Booking.countDocuments({ ...dateFilter, status: "Cancelled" }),
      Booking.aggregate([
        { $match: { ...dateFilter, status: "Completed" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Booking.aggregate([
        { $match: dateFilter },
        { $group: { _id: null, avg: { $avg: "$totalAmount" } } },
      ]),
    ]);

    const analytics = {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      rejectedBookings:
        totalBookings -
        pendingBookings -
        confirmedBookings -
        completedBookings -
        cancelledBookings,
      totalEarnings: totalEarnings[0]?.total || 0,
      averageBookingValue:
        Math.round((averageBookingValue[0]?.avg || 0) * 100) / 100,
      conversionRate:
        totalBookings > 0
          ? Math.round((confirmedBookings / totalBookings) * 100)
          : 0,
    };

    res.json({ analytics });
  } catch (error) {
    console.error("Booking analytics error:", error);
    res.status(500).json({
      message: "Server error while fetching analytics",
    });
  }
});

// Cancel booking (soft delete)
router.delete("/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Only customer can cancel their own booking
    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only cancel your own bookings",
      });
    }

    // Can only cancel pending or confirmed bookings
    if (!["Pending", "Confirmed"].includes(booking.status)) {
      return res.status(400).json({
        message: "Cannot cancel booking in current status",
      });
    }

    booking.status = "Cancelled";
    booking.cancelledAt = new Date();
    await booking.save();

    res.json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid booking ID format",
      });
    }
    res.status(500).json({
      message: "Server error while cancelling booking",
    });
  }
});

module.exports = router;

// Add review to completed booking
router.post(
  "/:id/review",
  auth,
  [
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    body("comment")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Comment cannot exceed 500 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: errors.array()[0].msg,
        });
      }

      const { rating, comment } = req.body;

      const booking = await Booking.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({
          message: "Booking not found",
        });
      }

      if (booking.status !== "Completed") {
        return res.status(400).json({
          message: "Can only review completed bookings",
        });
      }

      const isCustomer =
        booking.customer.toString() === req.user._id.toString();

      if (!isCustomer) {
        return res.status(403).json({
          message: "Access denied",
        });
      }

      // Add review
      const reviewData = {
        rating: Number(rating),
        comment: comment?.trim(),
        reviewDate: new Date(),
      };

      if (booking.customerReview?.rating) {
        return res.status(400).json({
          message: "You have already reviewed this booking",
        });
      }
      booking.customerReview = reviewData;

      await booking.save();

      // Update overall ratings
      const vehicleReviews = await Booking.find({
        vehicle: booking.vehicle,
        status: "Completed",
        "customerReview.rating": { $exists: true },
      });

      const avgRating =
        vehicleReviews.reduce((sum, b) => sum + b.customerReview.rating, 0) /
        vehicleReviews.length;

      await Vehicle.findByIdAndUpdate(booking.vehicle, {
        rating: Math.round(avgRating * 10) / 10,
        totalReviews: vehicleReviews.length,
      });

      res.json({
        message: "Review added successfully",
        booking,
      });
    } catch (error) {
      console.error("Add review error:", error);
      res.status(500).json({
        message: "Server error while adding review",
      });
    }
  }
);
