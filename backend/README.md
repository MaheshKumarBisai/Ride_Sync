# RideSync Enhanced Backend API

A comprehensive, production-ready backend API for the RideSync vehicle rental platform with advanced features, role-based access control, and robust booking management.

## 🚀 Features

### 🔐 Advanced Authentication & Authorization
- **JWT-based authentication** with secure token handling
- **Role-based access control** (Customer, Vendor, Admin)
- **Password hashing** with bcrypt (12 rounds)
- **Token expiration** and refresh mechanisms
- **Account activation/deactivation** support
- **Session management** with last login tracking

### 👥 User Management
- **Role-specific user profiles** with dedicated info sections
- **Comprehensive user validation** with express-validator
- **Profile management** with update capabilities
- **User statistics** and analytics
- **Password change** functionality
- **User preferences** and settings

### 🚗 Advanced Vehicle Management
- **Comprehensive vehicle catalog** with detailed specifications
- **Advanced search & filtering** (text search, location, price, type)
- **Vehicle verification** and approval system
- **Analytics tracking** (bookings, earnings, ratings)
- **Image management** with URL validation
- **Status management** (Available, Rented, Maintenance, Inactive)
- **Owner-based vehicle management** for vendors

### 📅 Sophisticated Booking System
- **Complete booking lifecycle** management
- **Conflict detection** and prevention
- **Status transitions** with proper validations
- **Review and rating system** for completed bookings
- **Booking analytics** and reporting
- **Communication system** between customers and vendors
- **Cancellation policies** and handling
- **Payment status tracking**

### 📊 Analytics & Reporting
- **Vendor analytics** (earnings, bookings, performance)
- **Customer statistics** (spending, loyalty points)
- **Vehicle performance** tracking
- **Booking conversion** rates
- **Revenue reporting** and insights

### 🛡️ Security & Performance
- **Rate limiting** to prevent abuse
- **Input validation** and sanitization
- **CORS configuration** for cross-origin requests
- **Error handling** with detailed logging
- **Database indexing** for optimized queries
- **Pagination support** for large datasets

## 🛠 Technology Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **express-rate-limit** - Rate limiting middleware

## 📋 Prerequisites

- Node.js 16.x or higher
- MongoDB 5.x or higher (local or MongoDB Atlas)
- npm or yarn package manager

## ⚡ Quick Start

### 1. Installation

```bash
# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env
```

### 2. Environment Configuration

Edit `.env` file with your settings:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ridesync-enhanced

# Authentication (CHANGE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### 3. Database Setup

```bash
# Start MongoDB (if running locally)
mongod

# Seed sample data
npm run seed
```

### 4. Start Development Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The API will be available at: `http://localhost:4000`

## 🔗 API Endpoints

### Authentication & Users
```
POST   /api/auth/register        - User registration
POST   /api/auth/login           - User login
GET    /api/auth/me              - Get current user
PUT    /api/auth/profile         - Update user profile
PUT    /api/auth/change-password - Change password
GET    /api/auth/stats           - Get user statistics
```

### Vehicles
```
GET    /api/vehicles             - List vehicles (with filters)
GET    /api/vehicles/:id         - Get vehicle details
POST   /api/vehicles             - Create vehicle (vendors)
PUT    /api/vehicles/:id         - Update vehicle (owners)
DELETE /api/vehicles/:id         - Delete vehicle (owners)
GET    /api/vehicles/:id/analytics - Get vehicle analytics
```

### Bookings
```
GET    /api/bookings             - Get user bookings
GET    /api/bookings/:id         - Get booking details
POST   /api/bookings             - Create booking (customers)
PUT    /api/bookings/:id/status  - Update booking status
POST   /api/bookings/:id/review  - Add review (completed bookings)
GET    /api/bookings/analytics/summary - Booking analytics (vendors)
DELETE /api/bookings/:id         - Cancel booking (customers)
```

## 👤 Demo User Accounts

After running `npm run seed`, you can use these accounts:

### 🔵 Customers
```
Email: john@example.com
Password: password123
Features: Has booking history, reviews

Email: sarah@example.com  
Password: password123
Features: New customer account
```

### 🟢 Vendors
```
Email: jane@example.com
Password: password123
Features: 3 vehicles in Delhi, active bookings

Email: mike@example.com
Password: password123
Features: 3 vehicles in Mumbai, good ratings
```

