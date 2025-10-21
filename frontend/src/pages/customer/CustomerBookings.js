import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCalendar, FiMapPin, FiClock, FiPhone } from "react-icons/fi";
import api from "../../api";
import { toast } from "react-toastify";
import { Modal, Button } from 'react-bootstrap';

const CustomerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 0, comment: '' });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings");
      // API returns { bookings, pagination }
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      // Mock data for demo
      setBookings([
        {
          _id: "1",
          vehicle: {
            _id: "1",
            make: "Maruti Suzuki",
            model: "Swift Dzire",
            image:
              "https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop",
          },
          startDate: "2023-12-25",
          endDate: "2023-12-27",
          totalAmount: 5000,
          status: "Confirmed",
          pickupLocation: "Connaught Place, Delhi",
          createdAt: "2023-12-20",
        },
        {
          _id: "2",
          vehicle: {
            _id: "2",
            make: "Hero",
            model: "Splendor Plus",
            image:
              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
          },
          startDate: "2023-12-30",
          endDate: "2024-01-02",
          totalAmount: 2400,
          status: "Pending",
          pickupLocation: "Karol Bagh, Delhi",
          createdAt: "2023-12-22",
        },
      ]);
    }
    setLoading(false);
  };

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

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await api.delete(`/bookings/${bookingId}`);
        setBookings(bookings.filter((b) => b._id !== bookingId));
        toast.success("Booking cancelled successfully");
      } catch (error) {
        toast.error("Failed to cancel booking");
      }
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

  const handleShowReviewModal = (booking) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setSelectedBooking(null);
    setReviewData({ rating: 0, comment: '' });
  };

  const handleReviewChange = (e) => {
    setReviewData({ ...reviewData, [e.target.name]: e.target.value });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/bookings/${selectedBooking._id}/review`, reviewData);
      toast.success('Review submitted successfully');
      handleCloseReviewModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ paddingTop: "100px" }}
      >
        <div className="text-center">
          <div className="loading-spinner-modern mx-auto mb-3"></div>
          <p className="text-muted">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-bookings-page" style={{ paddingTop: "100px" }}>
      <div className="container py-4">
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-gradient fw-bold mb-1">My Bookings 📅</h2>
          <p className="text-muted">
            Track and manage your vehicle reservations
          </p>
        </motion.div>

        {bookings.length === 0 ? (
          <motion.div
            className="text-center py-5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4" style={{ fontSize: "5rem" }}>
              📅
            </div>
            <h4 className="mb-3">No bookings yet</h4>
            <p className="text-muted mb-4">
              Start exploring vehicles and make your first booking to see them
              here.
            </p>
            <button
              className="btn btn-primary-modern"
              onClick={() => (window.location.href = "/customer/dashboard")}
            >
              Explore Vehicles
            </button>
          </motion.div>
        ) : (
          <div className="row">
            {bookings.map((booking, index) => (
              <div key={booking._id} className="col-lg-6 mb-4">
                <motion.div
                  className="card-modern h-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="row g-0">
                    <div className="col-4">
                      <img
                        src={`http://localhost:4000${booking.vehicle?.image}`}
                        className="img-fluid h-100 w-100 rounded-start"
                        style={{ objectFit: "cover" }}
                        alt="Vehicle"
                      />
                    </div>
                    <div className="col-8">
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="card-title fw-bold mb-1">
                            {booking.vehicle?.make} {booking.vehicle?.model}
                          </h6>
                          <span className={getStatusBadge(booking.status)}>
                            {booking.status}
                          </span>
                        </div>

                        <div className="mb-2">
                          <div className="d-flex align-items-center text-muted small mb-1">
                            <FiCalendar className="me-2" />
                            {new Date(booking.startDate).toLocaleDateString()} -
                            {new Date(booking.endDate).toLocaleDateString()}
                          </div>
                          <div className="d-flex align-items-center text-muted small mb-1">
                            <FiMapPin className="me-2" />
                            {booking.pickupLocation}
                          </div>
                          <div className="d-flex align-items-center text-muted small mb-2">
                            <FiClock className="me-2" />
                            Booked on{" "}
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                          <div className="price-tag-modern">
                            ₹{booking.totalAmount}
                          </div>
                          <div className="d-flex gap-1">
                            <button className="btn btn-outline-primary btn-sm" onClick={() => handleShowModal(booking)}>
                              View
                            </button>
                            {booking.status === "Pending" && (
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleCancelBooking(booking._id)}
                              >
                                Cancel
                              </button>
                            )}
                            {booking.status === "Confirmed" && (
                              <button className="btn btn-outline-success btn-sm">
                                <FiPhone className="me-1" />
                                Contact
                              </button>
                            )}
                            {booking.status === "Completed" && (
                              <button
                                className="btn btn-outline-warning btn-sm"
                                onClick={() => handleShowReviewModal(booking)}
                              >
                                Leave a Review
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
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
        <Modal show={showReviewModal} onHide={handleCloseReviewModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Leave a Review</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-3">
                <label className="form-label">Rating</label>
                <select name="rating" value={reviewData.rating} onChange={handleReviewChange} className="form-select">
                  <option value="0" disabled>Select a rating</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Comment</label>
                <textarea name="comment" value={reviewData.comment} onChange={handleReviewChange} className="form-control" rows="3"></textarea>
              </div>
              <Button type="submit" variant="primary">Submit Review</Button>
            </form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default CustomerBookings;
