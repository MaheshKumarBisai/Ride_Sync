import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AOS from "aos";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";

// Customer Components
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import VehicleDetails from "./pages/customer/VehicleDetails";
import CustomerBookings from "./pages/customer/CustomerBookings";
import CustomerProfile from "./pages/customer/CustomerProfile";

// Vendor Components
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorVehicles from "./pages/vendor/VendorVehicles";
import VendorBookings from "./pages/vendor/VendorBookings";
import VendorProfile from "./pages/vendor/VendorProfile";
import AddVehicle from "./pages/vendor/AddVehicle";

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* Conditionally render Navbar: hidden on /login and /register */}
          <AppContent />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const hideOn = ["/login", "/register"];
  const shouldHide = hideOn.includes(location.pathname);

  return (
    <>
      {!shouldHide && <Navbar />}
      <main style={{ paddingTop: !shouldHide ? '80px' : '0' }}>
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact-us" element={<ContactUs />} />

            {/* Customer Routes */}
            <Route
              path="/customer/*"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <Routes>
                    <Route path="dashboard" element={<CustomerDashboard />} />
                    <Route path="vehicle/:id" element={<VehicleDetails />} />
                    <Route path="bookings" element={<CustomerBookings />} />
                    <Route path="profile" element={<CustomerProfile />} />
                  </Routes>
                </ProtectedRoute>
              }
            />

            {/* Vendor Routes */}
            <Route
              path="/vendor/*"
              element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <Routes>
                    <Route path="dashboard" element={<VendorDashboard />} />
                    <Route path="vehicles" element={<VendorVehicles />} />
                    <Route path="vehicles/add" element={<AddVehicle />} />
                    <Route path="bookings" element={<VendorBookings />} />
                    <Route path="profile" element={<VendorProfile />} />
                  </Routes>
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
      </main>
      {!shouldHide && <Footer />}
    </>
  );
}

export default App;
