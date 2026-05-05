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
} from "lucide-react";

import { Ripples } from "ldrs/react";
import { toast, ToastContainer } from "react-toastify";

import getImageSrc from "../../components/atoms/getImageSrc";
import "react-toastify/dist/ReactToastify.css";
import "ldrs/react/Ripples.css";

const DoctorProfile = () => {
  const dispatch = useDispatch();
  const { profile, loading, error, successMessage } = useSelector(
    (s) => s.doctor
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
      // Change 'avatar' to 'profileImage' to match backend/schema
      const fieldName = key === 'avatar' ? 'profileImage' : key;
      formData.append(fieldName, form[key]);
    }
  });

  dispatch(updateDoctorProfile(formData));
};

  if (loading && !profile) {
    return (
      <div className="h-[70vh] flex justify-center items-center">
        <Ripples size={80} color="#10b981" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <ToastContainer />

      <div className="max-w-6xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow p-6 lg:p-8 space-y-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-28 h-28">
              <img
                src={
                  avatarPreview ||
                  "https://ui-avatars.com/api/?name=Doctor&background=10b981&color=fff"
                }
                alt="Doctor Avatar"
                className="w-28 h-28 rounded-full object-cover border"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer rounded-full"
              />
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-xl font-semibold text-gray-800">
                {form.fullName || "Doctor Name"}
              </h2>
              <p className="text-sm text-gray-500">{form.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field
              icon={<User />}
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
            />

            <Field
              icon={<Mail />}
              label="Email"
              name="email"
              value={form.email}
              disabled
            />

            <Field
              icon={<GraduationCap />}
              label="Degree"
              name="degree"
              value={form.degree}
              onChange={handleChange}
            />

            <Field
              icon={<Briefcase />}
              label="Experience (Years)"
              name="experience"
              value={form.experience}
              onChange={handleChange}
            />

            <Field
              icon={<IndianRupee />}
              label="Consultation Fee"
              name="consultationFee"
              value={form.consultationFee}
              onChange={handleChange}
            />

            <Field
              icon={<MapPin />}
              label="Hospital Address"
              name="hospitalAddress"
              value={form.hospitalAddress}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              About Doctor
            </label>
            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-60"
            >
              <Save size={18} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Field = ({ icon, label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </span>
      <input
        {...props}
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-300 disabled:bg-gray-100"
      />
    </div>
  </div>
);

export default DoctorProfile;
