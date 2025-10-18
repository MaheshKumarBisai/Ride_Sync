const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');

const resetDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Connected to MongoDB');

    await User.deleteMany({});
    console.log('Users collection cleared');

    await Vehicle.deleteMany({});
    console.log('Vehicles collection cleared');

    await Booking.deleteMany({});
    console.log('Bookings collection cleared');

    console.log('Database reset successfully');
    process.exit();
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
};

resetDatabase();