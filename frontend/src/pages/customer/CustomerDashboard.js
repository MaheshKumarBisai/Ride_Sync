import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  FiSearch,
  FiMapPin,
  FiClock,
  FiStar,
  FiArrowRight,
} from "react-icons/fi";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [vehiclesRes, bookingsRes] = await Promise.all([
        axios.get("http://localhost:4000/api/vehicles"),
        axios.get("http://localhost:4000/api/bookings"),
      ]);

      setVehicles(vehiclesRes.data.vehicles || vehiclesRes.data || []);
      setBookings(bookingsRes.data || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Mock data for demo
      setVehicles([
        {
          _id: "1",
          make: "Maruti Suzuki",
          model: "Swift Dzire",
          type: "Car",
          location: "Delhi",
          pricePerDay: 2500,
          rating: 4.5,
          totalReviews: 23,
          status: "Available",
          image:
            "https://images.unsplash.com/photo-1549924231-f129b911e442?w=600&h=400&fit=crop",
        },
        {
          _id: "2",
          make: "Hero",
          model: "Splendor Plus",
          type: "Bike",
          location: "Delhi",
          pricePerDay: 800,
          rating: 4.2,
          totalReviews: 18,
          status: "Available",
          image:
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
        },
      ]);
      setBookings([]);
    }
    setLoading(false);
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      !searchQuery ||
      vehicle.make?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.location?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = !selectedType || vehicle.type === selectedType;

    return matchesSearch && matchesType;
  });

  const stats = [
    {
      icon: "🚗",
      label: "Available Vehicles",
      value: vehicles.length,
      color: "var(--primary-color)",
      bgColor: "rgba(99, 102, 241, 0.1)",
    },
    {
      icon: "📅",
      label: "Total Bookings",
      value: bookings.length,
      color: "var(--secondary-color)",
      bgColor: "rgba(6, 214, 160, 0.1)",
    },
    {
      icon: "⭐",
      label: "Avg Rating",
      value: "4.3",
      color: "var(--warning-color)",
      bgColor: "rgba(245, 158, 11, 0.1)",
    },
    {
      icon: "💰",
      label: "Money Saved",
      value: "₹12,450",
      color: "var(--success-color)",
      bgColor: "rgba(16, 185, 129, 0.1)",
    },
  ];

  return (
    <div className="customer-dashboard customer-theme">
      <div
        className="container-fluid px-4 py-4"
        style={{ paddingTop: "100px" }}
      >
        {/* Welcome Section */}
        <motion.div
          className="row mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="text-gradient fw-bold mb-1">
                  Welcome back, {user?.name}! 👋
                </h2>
                <p className="text-muted mb-0">
                  Discover amazing vehicles for your next journey
                </p>
              </div>
              <div className="d-flex gap-2">
                <Link to="/customer/bookings">
                  <motion.button
                    className="btn btn-outline-modern"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    My Bookings
                  </motion.button>
                </Link>
                <Link to="/customer/profile">
                  <motion.button
                    className="btn btn-primary-modern"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Profile
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="row mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {stats.map((stat, index) => (
            <div key={index} className="col-lg-3 col-md-6 mb-4">
              <motion.div
                className="stats-card"
                style={{ borderLeftColor: stat.color }}
                whileHover={{ scale: 1.05 }}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="d-flex align-items-center">
                  <div
                    className="stats-icon me-3"
                    style={{ background: stat.color }}
                  >
                    {stat.icon}
                  </div>
                  <div>
                    <h3 className="fw-bold mb-1" style={{ color: stat.color }}>
                      {stat.value}
                    </h3>
                    <p className="text-muted mb-0 small">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>

        {/* Search Section */}
        <motion.div
          className="row mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="col-12">
            <div className="card-modern p-4">
              <h5 className="fw-bold mb-3">Find Your Perfect Ride 🔍</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="position-relative">
                    <FiSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                    <input
                      type="text"
                      className="form-control form-control-modern ps-5"
                      placeholder="Search vehicles, locations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select form-control-modern"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="Car">Cars</option>
                    <option value="Bike">Bikes</option>
                    <option value="Scooter">Scooters</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <button className="btn btn-primary-modern w-100">
                    <FiSearch className="me-2" />
                    Search Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Featured Vehicles */}
        <motion.div
          className="row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">Available Vehicles</h4>
              <span className="badge bg-primary fs-6">
                {filteredVehicles.length} vehicles
              </span>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="loading-spinner-modern mx-auto"></div>
                <p className="mt-3 text-muted">Loading vehicles...</p>
              </div>
            ) : filteredVehicles.length > 0 ? (
              <div className="row">
                {filteredVehicles.map((vehicle) => (
                  <div key={vehicle._id} className="col-lg-4 col-md-6 mb-4">
                    <motion.div
                      className="vehicle-card-modern h-100"
                      whileHover={{ scale: 1.02 }}
                      data-aos="fade-up"
                      data-aos-delay="100"
                    >
                      <div className="position-relative">
                        <img
                          src={vehicle.image}
                          className="vehicle-image-modern"
                          alt={`${vehicle.make} ${vehicle.model}`}
                        />
                        <div className="vehicle-badge">{vehicle.type}</div>
                      </div>

                      <div className="card-body p-4">
                        <h5 className="card-title fw-bold mb-2">
                          {vehicle.make} {vehicle.model}
                        </h5>

                        <div className="d-flex align-items-center mb-3">
                          <div className="d-flex align-items-center me-3">
                            <FiStar className="text-warning me-1" />
                            <span className="fw-semibold">
                              {vehicle.rating}
                            </span>
                            <small className="text-muted ms-1">
                              ({vehicle.totalReviews})
                            </small>
                          </div>
                          <div className="d-flex align-items-center text-muted">
                            <FiMapPin className="me-1" />
                            <small>{vehicle.location}</small>
                          </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="price-tag-modern">
                            ₹{vehicle.pricePerDay}/day
                          </div>
                          <span className="badge bg-success">
                            {vehicle.status}
                          </span>
                        </div>

                        <Link
                          to={`/customer/vehicle/${vehicle._id}`}
                          className="btn btn-primary-modern w-100"
                        >
                          View Details & Book
                          <FiArrowRight className="ms-2" />
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                className="text-center py-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="mb-3" style={{ fontSize: "4rem" }}>
                  🚗
                </div>
                <h4 className="mb-3">No vehicles found</h4>
                <p className="text-muted mb-4">
                  Try adjusting your search filters or check back later for new
                  listings.
                </p>
                <button
                  className="btn btn-outline-modern"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedType("");
                  }}
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Recent Bookings */}
        {bookings.length > 0 && (
          <motion.div
            className="row mt-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0">Recent Bookings</h4>
                <Link
                  to="/customer/bookings"
                  className="btn btn-outline-modern btn-sm"
                >
                  View All
                </Link>
              </div>

              <div className="card-modern p-4">
                {bookings.slice(0, 3).map((booking) => (
                  <div
                    key={booking._id}
                    className="d-flex align-items-center p-3 border-bottom"
                  >
                    <img
                      src={
                        booking.vehicle?.image ||
                        "https://via.placeholder.com/80x60"
                      }
                      className="rounded me-3"
                      style={{
                        width: "80px",
                        height: "60px",
                        objectFit: "cover",
                      }}
                      alt="Vehicle"
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-1 fw-bold">
                        {booking.vehicle?.make} {booking.vehicle?.model}
                      </h6>
                      <p className="text-muted mb-0 small">
                        <FiClock className="me-1" />
                        {new Date(booking.startDate).toLocaleDateString()} -
                        {new Date(booking.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-end">
                      <span
                        className={`badge ${
                          booking.status === "Confirmed"
                            ? "bg-success"
                            : "bg-warning"
                        }`}
                      >
                        {booking.status}
                      </span>
                      <div className="price-tag-modern mt-1">
                        ₹{booking.totalAmount}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
