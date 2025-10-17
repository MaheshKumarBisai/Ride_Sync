const express = require("express");
const { body, validationResult } = require("express-validator");
const Vehicle = require("../models/Vehicle");
const User = require("../models/User");
const { auth, requireVendor } = require("../middleware/auth");

const router = express.Router();

// Get all vehicles with advanced filtering and search
router.get("/", async (req, res) => {
  try {
    const {
      search,
      type,
      location,
      minPrice,
      maxPrice,
      owner,
      status = "Available",
      page = 1,
      limit = 12,
      sortBy = "createdAt",
      sortOrder = "desc",
      vendor, // Special flag for vendor routes
    } = req.query;

    // Build query
    let query = {};

    // If the user is a vendor, only show their vehicles
    if (req.user && req.user.role === 'vendor') {
      query.owner = req.user._id;
    } else {
      // For public listings, only show available vehicles
      query.status = status;

      // If user is logged in and has a location, filter by their city
      if (req.user && req.user.address && req.user.address.city) {
        query.location = { $regex: req.user.address.city, $options: 'i' };
      }
    }

    // Search functionality
    if (search) {
      query.$or = [
        { make: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filters
    if (type && type !== "All") query.type = type;
    if (location) query.location = { $regex: location, $options: "i" };
    if (owner) query.owner = owner;

    // Price range filter
    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }

    // Sorting options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute query with pagination
    const vehicles = await Vehicle.find(query)
      .populate(
        "owner",
        "name email phone vendorInfo.rating vendorInfo.totalReviews"
      )
      .sort(sortOptions)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    // Get total count for pagination
    const total = await Vehicle.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(total / Number(limit));
    const hasNextPage = Number(page) < totalPages;
    const hasPrevPage = Number(page) > 1;

    res.json({
      vehicles,
      pagination: {
        currentPage: Number(page),
        totalPages,
        total,
        hasNextPage,
        hasPrevPage,
        limit: Number(limit),
      },
      filters: {
        search: search || "",
        type: type || "",
        location: location || "",
        minPrice: minPrice || "",
        maxPrice: maxPrice || "",
        sortBy,
        sortOrder,
      },
    });
  } catch (error) {
    console.error("Get vehicles error:", error);
    res.status(500).json({
      message: "Server error while fetching vehicles",
    });
  }
});

// Get single vehicle with detailed information
router.get("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate(
      "owner",
      "name email phone vendorInfo.rating vendorInfo.totalReviews vendorInfo.joinedDate"
    );

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    // Get related vehicles (same type, nearby location)
    const relatedVehicles = await Vehicle.find({
      _id: { $ne: vehicle._id },
      type: vehicle.type,
      location: { $regex: vehicle.location, $options: "i" },
      status: "Available",
    })
      .limit(4)
      .populate("owner", "name vendorInfo.rating");

    res.json({
      vehicle,
      relatedVehicles,
      owner: vehicle.owner,
    });
  } catch (error) {
    console.error("Get vehicle error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid vehicle ID format",
      });
    }
    res.status(500).json({
      message: "Server error while fetching vehicle",
    });
  }
});

// Create vehicle (vendors only)
router.post(
  "/",
  auth,
  [
    body("make").trim().notEmpty().withMessage("Vehicle make is required"),
    body("model").trim().notEmpty().withMessage("Vehicle model is required"),
    body("year")
      .isInt({ min: 1980, max: new Date().getFullYear() })
      .withMessage("Invalid vehicle year"),
    body("type")
      .isIn(["Car", "Bike", "Scooter"])
      .withMessage("Invalid vehicle type"),
    body("registrationNumber")
      .trim()
      .notEmpty()
      .withMessage("Registration number is required"),
    body("color").trim().notEmpty().withMessage("Vehicle color is required"),
    body("pricePerDay")
      .isFloat({ min: 1 })
      .withMessage("Price per day must be a positive number"),
    body("location").trim().notEmpty().withMessage("Location is required"),
    body("seatingCapacity")
      .optional()
      .isInt({ min: 1, max: 20 })
      .withMessage("Seating capacity must be between 1 and 20"),
  ],
  async (req, res) => {
    try {
      // Check if user is a vendor
      if (req.user.role !== "vendor") {
        return res.status(403).json({
          message: "Only vendors can add vehicles",
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: errors.array()[0].msg,
          errors: errors.array(),
        });
      }

      // Check if registration number already exists
      const existingVehicle = await Vehicle.findOne({
        registrationNumber: req.body.registrationNumber.toUpperCase(),
      });

      if (existingVehicle) {
        return res.status(400).json({
          message: "Vehicle with this registration number already exists",
        });
      }

      // Create vehicle
      const vehicleData = {
        ...req.body,
        owner: req.user._id,
        registrationNumber: req.body.registrationNumber.toUpperCase(),
      };

      // Set default image if not provided
      // If images array provided, ensure primary image is set
      if (
        (!vehicleData.image || vehicleData.image === "") &&
        Array.isArray(vehicleData.images) &&
        vehicleData.images.length > 0
      ) {
        vehicleData.image = vehicleData.images[0];
      }

      if (!vehicleData.image) {
        const defaultImages = {
          Car: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=600&h=400&fit=crop",
          Bike: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
          Scooter:
            "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop",
        };
        vehicleData.image = defaultImages[vehicleData.type];
      }

      const vehicle = new Vehicle(vehicleData);
      await vehicle.save();

      await vehicle.populate("owner", "name email phone");

      res.status(201).json({
        message: "Vehicle added successfully",
        vehicle,
      });
    } catch (error) {
      console.error("Create vehicle error:", error);
      res.status(500).json({
        message: "Server error while adding vehicle",
      });
    }
  }
);

