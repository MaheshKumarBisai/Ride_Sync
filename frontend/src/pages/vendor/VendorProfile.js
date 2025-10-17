import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const VendorProfile = () => {
  const { user } = useAuth();

  return (
    <div className="vendor-profile-page vendor-theme" style={{ paddingTop: '100px' }}>
      <div className="container py-4">
        <motion.div
          className="row justify-content-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="col-lg-8">
            <div className="card-modern p-4">
              <div className="text-center mb-4">
                <div className="bg-success rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px' }}>
                  <span className="text-white fs-1">{user?.name?.charAt(0)}</span>
                </div>
                <h3 className="fw-bold">{user?.name}</h3>
                <p className="text-muted">{user?.email}</p>
                <span className="badge bg-success">{user?.role}</span>
              </div>

              <div className="text-center">
                <p className="text-muted">Vendor profile management features coming soon...</p>
                <button className="btn btn-secondary-modern">Edit Profile</button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VendorProfile;
