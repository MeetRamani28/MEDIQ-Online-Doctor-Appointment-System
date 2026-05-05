/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  registerUser,
  verifyLicenseThunk,
} from "../../features/auth/authThunks";
import { resetDocVerification } from "../../features/auth/authSlice";
import { fetchSpecializations } from "../../features/specialization/specializationThunks";
import Input from "../../components/atoms/Input";
import Select from "../../components/atoms/Select";
import { Ripples } from "ldrs/react";
import icon from "../../../public/images/icon.png";
import "ldrs/react/Ripples.css";
import { toast } from "react-toastify";
import logo from "../../../public/images/icon.png"

// Icons
import {
  FiMail,
  FiLock,
  FiUser,
  FiCalendar,
  FiMapPin,
  FiAward,
  FiActivity,
  FiArrowRight,
  FiUploadCloud,
  FiShield,
  FiBriefcase,
  FiCheckCircle,
  FiBookOpen,
  FiDollarSign,
  FiAlignLeft,
  FiChevronLeft,
} from "react-icons/fi";

// Refined FormField to match the Screenshot's cleaner style
const FormField = ({ icon: Icon, children, label, extra }) => (
  <div className="space-y-1 w-full text-left">
    <div className="flex justify-between items-center px-1">
      {label && (
        <label className="text-[13px] font-semibold text-slate-700">
          {label}
        </label>
      )}
      {extra}
    </div>
    <div className="relative group">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0052CC] transition-colors z-10">
          <Icon size={16} />
        </div>
      )}
      {children}
    </div>
  </div>
);

const AuthPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("PATIENT");

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
  const [preview, setPreview] = useState(null);
  const [docPreview, setDocPreview] = useState(null);

  const { user, isAuthenticated, loading, verifying, isDocVerified } =
    useSelector((state) => state.auth);
  const { list: specializations, loading: specLoading } = useSelector(
    (state) => state.specialization,
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
      navigate(roleMap[user.role] || "/auth", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    setPreview(null);
    setDocPreview(null);
    setFiles({ profileImage: null, licenseDocument: null });
    dispatch(resetDocVerification());
  }, [mode, role, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
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
      toast.success("License pre-verified successfully!");
    } catch (error) {
      toast.error(error || "OCR Failed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "login") {
      try {
        await dispatch(
          loginUser({ email: formValues.email, password: formValues.password }),
        ).unwrap();
        toast.success("Welcome back!");
      } catch (error) {
        toast.error(error);
      }
    } else {
      if (role === "DOCTOR" && !isDocVerified) {
        return toast.error("Please verify your license document first.");
      }
      const finalData = new FormData();
      Object.keys(formValues).forEach((key) =>
        finalData.append(key, formValues[key]),
      );
      finalData.append("role", role);
      if (files.profileImage)
        finalData.append("profileImage", files.profileImage);
      if (files.licenseDocument)
        finalData.append("licenseDocument", files.licenseDocument);

      try {
        await dispatch(registerUser(finalData)).unwrap();
        toast.success("Account created successfully!");
        setMode("login");
      } catch (error) {
        toast.error(error);
      }
    }
  };

  // Base input class to match the screenshot style
  const inputStyle =
    "w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#0052CC] focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-slate-400";

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col items-center justify-center p-4 font-sans">
      {/* Top Navigation Bar style from screenshot */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6 px-4">
        <div className="flex items-center gap-2 text-[#0052CC] font-bold cursor-pointer">
         <span>MEDIQ</span>
        </div>
        <div className="flex gap-6 text-[13px] font-medium text-slate-600">
          <span
            className="cursor-pointer hover:text-[#0052CC]"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Request Access" : "Join as Partner"}
          </span>
          <span className="cursor-pointer hover:text-[#0052CC]">Support</span>
        </div>
      </div>

      <div
        className={`w-full ${mode === "login" ? "max-w-md" : "max-w-2xl"} bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden transition-all duration-500`}
      >
        <div className="p-8 md:p-10 text-center">
          {/* Header Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-[#0052CC] rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200 overflow-hidden">
              <img src={logo} alt="" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {mode === "login"
                ? "Access your clinical dashboard and patient care sync."
                : "Join the future of high-precision healthcare coordination."}
            </p>
          </div>

          {/* Role Switcher */}
          {mode === "register" && (
            <div className="flex p-1.5 bg-slate-100 rounded-xl mb-8 mx-auto w-full max-w-xs">
              {["PATIENT", "DOCTOR"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-lg text-xs font-bold transition-all ${role === r ? "bg-[#0052CC] text-white shadow-md" : "text-slate-500 hover:bg-slate-200"}`}
                >
                  {r === "PATIENT" ? (
                    <FiUser size={14} />
                  ) : (
                    <FiBriefcase size={14} />
                  )}
                  {r === "PATIENT" ? "Patient" : "Doctor"}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div
              className={
                mode === "register"
                  ? "grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
                  : "space-y-4"
              }
            >
              {mode === "register" && (
                <FormField label="Full Name">
                  <input
                    name="fullName"
                    placeholder="Dr. Jane Smith"
                    value={formValues.fullName}
                    onChange={handleChange}
                    required
                    className={inputStyle}
                  />
                </FormField>
              )}

              <FormField
                label={mode === "login" ? "Work Email" : "Email Address"}
              >
                <input
                  name="email"
                  type="email"
                  placeholder="jane.smith@mediq.care"
                  value={formValues.email}
                  onChange={handleChange}
                  required
                  className={inputStyle}
                />
              </FormField>

              {mode === "register" && (
                <>
                  <FormField label="Gender">
                    <select
                      name="gender"
                      value={formValues.gender}
                      onChange={handleChange}
                      required
                      className={inputStyle}
                    >
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                  </FormField>
                  <FormField label="Age">
                    <input
                      name="age"
                      type="number"
                      placeholder="e.g. 32"
                      value={formValues.age}
                      onChange={handleChange}
                      className={inputStyle}
                    />
                  </FormField>
                  <FormField label="Date of Birth">
                    <input
                      name="dob"
                      type="date"
                      value={formValues.dob}
                      onChange={handleChange}
                      required
                      className={inputStyle}
                    />
                  </FormField>
                </>
              )}

              {/* Doctor Specific Fields */}
              {mode === "register" && role === "DOCTOR" && (
                <div className="col-span-1 md:col-span-2 pt-4 mt-2 border-t border-slate-100 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FiCheckCircle className="text-emerald-500" />
                    <span className="text-[13px] font-bold text-slate-700">
                      Professional Credentials
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Medical Degree">
                      <input
                        name="degree"
                        placeholder="e.g. MBBS, MD"
                        value={formValues.degree}
                        onChange={handleChange}
                        required
                        className={inputStyle}
                      />
                    </FormField>
                    <FormField label="Experience (Years)">
                      <input
                        name="experience"
                        type="number"
                        placeholder="10"
                        value={formValues.experience}
                        onChange={handleChange}
                        required
                        className={inputStyle}
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Specialization">
                      <select
                        name="specialization"
                        value={formValues.specialization}
                        onChange={handleChange}
                        required
                        className={inputStyle}
                      >
                        <option value="">Select Specialization</option>
                        {specializations.map((s) => (
                          <option key={s._id} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </FormField>
                    <FormField label="License Number">
                      <input
                        name="licenseNumber"
                        placeholder="MD-9988-77"
                        value={formValues.licenseNumber}
                        onChange={handleChange}
                        required
                        className={inputStyle}
                      />
                    </FormField>
                  </div>

                  <FormField label="Clinic/Hospital Address">
                    <input
                      name="hospitalAddress"
                      placeholder="Street name, City, State"
                      value={formValues.hospitalAddress}
                      onChange={handleChange}
                      required
                      className={inputStyle}
                    />
                  </FormField>

                  {/* ID Verification Box style from screenshot */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center justify-between mt-4 text-left">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 flex items-center justify-center shadow-sm">
                        <FiAward className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">
                          Verify Identity
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-tight max-w-[200px]">
                          Upload a digital copy of your medical license for
                          rapid AI verification.
                        </p>
                      </div>
                    </div>
                    <label
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${isDocVerified ? "bg-emerald-50 text-emerald-600" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"}`}
                    >
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleLicenseUpload}
                        disabled={verifying}
                      />
                      {verifying ? (
                        <Ripples size="16" color="#0052CC" />
                      ) : isDocVerified ? (
                        <>
                          <FiCheckCircle /> Verified
                        </>
                      ) : (
                        <>
                          <FiUploadCloud /> Upload Document
                        </>
                      )}
                    </label>
                  </div>
                </div>
              )}

              <div
                className={
                  mode === "register" ? "col-span-1 md:col-span-2" : "w-full"
                }
              >
                <FormField
                  label={mode === "login" ? "Security Key" : "Password"}
                  extra={
                    mode === "login" && (
                      <span className="text-[11px] font-bold text-[#0052CC] cursor-pointer">
                        Forgot?
                      </span>
                    )
                  }
                >
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••••••"
                    value={formValues.password}
                    onChange={handleChange}
                    required
                    className={inputStyle}
                  />
                </FormField>
              </div>
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                verifying ||
                (mode === "register" && role === "DOCTOR" && !isDocVerified)
              }
              className="w-full bg-[#0052CC] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-[#0747A6] transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-6"
            >
              {loading ? (
                <Ripples size="25" color="#fff" />
              ) : mode === "login" ? (
                <>
                  Continue to Workspace <FiArrowRight />
                </>
              ) : (
                <>
                  Create Professional Profile <FiArrowRight />
                </>
              )}
            </button>

            {/* Bottom links */}
            <div className="pt-6 text-sm text-slate-500">
              {mode === "login" ? (
                <p>
                  New to MEDIQ ecosystem?{" "}
                  <span
                    className="text-[#0052CC] font-bold cursor-pointer"
                    onClick={() => setMode("register")}
                  >
                    Request Access
                  </span>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <span
                    className="text-[#0052CC] font-bold cursor-pointer"
                    onClick={() => setMode("login")}
                  >
                    Log in here
                  </span>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Footer Branding from Screenshot */}
      <div className="mt-8 flex gap-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <FiShield /> End-to-End Encryption
        </div>
        <div className="flex items-center gap-2">
          <FiActivity /> Instant AI Triage
        </div>
        <div className="flex items-center gap-2">
          <FiCheckCircle /> Certified Trust
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
