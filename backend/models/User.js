const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['customer', 'vendor', 'admin'],
    default: 'customer',
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  // Vendor-specific fields
  vendorInfo: {
    businessName: String,
    licenseNumber: String,
    isLicenseVerified: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    joinedDate: { type: Date, default: Date.now }
  },
  // Customer-specific fields
  customerInfo: {
    totalBookings: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    preferredVehicleType: String,
    loyaltyPoints: { type: Number, default: 0 }
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// Get user stats
userSchema.methods.getStats = function() {
  if (this.role === 'vendor') {
    return {
      totalEarnings: this.vendorInfo?.totalEarnings || 0,
      rating: this.vendorInfo?.rating || 0,
      totalReviews: this.vendorInfo?.totalReviews || 0
    };
  } else {
    return {
      totalBookings: this.customerInfo?.totalBookings || 0,
      totalSpent: this.customerInfo?.totalSpent || 0,
      loyaltyPoints: this.customerInfo?.loyaltyPoints || 0
    };
  }
};

module.exports = mongoose.model('User', userSchema);
