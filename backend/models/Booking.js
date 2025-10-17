const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer is required'],
    index: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Vendor is required'],
    index: true
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Vehicle is required'],
    index: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    index: true
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    index: true
  },
  totalDays: {
    type: Number,
    required: [true, 'Total days is required'],
    min: [1, 'Booking must be for at least 1 day']
  },
  pricePerDay: {
    type: Number,
    required: [true, 'Price per day is required'],
    min: [0, 'Price per day cannot be negative']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'Rejected'],
    default: 'Pending',
    index: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'UPI', 'Net Banking', 'Wallet'],
    default: 'Cash'
  },
  pickupLocation: {
    type: String,
    required: [true, 'Pickup location is required'],
    trim: true
  },
  dropoffLocation: {
    type: String,
    trim: true
  },
  pickupCoordinates: {
    latitude: Number,
    longitude: Number
  },
  dropoffCoordinates: {
    latitude: Number,
    longitude: Number
  },
  customerNotes: {
    type: String,
    maxlength: [500, 'Customer notes cannot exceed 500 characters'],
    trim: true
  },
  vendorNotes: {
    type: String,
    maxlength: [500, 'Vendor notes cannot exceed 500 characters'],
    trim: true
  },
  // Booking timeline
  requestedAt: {
    type: Date,
    default: Date.now
  },
  confirmedAt: Date,
  startedAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  // Verification and security
  otp: {
    pickup: String,
    dropoff: String
  },
  verificationStatus: {
    pickup: { type: Boolean, default: false },
    dropoff: { type: Boolean, default: false }
  },
  // Additional charges
  additionalCharges: [{
    type: String, // 'fuel', 'cleaning', 'damage', 'late_return'
    amount: Number,
    description: String
  }],
  totalAdditionalCharges: {
    type: Number,
    default: 0
  },
  finalAmount: {
    type: Number,
    default: function() { return this.totalAmount; }
  },
  // Reviews and ratings
  customerReview: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String, maxlength: 500 },
    reviewDate: Date
  },
  vendorReview: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String, maxlength: 500 },
    reviewDate: Date
  },
  // Communication
  messages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
bookingSchema.index({ customer: 1, status: 1 });
bookingSchema.index({ vendor: 1, status: 1 });
bookingSchema.index({ vehicle: 1, status: 1 });
bookingSchema.index({ startDate: 1, endDate: 1 });
bookingSchema.index({ status: 1, createdAt: -1 });

// Virtual for booking duration in hours
bookingSchema.virtual('durationInHours').get(function() {
  if (this.startedAt && this.completedAt) {
    return Math.ceil((this.completedAt - this.startedAt) / (1000 * 60 * 60));
  }
  return this.totalDays * 24;
});

// Virtual for booking reference number
bookingSchema.virtual('referenceNumber').get(function() {
  return `RS${this._id.toString().slice(-8).toUpperCase()}`;
});

// Pre-save validation
bookingSchema.pre('save', function(next) {
  // Validate dates
  if (this.startDate >= this.endDate) {
    return next(new Error('End date must be after start date'));
  }

  if (this.startDate < new Date(Date.now() - 24 * 60 * 60 * 1000)) {
    return next(new Error('Start date cannot be in the past'));
  }

  // Calculate total days if not provided
  if (!this.totalDays) {
    this.totalDays = Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
  }

  // Calculate total amount if not provided
  if (!this.totalAmount && this.pricePerDay) {
    this.totalAmount = this.totalDays * this.pricePerDay;
  }

  // Calculate final amount including additional charges
  this.finalAmount = this.totalAmount + (this.totalAdditionalCharges || 0);

  // Set default dropoff location to pickup location if not provided
  if (!this.dropoffLocation) {
    this.dropoffLocation = this.pickupLocation;
  }

  next();
});

// Method to check if booking conflicts with another booking
bookingSchema.methods.hasConflict = async function() {
  const conflictingBookings = await this.constructor.find({
    vehicle: this.vehicle,
    _id: { $ne: this._id },
    status: { $in: ['Pending', 'Confirmed', 'In Progress'] },
    $or: [
      {
        startDate: { $lte: this.startDate },
        endDate: { $gt: this.startDate }
      },
      {
        startDate: { $lt: this.endDate },
        endDate: { $gte: this.endDate }
      },
      {
        startDate: { $gte: this.startDate },
        endDate: { $lte: this.endDate }
      }
    ]
  });

  return conflictingBookings.length > 0;
};

// Method to approve booking
bookingSchema.methods.approve = async function() {
  this.status = 'Confirmed';
  this.confirmedAt = new Date();
  return this.save();
};

// Method to reject booking
bookingSchema.methods.reject = async function(reason) {
  this.status = 'Rejected';
  this.vendorNotes = reason || 'Booking rejected by vendor';
  return this.save();
};

// Method to start trip
bookingSchema.methods.startTrip = async function() {
  this.status = 'In Progress';
  this.startedAt = new Date();
  return this.save();
};

// Method to complete trip
bookingSchema.methods.completeTrip = async function() {
  this.status = 'Completed';
  this.completedAt = new Date();
  return this.save();
};

// Method to cancel booking
bookingSchema.methods.cancel = async function(reason) {
  this.status = 'Cancelled';
  this.cancelledAt = new Date();
  this.customerNotes = reason || 'Booking cancelled by customer';
  return this.save();
};

// Static method to get vendor bookings
bookingSchema.statics.getVendorBookings = function(vendorId, status) {
  const query = { vendor: vendorId };
  if (status && status !== 'all') {
    query.status = status.charAt(0).toUpperCase() + status.slice(1);
  }

  return this.find(query)
    .populate('customer', 'name email phone')
    .populate('vehicle', 'make model type image')
    .sort({ createdAt: -1 });
};

// Static method to get customer bookings
bookingSchema.statics.getCustomerBookings = function(customerId, status) {
  const query = { customer: customerId };
  if (status && status !== 'all') {
    query.status = status.charAt(0).toUpperCase() + status.slice(1);
  }

  return this.find(query)
    .populate('vendor', 'name email phone')
    .populate('vehicle', 'make model type image location')
    .sort({ createdAt: -1 });
};

module.exports = mongoose.model('Booking', bookingSchema);
