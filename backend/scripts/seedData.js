const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ridesync-enhanced', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleUsers = [
  {
    name: 'John Customer',
    email: 'john@example.com',
    password: 'password123',
    role: 'customer',
    phone: '+91-9876543210',
    customerInfo: {
      totalBookings: 0,
      totalSpent: 0,
      preferredVehicleType: 'Car',
      loyaltyPoints: 0
    },
    address: {
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001'
    }
  },
  {
    name: 'Jane Vendor',
    email: 'jane@example.com',
    password: 'password123',
    role: 'vendor',
    phone: '+91-9876543211',
    vendorInfo: {
      businessName: 'Jane\'s Vehicle Rental',
      isLicenseVerified: true,
      rating: 4.5,
      totalReviews: 25,
      totalEarnings: 0,
      joinedDate: new Date()
    },
    address: {
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110002'
    }
  },
  {
    name: 'Mike Vendor',
    email: 'mike@example.com',
    password: 'password123',
    role: 'vendor',
    phone: '+91-9876543212',
    vendorInfo: {
      businessName: 'Mike\'s Motors',
      isLicenseVerified: true,
      rating: 4.7,
      totalReviews: 18,
      totalEarnings: 0,
      joinedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    },
    address: {
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001'
    }
  },
  {
    name: 'Sarah Customer',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'customer',
    phone: '+91-9876543213',
    customerInfo: {
      totalBookings: 0,
      totalSpent: 0,
      preferredVehicleType: 'Bike',
      loyaltyPoints: 50
    },
    address: {
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001'
    }
  },
  {
    name: 'Admin User',
    email: 'admin@ridesync.com',
    password: 'admin123',
    role: 'admin',
    phone: '+91-9876543214'
  }
];

