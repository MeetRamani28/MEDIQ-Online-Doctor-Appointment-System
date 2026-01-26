import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthPage from "../pages/auth/AuthPage";

import Home from "../pages/PATIENT/Home";
import AdminDashboard from "../pages/ADMIN/AdminDashboard";
import DoctorDashboard from "../pages/DOCTOR/DoctorDashboard";

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
      <Route
        path="/patient/home"
        element={
          <ProtectedRoute role="PATIENT">
            <Home />
          </ProtectedRoute>
        }
      />

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
