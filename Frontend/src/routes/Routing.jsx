import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthPage from "../pages/auth/AuthPage";

import Home from "../pages/PATIENT/Home";
import AdminDashboard from "../pages/ADMIN/AdminDashboard";
import DoctorDashboard from "../pages/DOCTOR/DoctorDashboard";
import Service from "../pages/PATIENT/Service";
import Blogs from "../pages/PATIENT/Blogs";
import PatientLayout from "../layouts/PatientLayout";

const ProtectedRoute = ({ role, children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) return <Navigate to="/auth" />;
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
};

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/patient"
        element={
          <ProtectedRoute role="PATIENT">
            <PatientLayout />
          </ProtectedRoute>
        }
      >
        <Route path="home" element={<Home />} />
        <Route path="services" element={<Service />} />
        <Route path="blogs" element={<Blogs />} />
      </Route>

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute role="DOCTOR">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default Routing;
