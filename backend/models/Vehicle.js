const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  make: {
    type: String,
    required: [true, 'Vehicle make is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Vehicle model is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Vehicle year is required'],
    min: [1980, 'Year must be 1980 or later'],
    max: [new Date().getFullYear(), 'Year cannot be in the future']
  },
  type: {
    type: String,
    required: [true, 'Vehicle type is required'],
    enum: ['Car', 'Bike', 'Scooter'],
    index: true
  },
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  color: {
    type: String,
    required: [true, 'Vehicle color is required'],
    trim: true
  },
  fuelType: {
    type: String,
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
    default: 'Petrol'
  },
  transmission: {
    type: String,
    enum: ['Manual', 'Automatic'],
    default: 'Manual'
  },
  seatingCapacity: {
    type: Number,
    min: [1, 'Seating capacity must be at least 1'],
    max: [20, 'Seating capacity cannot exceed 20']
  },
  pricePerDay: {
    type: Number,
    required: [true, 'Price per day is required'],
    min: [1, 'Price per day must be positive']
  },
  pricePerHour: {
    type: Number,
    min: [0, 'Price per hour cannot be negative'],
    default: 0
  },
  location: {
    type: String,
    required: [true, 'Vehicle location is required'],
    trim: true,
    index: true
  },
  coordinates: {
    latitude: {
      type: Number,
      min: [-90, 'Invalid latitude'],
      max: [90, 'Invalid latitude']
    },
    longitude: {
      type: Number,
      min: [-180, 'Invalid longitude'],
      max: [180, 'Invalid longitude']
    }
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    trim: true
  },
  features: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String,
  }],
  image: String,
  images: [String],
  status: {
    type: String,
    enum: ['Available', 'Rented', 'Maintenance', 'Inactive'],
    default: 'Available',
    index: true
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5'],
    default: 4.0
  },
  totalReviews: {
    type: Number,
    min: [0, 'Total reviews cannot be negative'],
    default: 0
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Vehicle owner is required'],
    index: true
  },
  // Analytics
  totalBookings: {
    type: Number,
    default: 0,
    min: [0, 'Total bookings cannot be negative']
  },
  totalEarnings: {
    type: Number,
    default: 0,
    min: [0, 'Total earnings cannot be negative']
  },
  averageRating: {
    type: Number,
    min: [0, 'Average rating cannot be negative'],
    max: [5, 'Average rating cannot exceed 5'],
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDate: Date,
  lastMaintenanceDate: Date,
  nextMaintenanceDate: Date,
  // Insurance
  insuranceInfo: {
    provider: String,
    policyNumber: String,
    expiryDate: Date,
    isActive: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
vehicleSchema.index({ type: 1, location: 1 });
vehicleSchema.index({ pricePerDay: 1 });
vehicleSchema.index({ rating: -1 });
vehicleSchema.index({ status: 1 });
vehicleSchema.index({ owner: 1, status: 1 });

// Text search index
vehicleSchema.index({
  make: 'text',
  model: 'text', 
  location: 'text',
  description: 'text'
});

// Virtual for full name
vehicleSchema.virtual('fullName').get(function() {
  return `${this.make} ${this.model}`;
});

// Virtual for age
vehicleSchema.virtual('age').get(function() {
  return new Date().getFullYear() - this.year;
});

// Method to check if vehicle is available for booking
vehicleSchema.methods.isAvailableForBooking = function() {
  return this.status === 'Available' && this.isVerified;
};

// Method to update earnings
vehicleSchema.methods.addEarnings = function(amount) {
  this.totalEarnings += amount;
  this.totalBookings += 1;
  return this.save();
};

// Static method to find available vehicles
vehicleSchema.statics.findAvailable = function(filters = {}) {
  return this.find({
    status: 'Available',
    ...filters
  }).populate('owner', 'name email phone rating');
};

// Static method for search
vehicleSchema.statics.search = function(query, filters = {}) {
  const searchQuery = {
    $and: [
      { status: 'Available' },
      {
        $or: [
          { $text: { $search: query } },
          { make: { $regex: query, $options: 'i' } },
          { model: { $regex: query, $options: 'i' } },
          { location: { $regex: query, $options: 'i' } }
        ]
      }
    ]
  };

  // Add filters
  if (filters.type) searchQuery.$and.push({ type: filters.type });
  if (filters.minPrice) searchQuery.$and.push({ pricePerDay: { $gte: filters.minPrice } });
  if (filters.maxPrice) searchQuery.$and.push({ pricePerDay: { $lte: filters.maxPrice } });
  if (filters.location) searchQuery.$and.push({ location: { $regex: filters.location, $options: 'i' } });

  return this.find(searchQuery).populate('owner', 'name email phone');
};

module.exports = mongoose.model('Vehicle', vehicleSchema);
