import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCalendar, FiUser, FiCheck, FiX, FiPhone } from "react-icons/fi";
import api from "../../api";
import { toast } from "react-toastify";
import { Modal, Button } from 'react-bootstrap';

const VendorBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/bookings"
      );
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      // Mock data for demo
      setBookings([
        {
          _id: "1",
          vehicle: { make: "Maruti Suzuki", model: "Swift Dzire" },
          user: { name: "John Customer", email: "john@example.com" },
          startDate: "2023-12-25",
          endDate: "2023-12-27",
          totalAmount: 5000,
          status: "Pending",
          pickupLocation: "Connaught Place, Delhi",
          createdAt: "2023-12-20",
        },
        {
          _id: "2",
          vehicle: { make: "Hero", model: "Splendor Plus" },
          user: { name: "Jane Smith", email: "jane@example.com" },
          startDate: "2023-12-30",
          endDate: "2024-01-02",
          totalAmount: 2400,
          status: "Confirmed",
          pickupLocation: "Karol Bagh, Delhi",
          createdAt: "2023-12-22",
        },
      ]);
    }
    setLoading(false);
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:4000/api/bookings/${bookingId}/status`,
        {
          status: newStatus,
        }
      );
      setBookings(
        bookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      );
      toast.success(`Booking ${newStatus.toLowerCase()} successfully`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update booking status"
      );
    }
  };

  const handleShowModal = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status.toLowerCase() === filter;
  });

  const getStatusBadge = (status) => {
    const statusColors = {
      Confirmed: "success",
      Pending: "warning",
      Cancelled: "danger",
      Completed: "info",
      "In Progress": "primary",
    };
    return `badge bg-${statusColors[status] || "secondary"}`;
  };

  if (loading) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ paddingTop: "100px" }}
      >
        <div className="text-center">
          <div className="loading-spinner-modern mx-auto mb-3"></div>
          <p className="text-muted">Loading booking requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="vendor-bookings-page vendor-theme"
      style={{ paddingTop: "100px" }}
    >
      <div className="container py-4">
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="text-gradient fw-bold mb-1">
                Booking Requests 📋
              </h2>
              <p className="text-muted">Manage customer booking requests</p>
            </div>
            <div className="d-flex gap-2">
              {["all", "pending", "confirmed", "completed"].map((status) => (
                <button
                  key={status}
                  className={`btn ${
                    filter === status
                      ? "btn-secondary-modern"
                      : "btn-outline-modern"
                  } btn-sm`}
                  onClick={() => setFilter(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  {status === "all" && (
                    <span className="badge bg-light text-dark ms-2">
                      {bookings.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {filteredBookings.length === 0 ? (
          <motion.div
            className="text-center py-5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4" style={{ fontSize: "5rem" }}>
              📋
            </div>
            <h4 className="mb-3">No booking requests</h4>
            <p className="text-muted mb-4">
              When customers book your vehicles, their requests will appear
              here.
            </p>
          </motion.div>
        ) : (
          <div className="card-modern">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th className="border-0 fw-bold">Vehicle</th>
                    <th className="border-0 fw-bold">Customer</th>
                    <th className="border-0 fw-bold">Booking Period</th>
                    <th className="border-0 fw-bold">Amount</th>
                    <th className="border-0 fw-bold">Status</th>
                    <th className="border-0 fw-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking, index) => (
                    <motion.tr
                      key={booking._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <td>
                        <div className="fw-semibold">
                          {booking.vehicle?.make} {booking.vehicle?.model}
                        </div>
                        <small className="text-muted">
                          {booking.pickupLocation}
                        </small>
                      </td>
                      <td>
                        <div className="fw-semibold">{booking.user?.name}</div>
                        <small className="text-muted">
                          {booking.user?.email}
                        </small>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FiCalendar className="me-2 text-muted" />
                          <div>
                            <div className="fw-semibold">
                              {new Date(booking.startDate).toLocaleDateString()}
                            </div>
                            <small className="text-muted">
                              to{" "}
                              {new Date(booking.endDate).toLocaleDateString()}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="price-tag-modern">
                          ₹{booking.totalAmount}
                        </div>
                        <small className="text-muted">
                          Requested{" "}
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </small>
                      </td>
                      <td>
                        <span className={getStatusBadge(booking.status)}>
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="btn btn-outline-primary btn-sm" onClick={() => handleShowModal(booking)}>
                            <FiUser className="me-1" />
                            View
                          </button>

                          {booking.status === "Pending" && (
                            <>
                              <motion.button
                                className="btn btn-success btn-sm"
                                onClick={() =>
                                  updateBookingStatus(booking._id, "Confirmed")
                                }
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FiCheck className="me-1" />
                                Accept
                              </motion.button>
                              <motion.button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() =>
                                  updateBookingStatus(booking._id, "Cancelled")
                                }
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FiX className="me-1" />
                                Reject
                              </motion.button>
                            </>
                          )}

                          {booking.status === "Confirmed" && (
                            <>
                              <button className="btn btn-outline-success btn-sm">
                                <FiPhone className="me-1" />
                                Contact
                              </button>
                              <motion.button
                                className="btn btn-info btn-sm"
                                onClick={() =>
                                  updateBookingStatus(
                                    booking._id,
                                    "In Progress"
                                  )
                                }
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Start Trip
                              </motion.button>
                            </>
                          )}

                          {booking.status === "In Progress" && (
                            <motion.button
                              className="btn btn-primary btn-sm"
                              onClick={() =>
                                updateBookingStatus(booking._id, "Completed")
                              }
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Complete
                            </motion.button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Booking Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedBooking && (
              <div>
                <h5>{selectedBooking.vehicle?.make} {selectedBooking.vehicle?.model}</h5>
                <p><strong>Customer:</strong> {selectedBooking.user?.name}</p>
                <p><strong>Email:</strong> {selectedBooking.user?.email}</p>
                <p><strong>Status:</strong> {selectedBooking.status}</p>
                <p><strong>From:</strong> {new Date(selectedBooking.startDate).toLocaleDateString()}</p>
                <p><strong>To:</strong> {new Date(selectedBooking.endDate).toLocaleDateString()}</p>
                <p><strong>Total Amount:</strong> ₹{selectedBooking.totalAmount}</p>
                <p><strong>Pickup Location:</strong> {selectedBooking.pickupLocation}</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default VendorBookings;
