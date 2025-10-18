import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUserCheck,
  FiArrowLeft,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") || "customer";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: initialRole,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const { confirmPassword, ...userData } = formData;
      const redirectPath = await register(userData);
      navigate(redirectPath);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container-fluid">
        <div
          className="row justify-content-center align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="col-12 col-sm-10 col-md-8 col-lg-6">
            <motion.div
              className="form-modern"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h2 className="text-gradient fw-bold mb-2">Join RideSync</h2>
                  <p className="text-muted">
                    Create your account and start your journey
                  </p>
                </motion.div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Role Selection */}
                <motion.div
                  className="mb-4"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <label className="form-label-modern">Select Your Role</label>
                  <div className="row g-3">
                    <div className="col-6">
                      <input
                        type="radio"
                        className="btn-check"
                        name="role"
                        id="customer"
                        value="customer"
                        checked={formData.role === "customer"}
                        onChange={handleChange}
                      />
                      <label
                        className={`btn ${formData.role === 'customer' ? 'btn-primary-modern' : 'btn-outline-modern'} w-100 p-3 text-center`}
                        htmlFor="customer"
                      >
                        <div className="d-flex flex-column align-items-center">
                          <FiUser className="mb-2" size={24} />
                          <strong>Customer</strong>
                          <small className="text-muted mt-1">
                            Rent vehicles
                          </small>
                        </div>
                      </label>
                    </div>
                    <div className="col-6">
                      <input
                        type="radio"
                        className="btn-check"
                        name="role"
                        id="vendor"
                        value="vendor"
                        checked={formData.role === "vendor"}
                        onChange={handleChange}
                      />
                      <label
                        className={`btn ${formData.role === 'vendor' ? 'btn-primary-modern' : 'btn-outline-modern'} w-100 p-3 text-center`}
                        htmlFor="vendor"
                      >
                        <div className="d-flex flex-column align-items-center">
                          <FiUserCheck className="mb-2" size={24} />
                          <strong>Vendor</strong>
                          <small className="text-muted mt-1">
                            List vehicles
                          </small>
                        </div>
                      </label>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="mb-3"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <label className="form-label-modern">Full Name</label>
                  <div className="position-relative">
                    <FiUser className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                    <input
                      type="text"
                      className="form-control form-control-modern ps-5"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="mb-3"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <label className="form-label-modern">Email Address</label>
                  <div className="position-relative">
                    <FiMail className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                    <input
                      type="email"
                      className="form-control form-control-modern ps-5"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </motion.div>

                <div className="row">
                  <div className="col-md-6">
                    <motion.div
                      className="mb-3"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <label className="form-label-modern">Password</label>
                      <div className="position-relative">
                        <FiLock className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control form-control-modern ps-5 pe-5"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Create password"
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 text-muted"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </motion.div>
                  </div>
                  <div className="col-md-6">
                    <motion.div
                      className="mb-4"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                    >
                      <label className="form-label-modern">
                        Confirm Password
                      </label>
                      <div className="position-relative">
                        <FiLock className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className="form-control form-control-modern ps-5 pe-5"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm password"
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 text-muted"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </motion.div>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  className={`btn w-100 mb-3 ${
                    formData.role === "vendor"
                      ? "btn-secondary-modern"
                      : "btn-primary-modern"
                  }`}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  {loading ? (
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="spinner-border spinner-border-sm me-2" />
                      Creating Account...
                    </div>
                  ) : (
                    `Create ${formData.role === 'vendor' ? 'Vendor' : 'Customer'} Account`
                  )}
                </motion.button>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <p className="text-muted mb-0">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-decoration-none fw-semibold"
                    >
                      Sign in here
                    </Link>
                  </p>
                </motion.div>
              </form>
              <div className="mt-3">
                <button
                  className="btn btn-outline-modern"
                  onClick={() => window.history.back()}
                >
                  <FiArrowLeft className="me-2" /> Go Back
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
