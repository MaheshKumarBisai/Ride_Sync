import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHeart } from "react-icons/fi";

const Footer = () => {
  return (
    <motion.footer
      className="py-5"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      style={{ background: "var(--background-color)", borderTop: "1px solid var(--border-color)" }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="text-gradient fw-bold mb-3">🚗 RideSync</h5>
            <p className="opacity-75 mb-3">
              Your trusted vehicle rental platform connecting customers with
              local vendors for seamless transportation solutions.
            </p>
          </div>

          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="fw-bold mb-3">Company</h6>
            <ul className="list-unstyled">
              {["About Us", "How it Works", "Careers", "Press"].map((item) => (
                <li key={item} className="mb-2">
                  <Link
                    to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-decoration-none opacity-75 hover-opacity-100"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="fw-bold mb-3">Support</h6>
            <ul className="list-unstyled">
              {["Help Center", "Contact Us", "Safety", "Terms of Service"].map(
                (item) => (
                  <li key={item} className="mb-2">
                    <Link
                      to={`/support/${item
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="text-decoration-none opacity-75 hover-opacity-100"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="fw-bold mb-3">Vehicles</h6>
            <ul className="list-unstyled">
              {["Cars", "Bikes", "Scooters", "Electric Vehicles"].map(
                (item) => (
                  <li key={item} className="mb-2">
                    <Link
                      to={`/vehicles/${item
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="text-decoration-none opacity-75 hover-opacity-100"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="fw-bold mb-3">Cities</h6>
            <ul className="list-unstyled">
              {["Delhi", "Mumbai", "Bangalore", "Hyderabad"].map((item) => (
                <li key={item} className="mb-2">
                  <Link
                    to={`/cities/${item.toLowerCase()}`}
                    className="text-decoration-none opacity-75 hover-opacity-100"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="my-4 opacity-25" />

        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="mb-0 opacity-75">
              © 2023 RideSync. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="mb-0 opacity-75">
              Made with <FiHeart className="text-danger mx-1" /> for better
              transportation
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
