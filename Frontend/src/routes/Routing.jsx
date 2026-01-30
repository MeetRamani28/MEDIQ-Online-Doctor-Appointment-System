import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthPage from "../pages/auth/AuthPage";

import Home from "../pages/PATIENT/Home";
import AdminDashboard from "../pages/ADMIN/AdminDashboard";
import DoctorDashboard from "../pages/DOCTOR/DoctorDashboard";
import Service from "../pages/PATIENT/Service";
import Blogs from "../pages/PATIENT/Blogs";
import PatientLayout from "../layouts/PatientLayout";
import Contact from "../pages/PATIENT/Contact";
import About from "../pages/PATIENT/About";
import DoctorDetail from "../components/atoms/DoctorDetails";
import MyAppointments from "../pages/PATIENT/Appointments";
import AdminLayout from "../layouts/AdminLayout";
import AdminDoctors from "../pages/ADMIN/AdminDoctors";
import AdminUsers from "../pages/ADMIN/AdminUsers";
import AdminAppintments from "../pages/ADMIN/AdminAppintments";
import AdminContacts from "../pages/ADMIN/AdminContacts";
import AdminSpecialization from "../pages/ADMIN/AdminSpecialization";
import DoctorLayout from "../layouts/DoctorLayout";

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
        <Route path="contact" element={<Contact />} />
        <Route path="about" element={<About />} />
        <Route path="doctors/:id" element={<DoctorDetail />} />
        <Route path="appointments" element={<MyAppointments />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="doctors" element={<AdminDoctors />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="appointments" element={<AdminAppintments />} />
        <Route path="specialization" element={<AdminSpecialization />} />
        <Route path="contact" element={<AdminContacts />} />
      </Route>

      <Route
        path="/doctor"
        element={
          <ProtectedRoute role="DOCTOR">
            <DoctorLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DoctorDashboard />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default Routing;
