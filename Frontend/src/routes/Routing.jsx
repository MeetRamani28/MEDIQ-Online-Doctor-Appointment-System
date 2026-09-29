import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingScreen from "../components/atoms/LoadingScreen";

// Lazy-loaded page components for route-level code splitting
const AuthPage = lazy(() => import("../pages/auth/AuthPage"));
const Home = lazy(() => import("../pages/PATIENT/Home"));
const Service = lazy(() => import("../pages/PATIENT/Service"));
const Blogs = lazy(() => import("../pages/PATIENT/Blogs"));
const Contact = lazy(() => import("../pages/PATIENT/Contact"));
const About = lazy(() => import("../pages/PATIENT/About"));
const DoctorDetail = lazy(() => import("../components/atoms/DoctorDetails"));
const MyAppointments = lazy(() => import("../pages/PATIENT/Appointments"));
const PatientLayout = lazy(() => import("../layouts/PatientLayout"));

const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const AdminDashboard = lazy(() => import("../pages/ADMIN/AdminDashboard"));
const AdminDoctors = lazy(() => import("../pages/ADMIN/AdminDoctors"));
const AdminUsers = lazy(() => import("../pages/ADMIN/AdminUsers"));
const AdminAppintments = lazy(() => import("../pages/ADMIN/AdminAppintments"));
const AdminContacts = lazy(() => import("../pages/ADMIN/AdminContacts"));
const AdminSpecialization = lazy(() => import("../pages/ADMIN/AdminSpecialization"));

const DoctorLayout = lazy(() => import("../layouts/DoctorLayout"));
const DoctorDashboard = lazy(() => import("../pages/DOCTOR/DoctorDashboard"));
const DoctorAppointment = lazy(() => import("../pages/DOCTOR/DoctorAppointment"));
const DoctorMedicalRecord = lazy(() => import("../pages/DOCTOR/DoctorMedicalRecord"));
const DoctorProfile = lazy(() => import("../pages/DOCTOR/DoctorProfile"));
const NotFound = lazy(() => import("../pages/NotFound"));

const ProtectedRoute = ({ role, children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) return <Navigate to="/auth" />;
  if (role && user?.role !== role) return <Navigate to="/" />;

  return children;
};

const Routing = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />

        {/* Patient Routes */}
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

        {/* Admin Routes */}
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

        {/* Doctor Routes */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute role="DOCTOR">
              <DoctorLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="appointment" element={<DoctorAppointment />} />
          <Route path="medicalrecord" element={<DoctorMedicalRecord />} />
          <Route path="profile" element={<DoctorProfile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default Routing;
