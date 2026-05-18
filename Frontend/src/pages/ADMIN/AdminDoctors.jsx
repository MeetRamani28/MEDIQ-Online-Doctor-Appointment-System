/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllDoctors,
  toggleDoctorStatus,
  deleteDoctor,
  addDoctor,
  updateDoctor,
} from "../../features/admin/adminThunks";
import { fetchSpecializations } from "../../features/specialization/specializationThunks";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  ShieldCheck,
  ShieldAlert,
  Award,
  Banknote,
  MapPin,
  Layers,
} from "lucide-react";
import getImageSrc from "../../components/atoms/getImageSrc";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Ripples } from "ldrs/react";
import "ldrs/react/Ripples.css";

const AdminDoctors = () => {
  const dispatch = useDispatch();
  const { doctors = [], loading, error } = useSelector((state) => state.admin);
  const { list: specializations } = useSelector(
    (state) => state.specialization,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    degree: "",
    experience: "",
    consultationFee: "",
    description: "",
    hospitalAddress: "",
    specialization: "",
    available: true,
    maxAppointmentsPerDay: 10,
    profileImage: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 6; // Shifted to 6 for grid balance

  useEffect(() => {
    dispatch(fetchAllDoctors());
    dispatch(fetchSpecializations());
  }, [dispatch]);

  const handleOpenModal = (doctor = null) => {
    if (doctor) {
      setEditingId(doctor._id);
      setFormData({
        fullName: doctor.fullName || "",
        email: doctor.email || "",
        degree: doctor.doctorProfile?.degree || "",
        experience: doctor.doctorProfile?.experience || "",
        consultationFee: doctor.doctorProfile?.consultationFee || "",
        description: doctor.doctorProfile?.description || "",
        hospitalAddress: doctor.doctorProfile?.hospitalAddress || "",
        specialization: doctor.doctorProfile?.specialization?._id || "",
        available: doctor.doctorProfile?.available ?? true,
        maxAppointmentsPerDay:
          doctor.doctorProfile?.maxAppointmentsPerDay || 10,
        profileImage: null,
      });
      setImagePreview(getImageSrc(doctor.doctorProfile?.profileImage));
    } else {
      setEditingId(null);
      setFormData({
        fullName: "",
        email: "",
        degree: "",
        experience: "",
        consultationFee: "",
        description: "",
        hospitalAddress: "",
        specialization: "",
        available: true,
        maxAppointmentsPerDay: 10,
        profileImage: null,
      });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, profileImage: files[0] });
      setImagePreview(URL.createObjectURL(files[0]));
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) data.append(key, value);
    });

    if (editingId) {
      const tempDoctor = {
        _id: editingId,
        fullName: formData.fullName,
        email: formData.email,
        doctorProfile: {
          degree: formData.degree,
          experience: formData.experience,
          consultationFee: formData.consultationFee,
          description: formData.description,
          hospitalAddress: formData.hospitalAddress,
          specialization: { _id: formData.specialization },
          isActive: formData.available,
          maxAppointmentsPerDay: formData.maxAppointmentsPerDay,
          profileImage: imagePreview,
        },
      };
      dispatch({ type: "admin/updateDoctorOptimistic", payload: tempDoctor });
      setIsModalOpen(false);
      toast.info("Saving changes...");
      try {
        await dispatch(
          updateDoctor({ id: editingId, doctorData: data }),
        ).unwrap();
        toast.success("Doctor updated successfully!");
      } catch {
        toast.error("Update failed. Re-syncing system data.");
        dispatch(fetchAllDoctors());
      }
    } else {
      const tempId = Date.now();
      const tempDoctor = {
        _id: tempId,
        fullName: formData.fullName,
        email: formData.email,
        doctorProfile: {
          degree: formData.degree,
          experience: formData.experience,
          consultationFee: formData.consultationFee,
          description: formData.description,
          hospitalAddress: formData.hospitalAddress,
          specialization: { _id: formData.specialization },
          isActive: formData.available,
          maxAppointmentsPerDay: formData.maxAppointmentsPerDay,
          profileImage: imagePreview,
        },
      };
      dispatch({ type: "admin/addDoctorOptimistic", payload: tempDoctor });
      setIsModalOpen(false);
      toast.info("Saving new practitioner...");
      try {
        const result = await dispatch(addDoctor(data)).unwrap();
        dispatch({
          type: "admin/replaceTempDoctor",
          payload: { tempId, doctor: result },
        });
        toast.success("Doctor registered successfully!");
      } catch {
        toast.error("Failed to add doctor.");
        dispatch({ type: "admin/removeTempDoctor", payload: tempId });
      }
    }
  };

  const handleDelete = async (id) => {
    dispatch({ type: "admin/deleteDoctorOptimistic", payload: id });
    toast.info("Removing dynamic record...");
    try {
      await dispatch(deleteDoctor(id)).unwrap();
      toast.success("Doctor file removed from stream.");
    } catch {
      toast.error("Failed to clear file node.");
      dispatch(fetchAllDoctors());
    }
  };

  const handleToggleStatus = async (id) => {
    dispatch({ type: "admin/toggleDoctorOptimistic", payload: id });
    try {
      await dispatch(toggleDoctorStatus(id)).unwrap();
      toast.info("Routing access profile modified.");
    } catch {
      toast.error("Failed to shift state configuration.");
      dispatch(fetchAllDoctors());
    }
  };

  // Pagination bounds calculation
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(doctors.length / doctorsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 selection:bg-teal-50">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        shadow-sm
      />

      {/* Main Command Header Strip */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Practitioner Directory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure system status, availability lineup, and specialized access
            nodes.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-500 text-white font-semibold text-sm rounded-xl shadow-sm hover:bg-teal-600 active:scale-95 transition-all duration-200"
        >
          <Plus size={16} strokeWidth={2.5} /> Register New Doctor
        </button>
      </header>

      {/* Loading Canvas state */}
      {loading && (
        <div className="flex flex-col justify-center items-center h-[40vh] bg-white border border-slate-100 rounded-3xl shadow-xs">
          <Ripples size={55} speed={2} color="#0d9488" />
          <p className="mt-5 text-slate-500 text-xs font-semibold tracking-widest uppercase animate-pulse">
            Sourcing System Registry...
          </p>
        </div>
      )}

      {/* Exceptional Alert Canvas */}
      {error && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl shadow-xs">
          <div className="flex gap-3 items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            <p className="text-rose-900 font-medium text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Modern Asymmetric Profiler Card-Grid System */}
      {!loading && currentDoctors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentDoctors.map((doc) => (
            <div
              key={doc._id}
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-slate-200 group"
            >
              {/* Header Structural Wrapper */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={getImageSrc(doc.doctorProfile?.profileImage)}
                      alt={doc.fullName}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-100 shadow-inner group-hover:scale-102 transition-transform duration-300"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 tracking-tight group-hover:text-teal-600 transition-colors">
                        {doc.fullName}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 font-medium">
                        {doc.email}
                      </p>
                    </div>
                  </div>

                  {/* Operational Status Switch Node */}
                  <button
                    onClick={() => handleToggleStatus(doc._id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border transition-all ${
                      doc.doctorProfile?.isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100"
                        : "bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100"
                    }`}
                  >
                    {doc.doctorProfile?.isActive ? (
                      <ShieldCheck size={12} strokeWidth={2.5} />
                    ) : (
                      <ShieldAlert size={12} strokeWidth={2.5} />
                    )}
                    {doc.doctorProfile?.isActive ? "Active" : "Halted"}
                  </button>
                </div>

                {/* Technical Credentials Tag Pill Node */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-slate-500 font-bold text-[10px] uppercase">
                    <Award size={10} /> {doc.doctorProfile?.degree || "N/A"}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50/60 border border-teal-100/60 text-teal-700 font-bold text-[10px] uppercase">
                    <Layers size={10} />{" "}
                    {specializations.find(
                      (s) => s._id === doc.doctorProfile?.specialization?._id,
                    )?.name || "General Route"}
                  </span>
                </div>

                {/* Metadata Field Block */}
                <div className="bg-slate-50/50 border border-slate-50 rounded-xl p-3 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">
                      Clinical Seniority
                    </span>
                    <span className="font-bold text-slate-700">
                      {doc.doctorProfile?.experience || "0"} Active Years
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">
                      Consultation Fee
                    </span>
                    <span className="font-bold text-slate-800 inline-flex items-center gap-0.5">
                      <Banknote size={12} className="text-slate-400" /> ₹
                      {doc.doctorProfile?.consultationFee || "0"}
                    </span>
                  </div>
                  <div className="flex gap-2 pt-1 border-t border-slate-100">
                    <MapPin
                      size={13}
                      className="text-slate-400 shrink-0 mt-0.5"
                    />
                    <p className="text-slate-500 line-clamp-1 font-medium">
                      {doc.doctorProfile?.hospitalAddress ||
                        "No Anchor Address Configured"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Utility Form Action Bar */}
              <div className="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-slate-50">
                <button
                  onClick={() => handleOpenModal(doc)}
                  className="p-2 text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-lg transition-colors shadow-xs active:scale-95"
                  title="Modify Practitioner Specs"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(doc._id)}
                  className="p-2 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-100 hover:border-rose-100 rounded-lg transition-colors shadow-xs active:scale-95"
                  title="De-register Record Node"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Command Cluster */}
      {doctors.length > doctorsPerPage && (
        <div className="flex justify-center items-center gap-1.5 pt-6 border-t border-slate-100">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                currentPage === i + 1
                  ? "bg-gradient-to-r from-cyan-600 to-teal-500 text-white shadow-xs"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Glassmorphic Layer Modal Dashboard Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 overflow-y-auto max-h-[85vh] border border-slate-100">
            {/* Modal Heading Control */}
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId
                    ? "Modify Practitioner Parameters"
                    : "System Core Registration"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fill out registry parameters securely
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-slate-100 rounded-lg transition-all active:scale-95"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="e.g. Dr. Jane Smith"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full border border-slate-200 focus:border-teal-500 rounded-xl px-4 py-2 outline-none shadow-inner transition-all font-medium text-slate-800"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Identity Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="practitioner@system.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-slate-200 focus:border-teal-500 rounded-xl px-4 py-2 outline-none shadow-inner transition-all font-medium text-slate-800"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Routing Access Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder={
                      editingId
                        ? "•••••••• (Leave blank to keep configuration)"
                        : "Secure entry validation"
                    }
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border border-slate-200 focus:border-teal-500 rounded-xl px-4 py-2 outline-none shadow-inner transition-all font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Degree Badge
                  </label>
                  <input
                    type="text"
                    name="degree"
                    placeholder="MD, MBBS, MS, PhD"
                    value={formData.degree}
                    onChange={handleChange}
                    className="w-full border border-slate-200 focus:border-teal-500 rounded-xl px-4 py-2 outline-none shadow-inner transition-all font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Experience Bound (Yrs)
                  </label>
                  <input
                    type="number"
                    name="experience"
                    placeholder="Years active"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full border border-slate-200 focus:border-teal-500 rounded-xl px-4 py-2 outline-none shadow-inner transition-all font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Consultation Rate (INR)
                  </label>
                  <input
                    type="number"
                    name="consultationFee"
                    placeholder="Fee index"
                    value={formData.consultationFee}
                    onChange={handleChange}
                    className="w-full border border-slate-200 focus:border-teal-500 rounded-xl px-4 py-2 outline-none shadow-inner transition-all font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Intake Limit/Day
                  </label>
                  <input
                    type="number"
                    name="maxAppointmentsPerDay"
                    placeholder="Max queue density"
                    value={formData.maxAppointmentsPerDay}
                    onChange={handleChange}
                    className="w-full border border-slate-200 focus:border-teal-500 rounded-xl px-4 py-2 outline-none shadow-inner transition-all font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Domain Routing Classification
                  </label>
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full border border-slate-200 focus:border-teal-500 rounded-xl px-4 py-2 outline-none bg-white font-medium text-slate-700"
                    required
                  >
                    <option value="">Select Domain Specialization</option>
                    {specializations.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Anchor Hospital Address
                  </label>
                  <input
                    type="text"
                    name="hospitalAddress"
                    placeholder="Full physical structural facilities footprint location description"
                    value={formData.hospitalAddress}
                    onChange={handleChange}
                    className="w-full border border-slate-200 focus:border-teal-500 rounded-xl px-4 py-2 outline-none shadow-inner font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Public Biography Segment
                </label>
                <textarea
                  name="description"
                  placeholder="Summarize expert field focus parameters..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border border-slate-200 focus:border-teal-500 rounded-xl px-4 py-2 outline-none h-20 shadow-inner font-medium text-slate-800"
                />
              </div>

              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-3 rounded-xl max-w-max">
                <input
                  type="checkbox"
                  name="available"
                  id="available-toggle"
                  checked={formData.available}
                  onChange={handleChange}
                  className="h-4 w-4 accent-slate-900 border-slate-300 rounded-md cursor-pointer"
                />
                <label
                  htmlFor="available-toggle"
                  className="text-xs text-slate-700 font-bold uppercase tracking-wide cursor-pointer select-none"
                >
                  Immediate Stream Intake Available
                </label>
              </div>

              <div className="border-t border-slate-100 pt-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="space-y-1.5 max-w-xs">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block">
                    Directory Identity Portrait
                  </label>
                  <input
                    type="file"
                    name="profileImage"
                    accept="image/*"
                    onChange={handleChange}
                    className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200 cursor-pointer"
                  />
                </div>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Core Profile Preview"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm transition-all animate-fade-in"
                  />
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-600 to-teal-500 text-white font-bold py-3 rounded-xl shadow-xs hover:bg-teal-600 active:scale-[0.99] transition-all duration-200 mt-2"
              >
                {editingId
                  ? "Commit Spectrum Matrix Changes"
                  : "Confirm Structural Registration Pipeline"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctors;
