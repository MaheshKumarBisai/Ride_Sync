import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FiSearch, FiMapPin, FiStar, FiArrowRight } from "react-icons/fi";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await api.get("/vehicles");
      setVehicles(response.data.vehicles || response.data || []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
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
        {
          _id: "3",
          make: "Honda",
          model: "Activa 6G",
          type: "Scooter",
          location: "Mumbai",
          pricePerDay: 600,
          rating: 4.4,
          totalReviews: 27,
          status: "Available",
          image:
            "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop",
        },
      ]);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <motion.section
        className="hero-modern"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="container">
          <div className="row align-items-center min-vh-100 text-center text-lg-start">
            <div className="col-lg-6">
              <motion.div
                className="hero-content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h1 className="display-3 fw-bold" variants={itemVariants}>
                  Find Your Perfect
                  <span className="d-block" style={{ color: 'red' }}>Ride Today</span>
                </motion.h1>

                <motion.p className="lead" variants={itemVariants}>
                  Rent cars, bikes, and scooters from trusted local vendors.
                  Quick, easy, and affordable transportation solutions.
                </motion.p>

                <motion.div
                  className="d-flex gap-3 mt-4 justify-content-center justify-content-lg-start"
                  variants={itemVariants}
                >
                  {!user && (
                    <>
                      <Link to="/register?role=customer">
                        <motion.button
                          className="btn btn-secondary-modern btn-lg"
                          whileHover={{
                            scale: 1.05,
                            boxShadow: "0 10px 30px rgba(6, 214, 160, 0.3)",
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Start Renting
                        </motion.button>
                      </Link>
                      <Link to="/register?role=vendor">
                        <motion.button
                          className="btn btn-outline-modern btn-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Become a Vendor
                        </motion.button>
                      </Link>
                    </>
                  )}
                  {user && (
                    <Link
                      to={
                        user.role === "vendor"
                          ? "/vendor/dashboard"
                          : "/customer/dashboard"
                      }
                    >
                      <motion.button
                        className="btn btn-secondary-modern btn-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Go to Dashboard
                        <FiArrowRight className="ms-2" />
                      </motion.button>
                    </Link>
                  )}
                </motion.div>
              </motion.div>
            </div>

            <div className="col-lg-6 d-none d-lg-block">
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9e?w=600&h=500&fit=crop"
                  alt="Vehicle Rental"
                  className="img-fluid rounded-4 shadow-modern"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Search Section */}
      <motion.section className="py-5 bg-white" data-aos="fade-up">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card-modern p-4">
                <div className="row g-3">
                  <div className="col-md-5">
                    <div className="position-relative">
                      <FiSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                      <input
                        type="text"
                        className="form-control form-control-modern ps-5"
                        placeholder="Search by vehicle, location..."
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
                  <div className="col-md-4">
                    <button className="btn btn-primary-modern w-100">
                      <FiSearch className="me-2" />
                      Search Vehicles
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Featured Vehicles */}
      <section className="py-5 bg-light">
        <div className="container">
          <motion.div className="text-center mb-5" data-aos="fade-up">
            <h2 className="display-5 fw-bold text-gradient mb-3">
              Featured Vehicles
            </h2>
            <p className="lead text-muted">
              Discover our most popular and highly-rated vehicles
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-5">
              <div className="loading-spinner-modern mx-auto"></div>
              <p className="mt-3 text-muted">Loading amazing vehicles...</p>
            </div>
          ) : (
            <>
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                className="vehicles-swiper pb-5"
              >
                {filteredVehicles.map((vehicle) => (
                  <SwiperSlide key={vehicle._id}>
                    <motion.div
                      className="vehicle-card-modern h-100"
                      whileHover={{ scale: 1.02 }}
                      data-aos="fade-up"
                      data-aos-delay="100"
                    >
                      <div className="position-relative">
                        <img
                          src={`http://localhost:4000${vehicle.image}`}
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
                            <span className="fw-semibold">{vehicle.rating}</span>
                            <small className="text-muted ms-1">
                              ({vehicle.totalReviews})
                            </small>
                          </div>
                          <div className="d-flex align-items-center text-muted">
                            <FiMapPin className="me-1" />
                            <small>{vehicle.location}</small>
                          </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                          <div className="price-tag-modern">
                            ₹{vehicle.pricePerDay}/day
                          </div>
                          <Link
                            to={
                              user ? `/customer/vehicle/${vehicle._id}` : "/login"
                            }
                            className="btn btn-primary-modern btn-sm"
                          >
                            {user ? "Book Now" : "Login to Book"}
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="text-center mt-4">
                <Link to="/customer/dashboard">
                  <motion.button
                    className="btn btn-outline-modern btn-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View All Vehicles
                  </motion.button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-5">
        <div className="container">
          <motion.div className="text-center mb-5" data-aos="fade-up">
            <h2 className="display-5 fw-bold text-gradient mb-3">
              Explore Our Fleet
            </h2>
            <p className="lead text-muted">
              A wide range of vehicles to suit every need
            </p>
          </motion.div>
          <div className="row g-4">
            <div className="col-md-4">
              <motion.img
                src="https://images.unsplash.com/photo-1599422474623-8c41de819b12?w=600&h=500&fit=crop"
                alt="Car"
                className="img-fluid rounded-4 shadow-modern"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="col-md-4">
              <motion.img
                src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&h=500&fit=crop"
                alt="Motorcycle"
                className="img-fluid rounded-4 shadow-modern"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="col-md-4">
              <motion.img
                src="https://images.unsplash.com/photo-1594495893623-994c6a62a632?w=600&h=500&fit=crop"
                alt="Scooter"
                className="img-fluid rounded-4 shadow-modern"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <motion.div className="text-center mb-5" data-aos="fade-up">
            <h2 className="display-5 fw-bold text-gradient mb-3">
              What Our Users Say
            </h2>
            <p className="lead text-muted">
              Real stories from our satisfied customers
            </p>
          </motion.div>
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            className="testimonials-swiper pb-5"
          >
            {[
              {
                name: "Rohan Sharma",
                comment: "RideSync made my trip to Mumbai so much easier. The car was clean and the vendor was very professional. Highly recommended!",
                image: "https://randomuser.me/api/portraits/men/32.jpg"
              },
              {
                name: "Priya Patel",
                comment: "I love how easy it is to rent a scooter for my daily commute. The app is user-friendly and the prices are very reasonable.",
                image: "https://randomuser.me/api/portraits/women/44.jpg"
              },
              {
                name: "Amit Singh",
                comment: "As a vendor, RideSync has helped me reach a wider audience and increase my bookings. The platform is very easy to use and the support team is always helpful.",
                image: "https://randomuser.me/api/portraits/men/46.jpg"
              }
            ].map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="text-center">
                  <img src={testimonial.image} alt={testimonial.name} className="rounded-circle mb-3" style={{ width: '80px', height: '80px' }} />
                  <p className="lead fst-italic">"{testimonial.comment}"</p>
                  <h5 className="fw-bold mt-3">{testimonial.name}</h5>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <motion.div className="text-center mb-5" data-aos="fade-up">
            <h2 className="display-5 fw-bold mb-3">Why Choose RideSync?</h2>
            <p className="lead text-muted">
              Experience the future of vehicle rental
            </p>
          </motion.div>

          <div className="row g-4">
            {[
              {
                icon: "🚀",
                title: "Instant Booking",
                description:
                  "Book your perfect ride in just a few clicks with real-time availability.",
              },
              {
                icon: "🔒",
                title: "Secure & Safe",
                description:
                  "All vehicles are verified and insured for your peace of mind.",
              },
              {
                icon: "💰",
                title: "Best Prices",
                description:
                  "Competitive pricing with no hidden fees. Pay only for what you use.",
              },
              {
                icon: "📱",
                title: "24/7 Support",
                description:
                  "Round-the-clock customer support to assist you anytime, anywhere.",
              },
            ].map((feature, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <motion.div
                  className="text-center p-4"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="fs-1 mb-3">{feature.icon}</div>
                  <h5 className="fw-bold mb-3">{feature.title}</h5>
                  <p className="text-muted">{feature.description}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
