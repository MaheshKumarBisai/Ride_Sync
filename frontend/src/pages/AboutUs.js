import React from 'react';
import { motion } from 'framer-motion';

const AboutUs = () => {
  return (
    <div style={{ paddingTop: '100px' }}>
      <div className="container py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-gradient fw-bold mb-4">About Us</h1>
          <p className="lead">
            Welcome to RideSync, your trusted partner for seamless and affordable vehicle rentals. Our mission is to connect vehicle owners with renters in a secure and user-friendly environment, making transportation accessible to everyone.
          </p>
          <p>
            Founded in 2023, RideSync was born out of a desire to simplify the rental process. We noticed that finding reliable and affordable transportation could be a challenge, and we wanted to create a platform that would benefit both vehicle owners and renters.
          </p>
          <p>
            At RideSync, we believe in the power of community. We're committed to building a platform that is not only convenient but also fosters a sense of trust and reliability. Our team is passionate about creating a positive experience for our users, and we're always working to improve our platform and services.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;