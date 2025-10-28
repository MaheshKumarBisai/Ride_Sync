import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import api from '../../api';

const VendorProfile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    businessName: user?.vendorInfo?.businessName || '',
    licenseNumber: user?.vendorInfo?.licenseNumber || '',
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('image', file);
    setUploading(true);
    try {
      const { data } = await api.post('/upload', bodyFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImage(data.file.filename);
      setFormData((prev) => ({ ...prev, profileImage: data.file.filename }));
      setUploading(false);
    } catch (error) {
      console.error(error);
      toast.error('Image upload failed');
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', formData);
      setUser(data.user);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

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
                <img src={user.profileImage ? `/api/upload/${user.profileImage}` : `https://ui-avatars.com/api/?name=${user.name}`} alt="Profile" className="rounded-circle mb-3" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                <h3 className="fw-bold">{user?.name}</h3>
                <p className="text-muted">{user?.email}</p>
                <span className="badge bg-success">{user?.role}</span>
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
                    <label className="form-label-modern">Business Name</label>
                    <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="form-control form-control-modern" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label-modern">License Number</label>
                    <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} className="form-control form-control-modern" />
                  </div>
                  <div className="col-md-12 mb-3">
                    <label className="form-label-modern">Profile Picture</label>
                    <input type="file" name="image" onChange={uploadFileHandler} className="form-control form-control-modern" />
                    {uploading && <div>Uploading...</div>}
                  </div>
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-secondary-modern" disabled={loading}>
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

export default VendorProfile;
