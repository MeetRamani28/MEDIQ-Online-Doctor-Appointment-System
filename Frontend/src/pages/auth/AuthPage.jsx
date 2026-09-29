/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  loginUser,
  registerUser,
  verifyLicenseThunk,
} from "../../features/auth/authThunks";
import { resetDocVerification } from "../../features/auth/authSlice";
import { fetchSpecializations } from "../../features/specialization/specializationThunks";
import ThreeCanvas from "../../components/atoms/ThreeCanvas";
import { Ripples } from "ldrs/react";
import "ldrs/react/Ripples.css";
import { toast } from "react-toastify";

// Lucide Icons
import {
  Stethoscope,
  ShieldCheck,
  Activity,
  Lock,
  Mail,
  User,
  Briefcase,
  Award,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  Building2,
  Calendar,
  UploadCloud,
  FileCheck,
  Zap,
  Users,
} from "lucide-react";

const AuthPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [role, setRole] = useState("PATIENT"); // 'PATIENT' | 'DOCTOR'
  const [showPassword, setShowPassword] = useState(false);

  const [formValues, setFormValues] = useState({
    fullName: "",
    email: "",
    password: "",
    gender: "",
    age: "",
    dob: "",
    licenseNumber: "",
    specialization: "",
    hospitalAddress: "",
    degree: "",
    experience: "",
    consultationFee: "",
    description: "",
  });

  const [files, setFiles] = useState({
    profileImage: null,
    licenseDocument: null,
  });
  const [docPreview, setDocPreview] = useState(null);

  const { user, isAuthenticated, loading, verifying, isDocVerified } =
    useSelector((state) => state.auth);
  const { list: specializations } = useSelector(
    (state) => state.specialization
  );

  useEffect(() => {
    dispatch(fetchSpecializations());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const roleMap = {
        ADMIN: "/admin/dashboard",
        DOCTOR: "/doctor/dashboard",
        PATIENT: "/patient/home",
      };
      navigate(roleMap[user.role] || "/patient/home", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    setDocPreview(null);
    setFiles({ profileImage: null, licenseDocument: null });
    dispatch(resetDocVerification());
  }, [mode, role, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Demo auto-fill for portfolio reviewers & interviewers
  const handleQuickFill = (type) => {
    if (type === "PATIENT") {
      setMode("login");
      setFormValues((prev) => ({
        ...prev,
        email: "patient@mediq.care",
        password: "Password123!",
      }));
      toast.info("Auto-filled Demo Patient credentials!");
    } else if (type === "DOCTOR") {
      setMode("login");
      setFormValues((prev) => ({
        ...prev,
        email: "doctor@mediq.care",
        password: "Password123!",
      }));
      toast.info("Auto-filled Demo Doctor credentials!");
    } else if (type === "ADMIN") {
      setMode("login");
      setFormValues((prev) => ({
        ...prev,
        email: "admin@mediq.care",
        password: "Password123!",
      }));
      toast.info("Auto-filled Demo Admin credentials!");
    }
  };

  const handleLicenseUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!formValues.licenseNumber) {
      toast.warn("Please enter your License Number first!");
      e.target.value = null;
      return;
    }
    setDocPreview(file.name);
    setFiles((prev) => ({ ...prev, licenseDocument: file }));
    const data = new FormData();
    data.append("licenseDocument", file);
    data.append("licenseNumber", formValues.licenseNumber);
    try {
      await dispatch(verifyLicenseThunk(data)).unwrap();
      toast.success("License pre-verified with AI OCR!");
    } catch (error) {
      toast.error(error || "License Verification failed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "login") {
      try {
        await dispatch(
          loginUser({ email: formValues.email, password: formValues.password })
        ).unwrap();
        toast.success("Successfully logged in!");
      } catch (error) {
        toast.error(error || "Login failed");
      }
    } else {
      if (role === "DOCTOR" && !isDocVerified) {
        return toast.error("Please verify your license document first.");
      }
      const finalData = new FormData();
      Object.keys(formValues).forEach((key) =>
        finalData.append(key, formValues[key])
      );
      finalData.append("role", role);
      if (files.profileImage)
        finalData.append("profileImage", files.profileImage);
      if (files.licenseDocument)
        finalData.append("licenseDocument", files.licenseDocument);

      try {
        await dispatch(registerUser(finalData)).unwrap();
        toast.success("Account created successfully! Please log in.");
        setMode("login");
      } catch (error) {
        toast.error(error || "Registration failed");
      }
    }
  };

  const inputClass =
    "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400 font-medium";

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-3 sm:p-6 relative overflow-hidden font-sans">
      {/* Dynamic Animated Background Mesh */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Glass Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-6xl bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[680px]"
      >
        {/* LEFT COLUMN: Hero Showcase & Branding */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-950/80 via-slate-900 to-indigo-950/90 p-8 lg:p-12 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-slate-800/80 overflow-hidden">
          {/* 3D WebGL Three.js Background Canvas */}
          <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
            <ThreeCanvas />
          </div>

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white">
                  MEDIQ<span className="text-blue-400">.</span>
                </span>
                <span className="block text-[10px] text-blue-300 font-semibold tracking-wider uppercase">
                  Healthcare Ecosystem
                </span>
              </div>
            </div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Medical Care Management</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4">
                Connecting Patients & Doctors Seamlessly.
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Book instant consultations, track digital health records, and access real-time clinical workflows with end-to-end security.
              </p>
            </motion.div>

            {/* Interactive Animated Metric Cards */}
            <div className="space-y-3">
              <motion.div
                whileHover={{ x: 4 }}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    HIPAA & RBAC Compliant
                  </h4>
                  <p className="text-xs text-slate-400">
                    Role-based security for Patient, Doctor & Admin
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ x: 4 }}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Real-Time Keep-Alive
                  </h4>
                  <p className="text-xs text-slate-400">
                    Zero latency response with automated heartbeat worker
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Social Proof Footer */}
          <div className="pt-8 mt-8 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 relative z-10">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>5,000+ Active Appointments</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Zap className="w-3.5 h-3.5" /> 99.9% Uptime
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Auth Form Area */}
        <div className="lg:col-span-7 bg-white p-8 lg:p-12 flex flex-col justify-between">
          <div>
            {/* Top Mode Toggle Bar */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    mode === "login"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    mode === "register"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Quick Demo Fill Buttons (Huge Resume Booster!) */}
              <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <span className="text-slate-400 px-2 text-[11px] uppercase tracking-wider font-bold">
                  Demo Fill:
                </span>
                <button
                  type="button"
                  onClick={() => handleQuickFill("PATIENT")}
                  className="px-2.5 py-1 rounded-lg bg-white text-slate-700 hover:text-blue-600 shadow-sm transition-all"
                >
                  Patient
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill("DOCTOR")}
                  className="px-2.5 py-1 rounded-lg bg-white text-slate-700 hover:text-indigo-600 shadow-sm transition-all"
                >
                  Doctor
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill("ADMIN")}
                  className="px-2.5 py-1 rounded-lg bg-white text-slate-700 hover:text-purple-600 shadow-sm transition-all"
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {mode === "login"
                  ? "Welcome Back to MEDIQ"
                  : "Join the MEDIQ Health Network"}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                {mode === "login"
                  ? "Enter your credentials to access your dashboard."
                  : "Select your role and complete details to get started."}
              </p>
            </div>

            {/* Role Switcher Pill for Register */}
            {mode === "register" && (
              <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6">
                {["PATIENT", "DOCTOR"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      role === r
                        ? "bg-white text-blue-600 shadow-md shadow-slate-200"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {r === "PATIENT" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Briefcase className="w-4 h-4" />
                    )}
                    <span>{r === "PATIENT" ? "Patient Registration" : "Doctor Registration"}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${mode}-${role}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className={
                    mode === "register"
                      ? "grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto pr-1"
                      : "space-y-4"
                  }
                >
                  {/* Full Name */}
                  {mode === "register" && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                        <input
                          name="fullName"
                          placeholder="Dr. Alex Morgan"
                          value={formValues.fullName}
                          onChange={handleChange}
                          required
                          className={`${inputClass} pl-10`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        name="email"
                        type="email"
                        placeholder="user@mediq.care"
                        value={formValues.email}
                        onChange={handleChange}
                        required
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-700">
                        Password
                      </label>
                      {mode === "login" && (
                        <button
                          type="button"
                          onClick={() => toast.info("Contact admin to reset password")}
                          className="text-xs font-semibold text-blue-600 hover:underline"
                        >
                          Forgot?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        value={formValues.password}
                        onChange={handleChange}
                        required
                        className={`${inputClass} pl-10 pr-10`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Additional Register Fields */}
                  {mode === "register" && (
                    <>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={formValues.gender}
                          onChange={handleChange}
                          required
                          className={inputClass}
                        >
                          <option value="">Select Gender</option>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">
                          Age
                        </label>
                        <input
                          name="age"
                          type="number"
                          placeholder="e.g. 28"
                          value={formValues.age}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">
                          Date of Birth
                        </label>
                        <input
                          name="dob"
                          type="date"
                          value={formValues.dob}
                          onChange={handleChange}
                          required
                          className={inputClass}
                        />
                      </div>
                    </>
                  )}

                  {/* Doctor Specific Professional Section */}
                  {mode === "register" && role === "DOCTOR" && (
                    <div className="col-span-1 sm:col-span-2 pt-3 border-t border-slate-200 space-y-3">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold text-slate-800">
                          Doctor Credentials & AI OCR License Verification
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          name="degree"
                          placeholder="Medical Degree (MBBS, MD)"
                          value={formValues.degree}
                          onChange={handleChange}
                          required
                          className={inputClass}
                        />
                        <input
                          name="experience"
                          type="number"
                          placeholder="Years of Experience"
                          value={formValues.experience}
                          onChange={handleChange}
                          required
                          className={inputClass}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <select
                          name="specialization"
                          value={formValues.specialization}
                          onChange={handleChange}
                          required
                          className={inputClass}
                        >
                          <option value="">Select Specialization</option>
                          {specializations.map((s) => (
                            <option key={s._id} value={s.name}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                        <input
                          name="licenseNumber"
                          placeholder="Medical License #"
                          value={formValues.licenseNumber}
                          onChange={handleChange}
                          required
                          className={inputClass}
                        />
                      </div>

                      <input
                        name="hospitalAddress"
                        placeholder="Hospital/Clinic Address"
                        value={formValues.hospitalAddress}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      />

                      {/* License OCR Box */}
                      <div className="p-3.5 bg-blue-50/60 border border-blue-200/80 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                            <FileCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-slate-800">
                              Upload Medical License
                            </span>
                            <span className="block text-[11px] text-slate-500">
                              {docPreview || "Instant Tesseract OCR verification"}
                            </span>
                          </div>
                        </div>

                        <label className="cursor-pointer">
                          <input
                            type="file"
                            className="hidden"
                            onChange={handleLicenseUpload}
                            disabled={verifying}
                          />
                          <span
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all ${
                              isDocVerified
                                ? "bg-emerald-600 text-white"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                          >
                            {verifying ? (
                              <Ripples size="14" color="#fff" />
                            ) : isDocVerified ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                              </>
                            ) : (
                              <>
                                <UploadCloud className="w-3.5 h-3.5" /> Upload
                              </>
                            )}
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={
                  loading ||
                  verifying ||
                  (mode === "register" && role === "DOCTOR" && !isDocVerified)
                }
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/25 hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
              >
                {loading ? (
                  <Ripples size="24" color="#fff" />
                ) : (
                  <>
                    <span>
                      {mode === "login"
                        ? "Sign In to Dashboard"
                        : "Complete Account Registration"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>
          </div>

          {/* Bottom Security Footer */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>JWT Cookie Auth</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-500" />
              <span>MEDIQ Enterprise v2.4</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