// Update vehicle (owner only)
router.put(
  "/:id",
  auth,
  [
    body("pricePerDay")
      .optional()
      .isFloat({ min: 1 })
      .withMessage("Price per day must be a positive number"),
    body("pricePerHour")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Price per hour cannot be negative"),
    body("description")
      .optional()
      .isLength({ max: 1000 })
      .withMessage("Description cannot exceed 1000 characters"),
    body("status")
      .optional()
      .isIn(["Available", "Rented", "Maintenance", "Inactive"])
      .withMessage("Invalid status"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: errors.array()[0].msg,
        });
      }

      const vehicle = await Vehicle.findById(req.params.id);

      if (!vehicle) {
        return res.status(404).json({
          message: "Vehicle not found",
        });
      }

      // Check ownership or admin role
      if (
        vehicle.owner.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          message: "You can only update your own vehicles",
        });
      }

      // Update allowed fields
      const allowedUpdates = [
        "pricePerDay",
        "pricePerHour",
        "description",
        "features",
        "status",
        "location",
        "image",
        "images",
        "color",
      ];

      const updates = {};
      Object.keys(req.body).forEach((key) => {
        if (allowedUpdates.includes(key)) {
          updates[key] = req.body[key];
        }
      });

      const updatedVehicle = await Vehicle.findByIdAndUpdate(
        req.params.id,
        { $set: updates },
        { new: true, runValidators: true }
      ).populate("owner", "name email phone");

      res.json({
        message: "Vehicle updated successfully",
        vehicle: updatedVehicle,
      });
    } catch (error) {
      console.error("Update vehicle error:", error);
      if (error.name === "CastError") {
        return res.status(400).json({
          message: "Invalid vehicle ID format",
        });
      }
      res.status(500).json({
        message: "Server error while updating vehicle",
      });
    }
  }
);

// Delete vehicle (owner only)
router.delete("/:id", auth, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    // Check ownership or admin role
    if (
      vehicle.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You can only delete your own vehicles",
      });
    }

    // Check if vehicle has active bookings
    const Booking = require("../models/Booking");
    const activeBookings = await Booking.countDocuments({
      vehicle: req.params.id,
      status: { $in: ["Confirmed", "In Progress"] },
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        message: "Cannot delete vehicle with active bookings",
      });
    }

    await Vehicle.findByIdAndDelete(req.params.id);

    res.json({
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    console.error("Delete vehicle error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid vehicle ID format",
      });
    }
    res.status(500).json({
      message: "Server error while deleting vehicle",
    });
  }
});

// Get vehicle analytics (owner only)
router.get("/:id/analytics", auth, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    // Check ownership
    if (vehicle.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const Booking = require("../models/Booking");

    // Get booking statistics
    const [totalBookings, completedBookings, totalEarnings, averageRating] =
      await Promise.all([
        Booking.countDocuments({ vehicle: req.params.id }),
        Booking.countDocuments({ vehicle: req.params.id, status: "Completed" }),
        Booking.aggregate([
          { $match: { vehicle: vehicle._id, status: "Completed" } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]),
        Booking.aggregate([
          {
            $match: {
              vehicle: vehicle._id,
              status: "Completed",
              "customerReview.rating": { $exists: true },
            },
          },
          {
            $group: {
              _id: null,
              avgRating: { $avg: "$customerReview.rating" },
            },
          },
        ]),
      ]);

    const analytics = {
      totalBookings,
      completedBookings,
      totalEarnings: totalEarnings[0]?.total || 0,
      averageRating: averageRating[0]?.avgRating || 0,
      utilizationRate:
        totalBookings > 0
          ? ((completedBookings / totalBookings) * 100).toFixed(1)
          : 0,
    };

    res.json({
      vehicle: {
        _id: vehicle._id,
        make: vehicle.make,
        model: vehicle.model,
        type: vehicle.type,
      },
      analytics,
    });
  } catch (error) {
    console.error("Vehicle analytics error:", error);
    res.status(500).json({
      message: "Server error while fetching analytics",
    });
  }
});

module.exports = router;
