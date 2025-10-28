import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiStar,
  FiCalendar,
  FiUser,
  FiCheck,
  FiArrowLeft,
  FiClock,
} from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../api";

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: "",
    endDate: "",
    totalDays: 0,
    totalAmount: 0,
  });
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await api.get(`/vehicles/${id}`);
        const payload = res.data.vehicle || res.data;
        setVehicle(payload);
        const reviewsRes = await api.get(`/vehicles/${id}/reviews`);
        setReviews(reviewsRes.data.reviews || []);
      } catch (err) {
        console.error("Error fetching vehicle", err);
        // Fallback demo vehicle
        setVehicle({
          _id: id,
          make: "Maruti Suzuki",
          model: "Swift Dzire",
          type: "Car",
          location: "Delhi",
          pricePerDay: 2500,
          rating: 4.5,
          totalReviews: 23,
          status: "Available",
          images: [
            "https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&h=600&fit=crop",
          ],
          image:
            "https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&h=600&fit=crop",
          description: "Well-maintained sedan with AC and GPS.",
          features: ["AC", "GPS Navigation", "Power Steering"],
          owner: { name: "John Vendor", rating: 4.8 },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  useEffect(() => {
    if (bookingData.startDate && bookingData.endDate && vehicle) {
      const start = new Date(bookingData.startDate);
      const end = new Date(bookingData.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      if (days > 0) {
        setBookingData((prev) => ({
          ...prev,
          totalDays: days,
          totalAmount: days * vehicle.pricePerDay,
        }));
      } else {
        setBookingData((prev) => ({ ...prev, totalDays: 0, totalAmount: 0 }));
      }
    } else {
      setBookingData((prev) => ({ ...prev, totalDays: 0, totalAmount: 0 }));
    }
  }, [bookingData.startDate, bookingData.endDate, vehicle]);

  const handleBooking = async () => {
    if (!bookingData.startDate || !bookingData.endDate)
      return toast.error("Please select booking dates");
    if (bookingData.totalDays <= 0)
      return toast.error("Please select valid dates");

    try {
      setBookingLoading(true);
      await api.post("/bookings", {
        vehicleId: id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        totalAmount: bookingData.totalAmount,
        pickupLocation: vehicle.location,
        dropoffLocation: vehicle.location,
      });
      toast.success("🎉 Booking request sent successfully!");
      setTimeout(() => navigate("/customer/bookings"), 1400);
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading)
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ paddingTop: "80px" }}
      >
        <div className="text-center">
          <div className="loading-spinner-modern mx-auto mb-3"></div>
          <p className="text-muted">Loading vehicle details...</p>
        </div>
      </div>
    );

  if (!vehicle)
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ paddingTop: "80px" }}
      >
        <div className="text-center">
          <div style={{ fontSize: "4rem" }}>🚗</div>
          <h4 className="mb-3">Vehicle not found</h4>
          <button
            className="btn btn-primary-modern"
            onClick={() => navigate("/customer/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );

  const images =
    vehicle.images && vehicle.images.length
      ? vehicle.images
      : vehicle.image
      ? [vehicle.image]
      : [];
  const mainSrc = images[mainImageIndex] || images[0] || "";

  return (
    <div className="vehicle-details-page" style={{ paddingTop: "100px" }}>
      <div className="container py-4">
        <motion.button
          className="btn btn-outline-modern mb-4"
          onClick={() => navigate(-1)}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.03 }}
        >
          <FiArrowLeft className="me-2" /> Back
        </motion.button>

        <div className="row">
          <div className="col-lg-8">
            <motion.div
              className="card-modern p-0 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={`http://localhost:4000${mainSrc}`}
                className="w-100 rounded-top"
                style={{ height: 420, objectFit: "cover" }}
                alt={`${vehicle.make} ${vehicle.model}`}
              />
              {images.length > 1 && (
                <div
                  className="d-flex gap-2 p-3 bg-light"
                  style={{ overflowX: "auto" }}
                >
                  {images.map((src, idx) => (
                    <img
                      key={idx}
                      src={`http://localhost:4000${src}`}
                      onClick={() => setMainImageIndex(idx)}
                      style={{
                        width: 110,
                        height: 72,
                        objectFit: "cover",
                        cursor: "pointer",
                        border:
                          idx === mainImageIndex
                            ? "2px solid var(--primary-color)"
                            : "2px solid transparent",
                        borderRadius: 8,
                      }}
                      alt={`thumb-${idx}`}
                    />
                  ))}
                </div>
              )}

              <div className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h2 className="fw-bold mb-2">
                      {vehicle.make} {vehicle.model}
                    </h2>
                    <div className="d-flex align-items-center text-muted mb-2">
                      <FiMapPin className="me-2" />
                      {vehicle.location}
                    </div>
                  </div>
                  <span
                    className={`badge ${
                      vehicle.status === "Available"
                        ? "bg-success"
                        : "bg-secondary"
                    } fs-6`}
                  >
                    {vehicle.status}
                  </span>
                </div>

                <div className="d-flex align-items-center mb-4">
                  <div className="d-flex align-items-center me-4">
                    <FiStar className="text-warning me-1" />{" "}
                    <span className="fw-semibold">{vehicle.rating}</span>{" "}
                    <small className="text-muted ms-1">
                      ({vehicle.totalReviews} reviews)
                    </small>
                  </div>
                  <div className="d-flex align-items-center">
                    <FiUser className="text-primary me-1" />{" "}
                    <span className="small">by {vehicle.owner?.name}</span>
                  </div>
                </div>

                <p className="lead mb-4">{vehicle.description}</p>

                <div className="mb-4">
                  <h5 className="fw-bold mb-3">Features & Amenities</h5>
                  <div className="row">
                    {vehicle.features?.map((feature, index) => (
                      <div key={index} className="col-md-6 col-lg-4 mb-2">
                        <div className="d-flex align-items-center">
                          <FiCheck className="text-success me-2" />{" "}
                          <span className="small">{feature}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="fw-bold mb-3">Reviews</h5>
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review._id} className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <FiStar className="text-warning me-1" />
                          <span className="fw-semibold">{review.rating}</span>
                        </div>
                        <p className="mb-0">{review.comment}</p>
                        <small className="text-muted">
                          - {review.customer.name} on {new Date(review.reviewDate).toLocaleDateString()}
                        </small>
                      </div>
                    ))
                  ) : (
                    <p>No reviews yet.</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="col-lg-4">
            <motion.div
              className="card-modern p-4 sticky-top"
              style={{ top: 120 }}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h5 className="fw-bold mb-4">Book This Vehicle</h5>
              <div className="mb-4">
                <div className="price-tag-modern fs-3">
                  ₹{vehicle.pricePerDay}{" "}
                  <span className="text-muted fs-6">/day</span>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label-modern">
                  <FiCalendar className="me-2" /> Start Date
                </label>
                <input
                  type="date"
                  className="form-control form-control-modern"
                  value={bookingData.startDate}
                  onChange={(e) =>
                    setBookingData((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="mb-4">
                <label className="form-label-modern">
                  <FiCalendar className="me-2" /> End Date
                </label>
                <input
                  type="date"
                  className="form-control form-control-modern"
                  value={bookingData.endDate}
                  onChange={(e) =>
                    setBookingData((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  min={
                    bookingData.startDate ||
                    new Date().toISOString().split("T")[0]
                  }
                />
              </div>

              {bookingData.totalDays > 0 && (
                <motion.div
                  className="mb-4 p-3 rounded border"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="d-flex justify-content-between mb-2">
                    <span>
                      ₹{vehicle.pricePerDay} × {bookingData.totalDays} days
                    </span>
                    <span>₹{bookingData.totalAmount}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Service fee</span>
                    <span>₹0</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total Amount</span>
                    <span className="text-success">
                      ₹{bookingData.totalAmount}
                    </span>
                  </div>
                </motion.div>
              )}

              <motion.button
                className="btn btn-primary-modern w-100 mb-3"
                onClick={handleBooking}
                disabled={
                  bookingLoading ||
                  vehicle.status !== "Available" ||
                  bookingData.totalDays <= 0
                }
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {bookingLoading ? (
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="spinner-border spinner-border-sm me-2" />{" "}
                    Booking...
                  </div>
                ) : (
                  "Send Booking Request"
                )}
              </motion.button>

              {vehicle.status !== "Available" && (
                <p className="text-center text-muted small mb-0">
                  This vehicle is currently not available for booking
                </p>
              )}

              <div className="text-center mt-3">
                <small className="text-muted">
                  <FiClock className="me-1" /> Free cancellation within 24 hours
                </small>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
