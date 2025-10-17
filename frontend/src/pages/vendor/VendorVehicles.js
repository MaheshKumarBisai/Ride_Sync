import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';

const VendorVehicles = () => {
  return (
    <div className="vendor-vehicles-page vendor-theme" style={{ paddingTop: '100px' }}>
      <div className="container py-4">
        <motion.div
          className="d-flex justify-content-between align-items-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h2 className="text-gradient fw-bold mb-1">My Vehicles 🚗</h2>
            <p className="text-muted">Manage your vehicle fleet</p>
          </div>
          <Link to="/vendor/vehicles/add">
            <motion.button 
              className="btn btn-secondary-modern"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiPlus className="me-2" />
              Add Vehicle
            </motion.button>
          </Link>
        </motion.div>

        <div className="text-center py-5">
          <p className="text-muted">Vehicle management features coming soon...</p>
          <p className="text-muted">For now, you can add new vehicles and they will appear in your dashboard.</p>
        </div>
      </div>
    </div>
  );
};

export default VendorVehicles;
