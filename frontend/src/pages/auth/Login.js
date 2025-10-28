import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const redirectPath = await login(formData.email, formData.password);
      navigate(redirectPath);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  // demo credentials removed

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container-fluid">
        <div
          className="row justify-content-center align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="col-12 col-sm-10 col-md-8 col-lg-5">
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
                  <h2 className="text-gradient fw-bold mb-2">Welcome Back!</h2>
                  <p className="text-muted">Sign in to continue to RideSync</p>
                </motion.div>
              </div>

              {/* ...existing code... */}

              <form onSubmit={handleSubmit}>
                <motion.div
                  className="mb-3"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
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

                <motion.div
                  className="mb-4"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
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
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </motion.div>

                <motion.button
                  type="submit"
                  className="btn btn-primary-modern w-100 mb-3"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  {loading ? (
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="spinner-border spinner-border-sm me-2" />
                      Signing In...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </motion.button>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <p className="text-muted mb-0">
                    Don't have an account?{" "}
                    <Link
                      to={`/register${
                        searchParams.toString()
                          ? `?${searchParams.toString()}`
                          : ""
                      }`}
                      className="text-decoration-none fw-semibold"
                    >
                      Create one here
                    </Link>
                  </p>
                </motion.div>
              </form>
              <div className="mt-3">
                <button
                  className="btn btn-outline-modern"
                  onClick={() => navigate(-1)}
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

export default Login;
