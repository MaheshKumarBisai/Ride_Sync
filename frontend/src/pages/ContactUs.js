import React from 'react';
import { motion } from 'framer-motion';

const ContactUs = () => {
  return (
    <div style={{ paddingTop: '100px' }}>
      <div className="container py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-gradient fw-bold mb-4">Contact Us</h1>
          <p className="lead">
            We'd love to hear from you! Whether you have a question about our services, need assistance with a booking, or just want to provide feedback, our team is here to help.
          </p>
          <div className="row">
            <div className="col-md-6">
              <h5>Get in Touch</h5>
              <p>Email: support@ridesync.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
            <div className="col-md-6">
              <h5>Office Address</h5>
              <p>123 RideSync Avenue</p>
              <p>New Delhi, India</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUs;