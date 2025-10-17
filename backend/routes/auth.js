const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || "fallback-secret-change-in-production",
    { expiresIn: "7d" }
  );
};

// Register user
router.post(
  "/register",
  [
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role")
      .isIn(["customer", "vendor"])
      .withMessage("Role must be either customer or vendor"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: errors.array()[0].msg,
          errors: errors.array(),
        });
      }

      const { name, email, password, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          message: "User already exists with this email address",
        });
      }

      // Create user with role-specific initialization
      const userData = {
        name: name.trim(),
        email: email.toLowerCase(),
        password,
        role,
      };

      // Initialize role-specific data
      if (role === "vendor") {
        userData.vendorInfo = {
          joinedDate: new Date(),
          totalEarnings: 0,
          rating: 0,
          totalReviews: 0,
        };
      } else {
        userData.customerInfo = {
          totalBookings: 0,
          totalSpent: 0,
          loyaltyPoints: 0,
        };
      }

      const user = new User(userData);
      await user.save();

      // Generate token
      const token = generateToken(user._id);

      // Update last login
      await user.updateLastLogin();

      res.status(201).json({
        message: `${
          role.charAt(0).toUpperCase() + role.slice(1)
        } account created successfully`,
        token,
        user: user.toJSON(),
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        message: "Server error during registration. Please try again.",
      });
    }
  }
);

// Login user
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: errors.array()[0].msg,
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      // Find user and include password for comparison
      const user = await User.findOne({ email: email.toLowerCase() }).select(
        "+password"
      );
      if (!user) {
        return res.status(400).json({
          message: "Invalid email or password",
        });
      }

      // Check if account is active
      if (!user.isActive) {
        return res.status(403).json({
          message: "Account has been deactivated. Please contact support.",
        });
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(400).json({
          message: "Invalid email or password",
        });
      }

      // Generate token
      const token = generateToken(user._id);

      // Update last login
      await user.updateLastLogin();

      // Remove password from response
      const userResponse = user.toJSON();

      res.json({
        message: `Welcome back, ${user.name}!`,
        token,
        user: userResponse,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        message: "Server error during login. Please try again.",
      });
    }
  }
);

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      user: user.toJSON(),
      stats: user.getStats(),
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      message: "Server error while fetching user data",
    });
  }
});

// Update user profile
router.put(
  "/profile",
  auth,
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),
    body("phone")
      .optional()
      .trim()
      .isMobilePhone("any")
      .withMessage("Invalid phone number format"),
    body("address.city")
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage("City must be at least 2 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: errors.array()[0].msg,
          errors: errors.array(),
        });
      }

      const allowedUpdates = ["name", "phone", "address", "profileImage"];
      const updates = {};

      // Filter allowed updates
      Object.keys(req.body).forEach((key) => {
        if (allowedUpdates.includes(key)) {
          updates[key] = req.body[key];
        }
      });

      // Update role-specific info if provided
      if (req.user.role === "vendor" && req.body.vendorInfo) {
        const allowedVendorUpdates = ["businessName"];
        Object.keys(req.body.vendorInfo).forEach((key) => {
          if (allowedVendorUpdates.includes(key)) {
            updates[`vendorInfo.${key}`] = req.body.vendorInfo[key];
          }
        });
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updates },
        { new: true, runValidators: true }
      );

      res.json({
        message: "Profile updated successfully",
        user: user.toJSON(),
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({
        message: "Server error while updating profile",
      });
    }
  }
);

// Change password
router.put(
  "/change-password",
  auth,
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: errors.array()[0].msg,
        });
      }

      const { currentPassword, newPassword } = req.body;

      // Get user with password
      const user = await User.findById(req.user._id).select("+password");

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(
        currentPassword
      );
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          message: "Current password is incorrect",
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("Password change error:", error);
      res.status(500).json({
        message: "Server error while changing password",
      });
    }
  }
);

// Get user dashboard stats
router.get("/stats", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const stats = user.getStats();

    if (req.user.role === "vendor") {
      // Get additional vendor stats
      const Vehicle = require("../models/Vehicle");
      const Booking = require("../models/Booking");

      const [vehicleCount, pendingBookings, totalBookings] = await Promise.all([
        Vehicle.countDocuments({ owner: req.user._id, status: "Available" }),
        Booking.countDocuments({ vendor: req.user._id, status: "Pending" }),
        Booking.countDocuments({ vendor: req.user._id }),
      ]);

      stats.vehicleCount = vehicleCount;
      stats.pendingBookings = pendingBookings;
      stats.totalBookings = totalBookings;
    } else {
      // Get additional customer stats
      const Booking = require("../models/Booking");

      const [totalBookings, activeBookings] = await Promise.all([
        Booking.countDocuments({ customer: req.user._id }),
        Booking.countDocuments({
          customer: req.user._id,
          status: { $in: ["Confirmed", "In Progress"] },
        }),
      ]);

      stats.totalBookings = totalBookings;
      stats.activeBookings = activeBookings;
    }

    res.json({ stats });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({
      message: "Server error while fetching stats",
    });
  }
});

module.exports = router;
