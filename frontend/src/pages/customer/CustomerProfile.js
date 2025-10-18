import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import api from '../../api';
import axios from 'axios';

const CustomerProfile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put('http://localhost:4000/api/auth/profile', formData);
      setUser(data.user);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-profile-page" style={{ paddingTop: '100px' }}>
      <div className="container py-4">
        <motion.div
          className="row justify-content-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="col-lg-8">
            <div className="card-modern p-4">
              <div className="text-center mb-4">
                <div className="bg-primary rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px' }}>
                  <span className="text-white fs-1">{user?.name?.charAt(0)}</span>
                </div>
                <h3 className="fw-bold">{user?.name}</h3>
                <p className="text-muted">{user?.email}</p>
                <span className="badge bg-primary">{user?.role}</span>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label-modern">Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control form-control-modern" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label-modern">Phone</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="form-control form-control-modern" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label-modern">Street</label>
                    <input type="text" name="street" value={formData.street} onChange={handleChange} className="form-control form-control-modern" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label-modern">City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} className="form-control form-control-modern" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label-modern">State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange} className="form-control form-control-modern" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label-modern">Pincode</label>
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="form-control form-control-modern" />
                  </div>
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-primary-modern" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerProfile;
