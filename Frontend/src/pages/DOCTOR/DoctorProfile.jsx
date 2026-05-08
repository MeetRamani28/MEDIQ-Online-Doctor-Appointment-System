/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDoctorProfile,
  updateDoctorProfile,
} from "../../features/doctor/doctorThunks";
import {
  clearDoctorError,
  clearDoctorSuccess,
} from "../../features/doctor/doctorSlice";
import {
  User,
  Mail,
  GraduationCap,
  Briefcase,
  MapPin,
  IndianRupee,
  Save,
  Camera,
  Info,
  ShieldCheck,
} from "lucide-react";
import { Ripples } from "ldrs/react";
import { toast, ToastContainer } from "react-toastify";
import getImageSrc from "../../components/atoms/getImageSrc";
import "react-toastify/dist/ReactToastify.css";
import "ldrs/react/Ripples.css";

const DoctorProfile = () => {
  const dispatch = useDispatch();
  const { profile, loading, error, successMessage } = useSelector(
    (s) => s.doctor,
  );
  const [form, setForm] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    dispatch(getDoctorProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      const doctorProfile = profile.doctorProfile || {};
      setForm({
        fullName: profile.fullName || "",
        email: profile.email || "",
        degree: doctorProfile.degree || "",
        experience: doctorProfile.experience || "",
        consultationFee: doctorProfile.consultationFee || "",
        hospitalAddress: doctorProfile.hospitalAddress || "",
        description: doctorProfile.description || "",
        avatar: null,
      });
      setAvatarPreview(getImageSrc(doctorProfile.profileImage) || null);
    }
  }, [profile]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearDoctorError());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearDoctorSuccess());
    }
  }, [error, successMessage, dispatch]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, avatar: file });
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key] !== null && form[key] !== undefined) {
        const fieldName = key === "avatar" ? "profileImage" : key;
        formData.append(fieldName, form[key]);
      }
    });
    dispatch(updateDoctorProfile(formData));
  };

  if (loading && !profile) {
    return (
      <div className="h-[80vh] flex flex-col justify-center items-center gap-4">
        <Ripples size={70} color="#10b981" />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">
          Loading Identity
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFCFD] p-6 md:p-10 lg:p-14">
      <ToastContainer position="top-right" theme="colored" hideProgressBar />

      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 text-left">
          <h1 className="text-4xl font-light text-slate-900 tracking-tighter">
            Profile <span className="font-bold">Settings</span>
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            Update your professional identity and clinical details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar & Basic Info Card */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-10 shadow-sm flex flex-col md:flex-row items-center gap-10">
            <div className="relative group">
              <div className="w-36 h-36 rounded-[2.5rem] overflow-hidden border-4 border-slate-50 shadow-xl relative">
                <img
                  src={
                    avatarPreview ||
                    `https://ui-avatars.com/api/?name=${form.fullName}&background=10b981&color=fff`
                  }
                  alt="Doctor"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Camera className="text-white" size={28} />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2.5 rounded-2xl shadow-lg border-4 border-white">
                <ShieldCheck size={18} strokeWidth={3} />
              </div>
            </div>

            <div className="text-center md:text-left space-y-2">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                Active Practitioner
              </span>
              <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
                {form.fullName || "Loading..."}
              </h2>
              <p className="text-slate-400 font-medium flex items-center justify-center md:justify-start gap-2 italic">
                <Mail size={14} className="text-emerald-500" /> {form.email}
              </p>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-10 border-b border-slate-50 pb-6">
              <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                <Info size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tighter">
                Professional Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              <Field
                icon={<User size={18} />}
                label="Full Name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
              />
              <Field
                icon={<Mail size={18} />}
                label="Email Address"
                name="email"
                value={form.email}
                disabled
              />
              <Field
                icon={<GraduationCap size={18} />}
                label="Degree / Specialty"
                name="degree"
                value={form.degree}
                onChange={handleChange}
                placeholder="MBBS, MD Cardiology"
              />
              <Field
                icon={<Briefcase size={18} />}
                label="Total Experience"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                placeholder="Number of years"
              />
              <Field
                icon={<IndianRupee size={18} />}
                label="Consultation Fee"
                name="consultationFee"
                value={form.consultationFee}
                onChange={handleChange}
              />
              <Field
                icon={<MapPin size={18} />}
                label="Clinic / Hospital Address"
                name="hospitalAddress"
                value={form.hospitalAddress}
                onChange={handleChange}
              />
            </div>

            <div className="mt-10">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                Professional Biography
              </label>
              <textarea
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                placeholder="Write a brief overview of your medical practice..."
                className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-50/50 px-6 py-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-200 transition-all resize-none"
              />
            </div>

            <div className="mt-12 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="group flex items-center gap-3 px-10 py-4 rounded-2xl bg-slate-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 hover:shadow-emerald-100 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  "Syncing..."
                ) : (
                  <>
                    <Save size={18} className="group-hover:animate-bounce" />
                    Update Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const Field = ({ icon, label, ...props }) => (
  <div className="space-y-2 text-left">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <div className="relative group">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors">
        {icon}
      </span>
      <input
        {...props}
        className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-200 transition-all placeholder:text-slate-300 disabled:opacity-60 disabled:cursor-not-allowed"
      />
    </div>
  </div>
);

export default DoctorProfile;