const sampleVehicles = [
  // Jane's Vehicles (Delhi)
  {
    make: 'Maruti Suzuki',
    model: 'Swift Dzire',
    year: 2022,
    type: 'Car',
    registrationNumber: 'DL01AB1234',
    color: 'Pearl White',
    fuelType: 'Petrol',
    transmission: 'Manual',
    seatingCapacity: 5,
    pricePerDay: 2500,
    pricePerHour: 250,
    location: 'Delhi',
    description: 'Well-maintained sedan with AC, power steering, and GPS navigation. Perfect for city travel and outstation trips.',
    features: ['AC', 'GPS Navigation', 'Power Steering', 'Bluetooth', 'USB Charging', 'Comfortable Seating'],
    image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=600&h=400&fit=crop',
    status: 'Available',
    rating: 4.5,
    totalReviews: 12,
    isVerified: true
  },
  {
    make: 'Hero',
    model: 'Splendor Plus',
    year: 2023,
    type: 'Bike',
    registrationNumber: 'DL04GH5678',
    color: 'Black Red',
    fuelType: 'Petrol',
    transmission: 'Manual',
    seatingCapacity: 2,
    pricePerDay: 800,
    pricePerHour: 100,
    location: 'Delhi',
    description: 'Reliable and fuel-efficient motorcycle perfect for city rides. Latest model with digital console.',
    features: ['Self Start', 'LED Headlight', 'Digital Meter', 'Fuel Efficient', 'Comfortable Seat'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
    status: 'Available',
    rating: 4.2,
    totalReviews: 8,
    isVerified: true
  },
  {
    make: 'Honda',
    model: 'Activa 6G',
    year: 2023,
    type: 'Scooter',
    registrationNumber: 'DL08CD9012',
    color: 'Matte Blue',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seatingCapacity: 2,
    pricePerDay: 600,
    pricePerHour: 80,
    location: 'Delhi',
    description: 'Comfortable automatic scooter ideal for daily commuting. Features under-seat storage and LED lights.',
    features: ['Automatic', 'Under Seat Storage', 'LED Lights', 'Mobile Charging', 'Comfortable Ride'],
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop',
    status: 'Available',
    rating: 4.4,
    totalReviews: 15,
    isVerified: true
  },
  // Mike's Vehicles (Mumbai)
  {
    make: 'Hyundai',
    model: 'i20',
    year: 2021,
    type: 'Car',
    registrationNumber: 'MH02MN3456',
    color: 'Fiery Red',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seatingCapacity: 5,
    pricePerDay: 3000,
    pricePerHour: 300,
    location: 'Mumbai',
    description: 'Stylish hatchback with premium features and smooth automatic transmission. Great for city drives.',
    features: ['Automatic AC', 'Touchscreen Infotainment', 'Reverse Camera', 'Keyless Entry', 'Push Start'],
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop',
    status: 'Available',
    rating: 4.6,
    totalReviews: 9,
    isVerified: true
  },
  {
    make: 'Royal Enfield',
    model: 'Classic 350',
    year: 2022,
    type: 'Bike',
    registrationNumber: 'MH12PQ7890',
    color: 'Stealth Black',
    fuelType: 'Petrol',
    transmission: 'Manual',
    seatingCapacity: 2,
    pricePerDay: 1200,
    pricePerHour: 150,
    location: 'Mumbai',
    description: 'Classic cruiser motorcycle for long rides and adventures. Perfect for weekend getaways.',
    features: ['Electric Start', 'Dual Channel ABS', 'Alloy Wheels', 'Classic Design', 'Comfortable Riding'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
    status: 'Available',
    rating: 4.8,
    totalReviews: 6,
    isVerified: true
  },
  {
    make: 'TVS',
    model: 'Jupiter',
    year: 2023,
    type: 'Scooter',
    registrationNumber: 'MH09RS4567',
    color: 'Titanium Grey',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seatingCapacity: 2,
    pricePerDay: 550,
    pricePerHour: 70,
    location: 'Mumbai',
    description: 'Feature-rich scooter with excellent mileage and comfort. Perfect for daily commute.',
    features: ['External Fuel Fill', 'USB Charging', 'LED DRL', 'Digital Console', 'Large Storage'],
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop',
    status: 'Available',
    rating: 4.3,
    totalReviews: 11,
    isVerified: true
  }
];

const seedData = async () => {
  try {
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Booking.deleteMany({});

    console.log('👥 Creating users...');
    const users = await User.create(sampleUsers);
    console.log(`✅ Created ${users.length} users`);

    // Find vendors for vehicle assignment
    const janeVendor = users.find(user => user.email === 'jane@example.com');
    const mikeVendor = users.find(user => user.email === 'mike@example.com');

    console.log('🚗 Creating vehicles...');
    const vehiclesWithOwners = [
      { ...sampleVehicles[0], owner: janeVendor._id },
      { ...sampleVehicles[1], owner: janeVendor._id },
      { ...sampleVehicles[2], owner: janeVendor._id },
      { ...sampleVehicles[3], owner: mikeVendor._id },
      { ...sampleVehicles[4], owner: mikeVendor._id },
      { ...sampleVehicles[5], owner: mikeVendor._id }
    ];

    const vehicles = await Vehicle.create(vehiclesWithOwners);
    console.log(`✅ Created ${vehicles.length} vehicles`);

    // Create sample bookings with future dates (to pass validation)
    const johnCustomer = users.find(user => user.email === 'john@example.com');
    const sarahCustomer = users.find(user => user.email === 'sarah@example.com');

    console.log('📝 Creating sample bookings...');
    const sampleBookings = [
      {
        customer: johnCustomer._id,
        vendor: janeVendor._id,
        vehicle: vehicles[0]._id, // Swift Dzire
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
        totalDays: 2,
        pricePerDay: vehicles[0].pricePerDay,
        totalAmount: vehicles[0].pricePerDay * 2,
        pickupLocation: 'Connaught Place, Delhi',
        dropoffLocation: 'Connaught Place, Delhi',
        customerNotes: 'Need the car for a weekend trip to Agra',
        status: 'Confirmed',
        confirmedAt: new Date(),
        paymentStatus: 'Paid'
      },
      {
        customer: sarahCustomer._id,
        vendor: mikeVendor._id,
        vehicle: vehicles[4]._id, // Royal Enfield
        startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        totalDays: 2,
        pricePerDay: vehicles[4].pricePerDay,
        totalAmount: vehicles[4].pricePerDay * 2,
        pickupLocation: 'Bandra West, Mumbai',
        dropoffLocation: 'Bandra West, Mumbai',
        customerNotes: 'Planning a ride to Lonavala',
        status: 'Pending',
        paymentStatus: 'Pending'
      }
    ];

    // Save sample bookings
    const bookings = [];
    for (const bookingData of sampleBookings) {
      const booking = new Booking(bookingData);
      await booking.save({ validateBeforeSave: true });
      bookings.push(booking);
    }

    // Completed booking: create with future dates, then update to historical dates (bypassing validation)
    console.log('📝 Creating completed booking...');
    const completedBooking = new Booking({
      customer: johnCustomer._id,
      vendor: janeVendor._id,
      vehicle: vehicles[1]._id, // Hero Splendor
      startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      totalDays: 2,
      pricePerDay: vehicles[1].pricePerDay,
      totalAmount: vehicles[1].pricePerDay * 2,
      pickupLocation: 'Karol Bagh, Delhi',
      dropoffLocation: 'Karol Bagh, Delhi',
      status: 'Completed',
      paymentStatus: 'Paid',
      customerReview: {
        rating: 5,
        comment: 'Great bike, well maintained and fuel efficient!',
        reviewDate: new Date()
      }
    });
    await completedBooking.save({ validateBeforeSave: false });
    await Booking.updateOne(
      { _id: completedBooking._id },
      {
        $set: {
          startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
          confirmedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
          startedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          completedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
        }
      }
    );

    console.log(`✅ Created completed booking with historical dates`);

    console.log('\n🎉 Enhanced sample data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
