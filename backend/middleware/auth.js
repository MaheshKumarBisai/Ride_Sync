const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    let token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ 
        message: 'Access denied. No authentication token provided.' 
      });
    }

    // Remove Bearer from token
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft();
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-change-in-production');

    // Get user from database
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid authentication token.' 
      });
    }

    // Check if user account is active
    if (!user.isActive) {
      return res.status(403).json({ 
        message: 'Account has been deactivated. Please contact support.' 
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid authentication token.' 
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Authentication token has expired. Please login again.' 
      });
    }

    res.status(500).json({ 
      message: 'Server error during authentication.' 
    });
  }
};

// Middleware to check specific roles
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentication required.' 
      });
    }

    const userRoles = Array.isArray(roles) ? roles : [roles];

    if (!userRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Requires ${userRoles.join(' or ')} role.` 
      });
    }

    next();
  };
};

// Middleware to check if user is a vendor
const requireVendor = requireRole('vendor');

// Middleware to check if user is a customer
const requireCustomer = requireRole('customer');

// Middleware to check if user is an admin
const requireAdmin = requireRole('admin');

module.exports = {
  auth,
  requireRole,
  requireVendor,
  requireCustomer,
  requireAdmin
};