### 🔴 Admin
```
Email: admin@ridesync.com
Password: admin123
Features: Full system access
```

## 📊 Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "customer" | "vendor" | "admin",
  phone: String,
  isActive: Boolean,
  isVerified: Boolean,
  lastLogin: Date,
  // Role-specific info
  vendorInfo: { ... },
  customerInfo: { ... },
  address: { ... },
  timestamps: true
}
```

### Vehicles Collection
```javascript
{
  make: String,
  model: String,
  year: Number,
  type: "Car" | "Bike" | "Scooter",
  registrationNumber: String (unique),
  pricePerDay: Number,
  location: String,
  status: "Available" | "Rented" | "Maintenance" | "Inactive",
  owner: ObjectId (ref: User),
  features: [String],
  rating: Number,
  totalBookings: Number,
  totalEarnings: Number,
  timestamps: true
}
```

### Bookings Collection
```javascript
{
  customer: ObjectId (ref: User),
  vendor: ObjectId (ref: User),
  vehicle: ObjectId (ref: Vehicle),
  startDate: Date,
  endDate: Date,
  totalAmount: Number,
  status: "Pending" | "Confirmed" | "In Progress" | "Completed" | "Cancelled",
  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded",
  customerReview: { rating, comment },
  vendorReview: { rating, comment },
  timestamps: true
}
```

## 🔒 Security Features

### Authentication Security
- JWT tokens with expiration
- Password hashing with bcrypt (12 rounds)
- Token validation middleware
- Account activation/deactivation

### API Security
- Rate limiting (100 requests per 15 minutes)
- Input validation and sanitization
- CORS configuration
- Error handling without sensitive data exposure

### Data Security
- MongoDB injection prevention
- Schema validation with Mongoose
- Unique constraints on critical fields
- Soft delete for important records

## 📈 Performance Optimizations

### Database Optimization
- Strategic indexing on frequently queried fields
- Compound indexes for complex queries
- Text search indexes for search functionality
- Pagination for large result sets

### Query Optimization
- Efficient aggregation pipelines
- Selective field population
- Query result caching strategies
- Database connection pooling

## 🧪 Testing the API

### Using curl
```bash
# Register a new user
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"customer"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get vehicles (replace TOKEN with actual JWT)
curl -H "Authorization: Bearer TOKEN" http://localhost:4000/api/vehicles
```

### Using Postman
Import the API endpoints or use the provided collection (if available).

## 🚀 Production Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ridesync
JWT_SECRET=very-long-random-secret-key-for-production
FRONTEND_URL=https://your-frontend-domain.com
```

### Deployment Checklist
- [ ] Set strong JWT secret
- [ ] Configure production MongoDB URI
- [ ] Enable MongoDB authentication
- [ ] Set up SSL/TLS certificates
- [ ] Configure reverse proxy (nginx)
- [ ] Set up process manager (PM2)
- [ ] Configure logging and monitoring
- [ ] Set up backup strategies

### Popular Deployment Platforms
- **Heroku**: Easy deployment with git
- **Railway**: Modern deployment platform
- **DigitalOcean App Platform**: Scalable hosting
- **AWS EC2**: Full control and customization

## 📝 API Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... },
  "pagination": { ... } // (for paginated results)
}
```

### Error Response
```json
{
  "message": "Error description",
  "errors": [ ... ] // (validation errors if any)
}
```

## 🔧 Development

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

### Project Structure
```
├── models/           # Mongoose models
├── routes/           # Express route handlers
├── middleware/       # Custom middleware functions
├── scripts/          # Utility scripts (seeding, etc.)
├── server.js         # Main application file
├── package.json      # Dependencies and scripts
└── README.md         # This file
```

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
```
Solution: Check if MongoDB is running and URI is correct
```

**JWT Token Errors**
```
Solution: Ensure JWT_SECRET is set and tokens are properly formatted
```

**Validation Errors**
```
Solution: Check request body format and required fields
```

### Debug Mode
Set `NODE_ENV=development` for detailed error messages and logs.

## 📚 API Documentation

For detailed API documentation with request/response examples, consider setting up:
- **Swagger/OpenAPI** documentation
- **Postman Collection** with examples
- **Insomnia Workspace** for testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Create an issue on the repository
4. Contact the development team

---

**Built with ❤️ for the RideSync Platform**

*Happy coding! 🚀*
