import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiEye,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import api from "../../api";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const VendorDashboard = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch vendor's vehicles and bookings
      const [vehiclesRes, bookingsRes] = await Promise.all([
        api.get("/vehicles?vendor=true"),
        api.get("/bookings?vendor=true"),
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
          status: "Available",
          image:
            "https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop",
          totalBookings: 12,
          earnings: 30000,
        },
        {
          _id: "2",
          make: "Hero",
          model: "Splendor Plus",
          type: "Bike",
          location: "Delhi",
          pricePerDay: 800,
          status: "Available",
          image:
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
          totalBookings: 8,
          earnings: 12000,
        },
      ]);
      setBookings([
        {
          _id: "1",
          vehicle: { make: "Maruti Suzuki", model: "Swift Dzire" },
          customer: { name: "John Customer" },
          startDate: "2023-12-20",
          endDate: "2023-12-22",
          totalAmount: 5000,
          status: "Confirmed",
        },
      ]);
    }
    setLoading(false);
  };

  const totalEarnings = vehicles.reduce(
    (sum, vehicle) => sum + (vehicle.earnings || 0),
    0
  );
  const totalBookings = vehicles.reduce(
    (sum, vehicle) => sum + (vehicle.totalBookings || 0),
    0
  );
  const activeVehicles = vehicles.filter(
    (v) => v.status === "Available"
  ).length;

  const stats = [
    {
      icon: "FiCar",
      label: "Total Vehicles",
      value: vehicles.length,
      color: "var(--primary-color)",
      bgColor: "rgba(99, 102, 241, 0.1)",
    },
    {
      icon: "FiCheckSquare",
      label: "Active Vehicles",
      value: activeVehicles,
      color: "var(--secondary-color)",
      bgColor: "rgba(6, 214, 160, 0.1)",
    },
    {
      icon: "FiCalendar",
      label: "Total Bookings",
      value: totalBookings,
      color: "var(--warning-color)",
      bgColor: "rgba(245, 158, 11, 0.1)",
    },
    {
      icon: "FiDollarSign",
      label: "Total Earnings",
      value: `₹${totalEarnings.toLocaleString()}`,
      color: "var(--success-color)",
      bgColor: "rgba(16, 185, 129, 0.1)",
    },
  ];

  const handleDeleteVehicle = async (vehicleId) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await api.delete(`/vehicles/${vehicleId}`);
        setVehicles(vehicles.filter((v) => v._id !== vehicleId));
        toast.success("Vehicle deleted successfully");
      } catch (error) {
        toast.error("Failed to delete vehicle");
      }
    }
  };

  const handleToggleVisibility = async (vehicleId, currentStatus) => {
    const newStatus = currentStatus === "Available" ? "Inactive" : "Available";
    try {
      await api.put(`/vehicles/${vehicleId}`, {
        status: newStatus,
      });
      setVehicles(
        vehicles.map((v) =>
          v._id === vehicleId ? { ...v, status: newStatus } : v
        )
      );
      toast.success(
        `Vehicle is now ${newStatus === "Available" ? "visible" : "hidden"}`
      );
    } catch (error) {
      toast.error("Failed to update vehicle visibility");
    }
  };

  return (
    <div className="vendor-dashboard vendor-theme">
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
                  Welcome, {user?.name}!
                </h2>
                <p className="text-muted mb-0">
                  Manage your vehicle fleet and bookings
                </p>
              </div>
              <div className="d-flex gap-2">
                <Link to="/vendor/vehicles/add">
                  <motion.button
                    className="btn btn-secondary-modern"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiPlus className="me-2" />
                    Add Vehicle
                  </motion.button>
                </Link>
                <Link to="/vendor/profile">
                  <motion.button
                    className="btn btn-outline-modern"
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
                className="stats-card h-100"
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

        {/* Quick Actions */}
        <motion.div
          className="row mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="col-12">
            <h4 className="fw-bold mb-3">Quick Actions</h4>
            <div className="row g-3">
              <div className="col-md-3">
                <Link
                  to="/vendor/vehicles/add"
                  className="text-decoration-none"
                >
                  <motion.div
                    className="card-modern p-4 text-center h-100"
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <FiPlus className="text-success mb-3" size={32} />
                    <h6 className="fw-bold">Add New Vehicle</h6>
                    <p className="text-muted small mb-0">
                      List a new vehicle for rent
                    </p>
                  </motion.div>
                </Link>
              </div>
              <div className="col-md-3">
                <Link to="/vendor/vehicles" className="text-decoration-none">
                  <motion.div
                    className="card-modern p-4 text-center h-100"
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <FiEye className="text-primary mb-3" size={32} />
                    <h6 className="fw-bold">Manage Vehicles</h6>
                    <p className="text-muted small mb-0">
                      View and edit your listings
                    </p>
                  </motion.div>
                </Link>
              </div>
              <div className="col-md-3">
                <Link to="/vendor/bookings" className="text-decoration-none">
                  <motion.div
                    className="card-modern p-4 text-center h-100"
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <FiUsers className="text-warning mb-3" size={32} />
                    <h6 className="fw-bold">View Bookings</h6>
                    <p className="text-muted small mb-0">
                      Manage customer requests
                    </p>
                  </motion.div>
                </Link>
              </div>
              <div className="col-md-3">
                <motion.div
                  className="card-modern p-4 text-center h-100"
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <FiTrendingUp className="text-info mb-3" size={32} />
                  <h6 className="fw-bold">View Analytics</h6>
                  <p className="text-muted small mb-0">
                    Track your performance
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* My Vehicles */}
        <motion.div
          className="row mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">My Vehicles</h4>
              <Link
                to="/vendor/vehicles"
                className="btn btn-outline-modern btn-sm"
              >
                View All
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="loading-spinner-modern mx-auto"></div>
                <p className="mt-3 text-muted">Loading your vehicles...</p>
              </div>
            ) : vehicles.length > 0 ? (
              <div className="row">
                {vehicles.slice(0, 6).map((vehicle) => (
                  <div key={vehicle._id} className="col-lg-4 col-md-6 mb-4">
                    <motion.div
                      className="vehicle-card-modern h-100"
                      whileHover={{ scale: 1.02 }}
                      data-aos="fade-up"
                    >
                      <div className="position-relative">
                        <img
                          src={`http://localhost:4000${vehicle.image}`}
                          className="vehicle-image-modern img-fluid"
                          alt={`${vehicle.make} ${vehicle.model}`}
                        />
                        <div className="vehicle-badge">{vehicle.status}</div>
                      </div>

                      <div className="card-body p-4">
                        <h5 className="card-title fw-bold mb-2">
                          {vehicle.make} {vehicle.model}
                        </h5>

                        <div className="mb-3">
                          <div className="d-flex justify-content-between text-muted small mb-1">
                            <span>
                              Total Bookings: {vehicle.totalBookings || 0}
                            </span>
                            <span>
                              Earnings: ₹
                              {(vehicle.earnings || 0).toLocaleString()}
                            </span>
                          </div>
                          <div className="price-tag-modern">
                            ₹{vehicle.pricePerDay}/day
                          </div>
                        </div>

                        <div className="d-flex gap-2">
                          {/* Removed eye icon, only show/hide and delete remain */}
                          <Link to={`/vendor/vehicle/${vehicle._id}/edit`} className="btn btn-outline-secondary btn-sm flex-fill" title="Edit Vehicle">
                            <FiEdit />
                          </Link>
                          <button
                            className={`btn btn-outline-${
                              vehicle.status === "Available"
                                ? "warning"
                                : "success"
                            } btn-sm flex-fill`}
                            onClick={() =>
                              handleToggleVisibility(
                                vehicle._id,
                                vehicle.status
                              )
                            }
                            title={
                              vehicle.status === "Available"
                                ? "Hide Vehicle"
                                : "Show Vehicle"
                            }
                          >
                            {vehicle.status === "Available" ? "Hide" : "Show"}
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm flex-fill"
                            onClick={() => handleDeleteVehicle(vehicle._id)}
                            title="Delete Vehicle"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
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
              >
                <h4 className="mb-3">No vehicles yet</h4>
                <p className="text-muted mb-4">
                  Start earning by adding your first vehicle to the platform.
                </p>
                <Link to="/vendor/vehicles/add">
                  <button className="btn btn-secondary-modern">
                    <FiPlus className="me-2" />
                    Add Your First Vehicle
                  </button>
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Recent Bookings */}
        {bookings.length > 0 && (
          <motion.div
            className="row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0">Recent Booking Requests</h4>
                <Link
                  to="/vendor/bookings"
                  className="btn btn-outline-modern btn-sm"
                >
                  View All
                </Link>
              </div>

              <div className="card-modern">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th className="border-0 fw-bold">Vehicle</th>
                        <th className="border-0 fw-bold">Customer</th>
                        <th className="border-0 fw-bold">Dates</th>
                        <th className="border-0 fw-bold">Amount</th>
                        <th className="border-0 fw-bold">Status</th>
                        <th className="border-0 fw-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 5).map((booking) => (
                        <tr key={booking._id}>
                          <td>
                            <div className="fw-semibold">
                              {booking.vehicle?.make} {booking.vehicle?.model}
                            </div>
                          </td>
                          <td>{booking.customer?.name}</td>
                          <td>
                            <div className="small">
                              {new Date(booking.startDate).toLocaleDateString()}{" "}
                              -{new Date(booking.endDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td>
                            <span className="fw-bold text-success">
                              ₹{booking.totalAmount}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                booking.status === "Confirmed"
                                  ? "bg-success"
                                  : booking.status === "Pending"
                                  ? "bg-warning"
                                  : "bg-secondary"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <button className="btn btn-outline-primary btn-sm">
                                View
                              </button>
                              {booking.status === "Pending" && (
                                <button className="btn btn-success btn-sm">
                                  Accept
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
