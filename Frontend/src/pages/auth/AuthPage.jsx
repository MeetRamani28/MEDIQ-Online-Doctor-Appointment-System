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
} from "react-icons/fi";

// FormField Component (Outside to maintain focus)
const FormField = ({ icon: Icon, children, label }) => (
  <div className="space-y-1.5 w-full text-left">
    {label && (
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
        {label}
      </label>
    )}
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0052CC] transition-colors z-10">
        <Icon size={18} />
      </div>
      {children}
    </div>
  </div>
);

const AuthPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("PATIENT");

  // --- Added new fields in formValues ---
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
    degree: "", // New
    experience: "", // New
    consultationFee: "", // New
    description: "", // New
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
    // Reset form values on mode change if needed
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex items-center justify-center p-4 md:p-8 font-sans">
      <div
        className={`w-full ${mode === "login" ? "max-w-5xl" : "max-w-4xl"} bg-white rounded-[40px] shadow-2xl border border-slate-100 flex flex-col md:flex-row overflow-hidden transition-all duration-500`}
      >
        {/* Branding Side */}
        <div
          className={`${mode === "login" ? "lg:flex w-[40%]" : "hidden"} hidden bg-[#0052CC] p-12 flex-col justify-between text-white relative`}
        >
          <div className="z-10">
            <div className="flex items-center gap-3 mb-16">
              <img
                src={icon}
                alt="Logo"
                className="w-8 h-8 bg-white/20 p-1 rounded-lg"
              />
              <span className="text-2xl font-black italic uppercase">
                MEDIQ
              </span>
            </div>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Elevating <br /> Care Standard.
            </h1>
            <p className="text-blue-100/70 text-lg">
              Intelligent ecosystem for healthcare professionals.
            </p>
          </div>
          <div className="z-10 bg-white/10 backdrop-blur-md p-6 rounded-[32px] border border-white/10">
            <div className="flex justify-between items-center text-sm font-bold">
              <span>Security Verified</span>{" "}
              <FiShield className="text-blue-300" />
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 p-8 md:p-14 overflow-y-auto max-h-[90vh] scrollbar-hide">
          <header className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-black tracking-tight">
              {mode === "login" ? "Welcome back" : "Create portal"}
            </h2>
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-sm font-bold text-[#0052CC] flex items-center gap-2 hover:underline"
            >
              {mode === "login" ? "Create Account" : "Log In"} <FiArrowRight />
            </button>
          </header>

          {mode === "register" && (
            <div className="inline-flex p-1 bg-slate-100 rounded-2xl mb-8 w-full max-w-xs">
              {["PATIENT", "DOCTOR"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${role === r ? "bg-white text-[#0052CC] shadow-sm" : "text-slate-500"}`}
                >
                  {r === "PATIENT" ? "Patient" : "Practitioner"}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div
              className={
                mode === "register"
                  ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                  : "space-y-4"
              }
            >
              {mode === "register" && (
                <FormField icon={FiUser}>
                  <Input
                    name="fullName"
                    placeholder="Full Name"
                    value={formValues.fullName}
                    onChange={handleChange}
                    required
                    className="pl-12"
                  />
                </FormField>
              )}

              <FormField icon={FiMail}>
                <Input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={formValues.email}
                  onChange={handleChange}
                  required
                  className="pl-12"
                />
              </FormField>

              {mode === "register" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField icon={FiActivity}>
                      <Select
                        name="gender"
                        value={formValues.gender}
                        onChange={handleChange}
                        required
                        className="pl-12"
                      >
                        <option value="">Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                      </Select>
                    </FormField>
                    <Input
                      name="age"
                      type="number"
                      placeholder="Age"
                      value={formValues.age}
                      onChange={handleChange}
                      className="bg-slate-50"
                    />
                  </div>
                  <FormField icon={FiCalendar} label="Date of Birth">
                    <Input
                      name="dob"
                      type="date"
                      value={formValues.dob}
                      onChange={handleChange}
                      required
                      className="pl-12"
                    />
                  </FormField>
                </>
              )}

              {/* --- Doctor Specific Fields --- */}
              {mode === "register" && role === "DOCTOR" && (
                <div className="col-span-1 md:col-span-2 pt-6 border-t space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FiBriefcase className="text-blue-600" />
                    <span className="text-xs font-bold uppercase text-slate-400">
                      Professional Details
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField icon={FiBookOpen}>
                      <Input
                        name="degree"
                        placeholder="Medical Degree (e.g. MBBS, MD)"
                        value={formValues.degree}
                        onChange={handleChange}
                        required
                        className="pl-12"
                      />
                    </FormField>
                    <FormField icon={FiBriefcase}>
                      <Input
                        name="experience"
                        type="number"
                        placeholder="Experience (in Years)"
                        value={formValues.experience}
                        onChange={handleChange}
                        required
                        className="pl-12"
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField icon={FiDollarSign}>
                      <Input
                        name="consultationFee"
                        type="number"
                        placeholder="Consultation Fee (₹)"
                        value={formValues.consultationFee}
                        onChange={handleChange}
                        required
                        className="pl-12"
                      />
                    </FormField>
                    <FormField icon={FiActivity}>
                      <Select
                        name="specialization"
                        value={formValues.specialization}
                        onChange={handleChange}
                        required
                        className="pl-12"
                      >
                        <option value="">Specialization</option>
                        {specializations.map((s) => (
                          <option key={s._id} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </Select>
                    </FormField>
                  </div>

                  <FormField icon={FiMapPin}>
                    <Input
                      name="hospitalAddress"
                      placeholder="Clinic/Hospital Address"
                      value={formValues.hospitalAddress}
                      onChange={handleChange}
                      required
                      className="pl-12"
                    />
                  </FormField>

                  <FormField icon={FiAlignLeft}>
                    <textarea
                      name="description"
                      placeholder="Tell patients about yourself..."
                      value={formValues.description}
                      onChange={handleChange}
                      className="w-full resize-none pl-12 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none min-h-[100px] transition-all"
                    />
                  </FormField>

                  <FormField icon={FiAward} label="Identity Verification">
                    <Input
                      name="licenseNumber"
                      placeholder="License Number"
                      value={formValues.licenseNumber}
                      onChange={handleChange}
                      required
                      className="pl-12"
                    />
                  </FormField>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="border-2 border-dashed rounded-2xl p-4 flex flex-col items-center cursor-pointer hover:bg-slate-50">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setFiles((prev) => ({
                              ...prev,
                              profileImage: file,
                            }));
                            setPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                      {preview ? (
                        <img
                          src={preview}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <FiUploadCloud className="text-slate-400" size={20} />
                      )}
                      <span className="text-[10px] font-bold mt-1 text-slate-500">
                        Avatar
                      </span>
                    </label>

                    <label className="border-2 border-dashed rounded-2xl p-4 flex flex-col items-center cursor-pointer hover:bg-slate-50 relative">
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleLicenseUpload}
                        disabled={verifying}
                      />
                      {verifying ? (
                        <Ripples size="20" color="#0052CC" />
                      ) : isDocVerified ? (
                        <FiCheckCircle className="text-green-500" size={20} />
                      ) : (
                        <FiShield className="text-slate-400" size={20} />
                      )}
                      <span className="text-[10px] font-bold mt-1 text-slate-500 truncate w-full text-center">
                        {isDocVerified
                          ? "Verified ✅"
                          : docPreview || "License PDF"}
                      </span>
                    </label>
                  </div>
                </div>
              )}

              <div
                className={
                  mode === "register" ? "col-span-1 md:col-span-2" : "w-full"
                }
              >
                <FormField icon={FiLock}>
                  <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formValues.password}
                    onChange={handleChange}
                    required
                    className="pl-12"
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
              className="w-full bg-[#0052CC] text-white py-3.5 rounded-2xl font-bold shadow-lg hover:bg-[#0747A6] transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
            >
              {loading ? (
                <Ripples size="25" color="#fff" />
              ) : mode === "login" ? (
                "Sign In"
              ) : (
                "Register Now"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
