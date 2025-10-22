import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiUser, FiLogOut } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getDashboardLink = () => {
    return user?.role === "vendor"
      ? "/vendor/dashboard"
      : "/customer/dashboard";
  };

  const getNavItems = () => {
    if (!user) return [];

    if (user.role === "vendor") {
      return [
        { path: "/vendor/dashboard", label: "Dashboard" },
        { path: "/vendor/vehicles", label: "My Vehicles" },
        { path: "/vendor/bookings", label: "Bookings" },
      ];
    } else {
      return [
        { path: "/customer/dashboard", label: "Dashboard" },
        { path: "/customer/bookings", label: "My Bookings" },
      ];
    }
  };

  return (
    <motion.nav
      className="navbar navbar-expand-lg navbar-modern shadow-sm fixed-top"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        background: "var(--background-color)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <div className="container">
        <Link
          className="navbar-brand navbar-brand-modern d-flex align-items-center"
          to="/"
          style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}
        >
          RideSync
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <AnimatePresence>
          <div
            className={`collapse navbar-collapse ${
              showMobileMenu ? "show" : ""
            }`}
          >
            <ul className="navbar-nav me-auto">
              {getNavItems().map((item) => (
                <li key={item.path} className="nav-item">
                  <Link
                    className={`nav-link nav-link-modern ${
                      location.pathname === item.path ? "active" : ""
                    }`}
                    to={item.path}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="d-flex align-items-center">
              {user ? (
                <div className="dropdown">
                  <motion.button
                    className="btn btn-outline-modern dropdown-toggle"
                    type="button"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiUser className="me-2" />
                    {user.name}
                  </motion.button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        className="dropdown-menu show mt-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link
                          className="dropdown-item"
                          to={getDashboardLink()}
                          onClick={() => setShowUserMenu(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          className="dropdown-item"
                          to={
                            user.role === "vendor"
                              ? "/vendor/profile"
                              : "/customer/profile"
                          }
                          onClick={() => setShowUserMenu(false)}
                        >
                          Profile
                        </Link>
                        <hr className="dropdown-divider" />
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => {
                            setShowUserMenu(false);
                            handleLogout();
                          }}
                        >
                          <FiLogOut className="me-2" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <Link to="/login">
                    <motion.button
                      className="btn btn-outline-modern"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Login
                    </motion.button>
                  </Link>
                  <Link to="/register">
                    <motion.button
                      className="btn btn-primary-modern"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Sign Up
                    </motion.button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
