import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiUpload, FiDollarSign, FiMapPin } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../api";

const AddVehicle = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    type: "Car",
    registrationNumber: "",
    color: "",
    fuelType: "Petrol",
    transmission: "Manual",
    seatingCapacity: 5,
    pricePerDay: "",
    pricePerHour: "",
    location: "",
    description: "",
    features: [],
    image: "",
    images: [],
  });
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImagesChange = (value) => {
    // Accept comma or newline separated URLs
    const urls = value
      .split(/\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, images: urls }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const uploadFileHandler = async (e) => {
    const files = e.target.files;
    const bodyFormData = new FormData();
    if (e.target.name === 'image') {
      bodyFormData.append('image', files[0]);
    } else {
      for (let i = 0; i < files.length; i++) {
        bodyFormData.append('images', files[i]);
      }
    }
    setUploading(true);
    try {
      const { data } = await api.post("/upload", bodyFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (e.target.name === 'image') {
        setImage(data.files.image.filename);
        setFormData((prev) => ({ ...prev, image: data.files.image.filename }));
      } else {
        const imageFilenames = data.files.images.map((file) => file.filename);
        setImages(imageFilenames);
        setFormData((prev) => ({ ...prev, images: imageFilenames }));
      }
      setUploading(false);
    } catch (error) {
      console.error(error);
      toast.error('Image upload failed');
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.make ||
      !formData.model ||
      !formData.registrationNumber ||
      !formData.pricePerDay
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const vehicleData = {
        ...formData,
        pricePerDay: parseFloat(formData.pricePerDay),
        pricePerHour: parseFloat(formData.pricePerHour) || 0,
        year: parseInt(formData.year),
        seatingCapacity: parseInt(formData.seatingCapacity),
        image:
          formData.image ||
          formData.images[0] ||
          "https://images.unsplash.com/photo-1549924231-f129b911e442?w=600&h=400&fit=crop",
        images: formData.images,
      };

      await axios.post("http://localhost:4000/api/vehicles", vehicleData);
      toast.success("🎉 Vehicle added successfully!");
      setTimeout(() => {
        navigate("/vendor/vehicles");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add vehicle");
    } finally {
      setLoading(false);
    }
  };

  const commonFeatures = [
    "AC",
    "GPS Navigation",
    "Bluetooth",
    "USB Charging",
    "Power Steering",
    "Central Locking",
    "Power Windows",
    "Music System",
    "Comfortable Seating",
    "Safety Features",
    "Fuel Efficient",
    "Well Maintained",
  ];

  return (
    <div className="add-vehicle-page" style={{ paddingTop: "100px" }}>
      <div className="container py-4">
        {/* Header */}
        <motion.div
          className="d-flex justify-content-between align-items-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="d-flex align-items-center">
            <motion.button
              className="btn btn-outline-modern me-3"
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiArrowLeft />
            </motion.button>
            <div>
              <h2 className="text-gradient fw-bold mb-1">Add New Vehicle</h2>
              <p className="text-muted mb-0">
                List your vehicle and start earning
              </p>
            </div>
          </div>
        </motion.div>

        <div className="row">
          <div className="col-lg-8 mx-auto">
            <motion.div
              className="form-modern"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <div className="mb-5">
                  <h5 className="fw-bold mb-4">📋 Basic Information</h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label-modern">
                        Vehicle Make *
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-modern"
                        name="make"
                        value={formData.make}
                        onChange={handleChange}
                        placeholder="e.g., Maruti Suzuki, Honda, Hero"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label-modern">Model *</label>
                      <input
                        type="text"
                        className="form-control form-control-modern"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        placeholder="e.g., Swift, Activa, Splendor"
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label-modern">Year</label>
                      <select
                        className="form-select form-control-modern"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                      >
                        {Array.from(
                          { length: 15 },
                          (_, i) => new Date().getFullYear() - i
                        ).map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label-modern">Vehicle Type</label>
                      <select
                        className="form-select form-control-modern"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                      >
                        <option value="Car">Car</option>
                        <option value="Bike">Bike</option>
                        <option value="Scooter">Scooter</option>
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label-modern">Color</label>
                      <input
                        type="text"
                        className="form-control form-control-modern"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        placeholder="e.g., White, Black, Red"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label-modern">
                        Registration Number *
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-modern"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        placeholder="e.g., DL01AB1234"
                        style={{ textTransform: "uppercase" }}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label-modern">
                        <FiMapPin className="me-2" />
                        Location *
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-modern"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g., Delhi, Mumbai, Bangalore"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Technical Details */}
                <div className="mb-5">
                  <h5 className="fw-bold mb-4">⚙️ Technical Details</h5>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label-modern">Fuel Type</label>
                      <select
                        className="form-select form-control-modern"
                        name="fuelType"
                        value={formData.fuelType}
                        onChange={handleChange}
                      >
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label-modern">Transmission</label>
                      <select
                        className="form-select form-control-modern"
                        name="transmission"
                        value={formData.transmission}
                        onChange={handleChange}
                      >
                        <option value="Manual">Manual</option>
                        <option value="Automatic">Automatic</option>
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label-modern">
                        Seating Capacity
                      </label>
                      <select
                        className="form-select form-control-modern"
                        name="seatingCapacity"
                        value={formData.seatingCapacity}
                        onChange={handleChange}
                      >
                        {[1, 2, 4, 5, 7, 8].map((capacity) => (
                          <option key={capacity} value={capacity}>
                            {capacity} Seater
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="mb-5">
                  <h5 className="fw-bold mb-4">
                    <FiDollarSign className="me-2" />
                    💰 Pricing
                  </h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label-modern">
                        Price Per Day (₹) *
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-modern"
                        name="pricePerDay"
                        value={formData.pricePerDay}
                        onChange={handleChange}
                        placeholder="e.g., 2500"
                        min="0"
                        step="50"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label-modern">
                        Price Per Hour (₹)
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-modern"
                        name="pricePerHour"
                        value={formData.pricePerHour}
                        onChange={handleChange}
                        placeholder="e.g., 250"
                        min="0"
                        step="10"
                      />
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-5">
                  <h5 className="fw-bold mb-4">✨ Features & Amenities</h5>
                  <div className="row">
                    {commonFeatures.map((feature) => (
                      <div key={feature} className="col-md-4 col-sm-6 mb-2">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={feature}
                            checked={formData.features.includes(feature)}
                            onChange={() => handleFeatureToggle(feature)}
                          />
                          <label className="form-check-label" htmlFor={feature}>
                            {feature}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-5">
                  <h5 className="fw-bold mb-4">📝 Description</h5>
                  <textarea
                    className="form-control form-control-modern"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe your vehicle, its condition, and any special notes for customers..."
                  ></textarea>
                </div>

                {/* Vehicle Image Upload */}
                <div className="mb-5">
                  <h5 className="fw-bold mb-4">
                    <FiUpload className="me-2" />
                    📷 Vehicle Images
                  </h5>
                  <div className="mb-3">
                    <label className="form-label-modern mb-2">
                      Primary Image
                    </label>
                    <input
                      type="file"
                      name="image"
                      className="form-control form-control-modern"
                      onChange={uploadFileHandler}
                    />
                  </div>
                  <div>
                    <label className="form-label-modern mb-2">
                      Gallery Images
                    </label>
                    <input
                      type="file"
                      name="images"
                      className="form-control form-control-modern"
                      onChange={uploadFileHandler}
                      multiple
                    />
                  </div>
                  {uploading && <div>Uploading...</div>}
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <motion.button
                    type="submit"
                    className="btn btn-secondary-modern btn-lg px-5"
                    disabled={loading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {loading ? (
                      <div className="d-flex align-items-center justify-content-center">
                        <div className="spinner-border spinner-border-sm me-2" />
                        Adding Vehicle...
                      </div>
                    ) : (
                      <>🚀 Add Vehicle to Fleet</>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVehicle;
