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
import { Plus, Pencil, Trash2, X, CheckCircle, XCircle } from "lucide-react";
import getImageSrc from "../../components/atoms/getImageSrc";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Ripples } from "ldrs/react";
import "ldrs/react/Ripples.css";

const AdminDoctors = () => {
  const dispatch = useDispatch();
  const { doctors = [], loading, error } = useSelector((state) => state.admin);
  const { list: specializations } = useSelector(
    (state) => state.specialization
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
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
  const [imagePreview, setImagePreview] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 5;

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
          updateDoctor({ id: editingId, doctorData: data })
        ).unwrap();
        toast.success("Doctor updated successfully!");
      } catch {
        toast.error("Update failed. Refresh to see latest data.");
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
      toast.info("Saving new doctor...");
      try {
        const result = await dispatch(addDoctor(data)).unwrap();
        dispatch({
          type: "admin/replaceTempDoctor",
          payload: { tempId, doctor: result },
        });
        toast.success("Doctor added successfully!");
      } catch {
        toast.error("Failed to add doctor.");
        dispatch({ type: "admin/removeTempDoctor", payload: tempId });
      }
    }
  };

  const handleDelete = async (id) => {
    dispatch({ type: "admin/deleteDoctorOptimistic", payload: id });
    toast.info("Deleting doctor...");
    try {
      await dispatch(deleteDoctor(id)).unwrap();
      toast.success("Doctor deleted successfully!");
    } catch {
      toast.error("Failed to delete doctor.");
      dispatch(fetchAllDoctors());
    }
  };

  const handleToggleStatus = async (id) => {
    dispatch({ type: "admin/toggleDoctorOptimistic", payload: id });
    try {
      await dispatch(toggleDoctorStatus(id)).unwrap();
      toast.info("Doctor status updated!");
    } catch {
      toast.error("Failed to update status.");
      dispatch(fetchAllDoctors());
    }
  };

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(doctors.length / doctorsPerPage);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
          Doctor Management
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-linear-to-r from-teal-500 to-cyan-500 text-white px-5 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:scale-105 transition transform w-full sm:w-auto justify-center"
        >
          <Plus size={20} /> Add New Doctor
        </button>
      </div>

      {loading && (
        <div className="flex flex-col justify-center items-center h-96">
          <Ripples size={80} speed={2} color="#0097a7" />
          <p className="mt-4 text-[#0097a7] font-medium animate-pulse">
            Syncing Doctors data...
          </p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6 rounded-r-lg">
          <div className="flex items-center">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      {!loading && currentDoctors.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
          <table className="w-full text-left border-collapse min-w-150">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
              <tr>
                <th className="p-4 font-semibold">Doctor Info</th>
                <th className="p-4 font-semibold">Experience</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentDoctors.map((doc) => (
                <tr key={doc._id} className="hover:bg-gray-50 transition">
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={getImageSrc(doc.doctorProfile?.profileImage)}
                      alt={doc.fullName}
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                    <div className="flex flex-col">
                      <p className="font-bold text-gray-800">{doc.fullName}</p>
                      <p className="text-sm text-gray-500">{doc.email}</p>
                      <p className="text-xs text-gray-400">
                        {doc.doctorProfile?.degree}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {doc.doctorProfile?.experience || "N/A"} Yrs
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleStatus(doc._id)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition ${
                        doc.doctorProfile?.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {doc.doctorProfile?.isActive ? (
                        <CheckCircle size={14} />
                      ) : (
                        <XCircle size={14} />
                      )}
                      {doc.doctorProfile?.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button
                      onClick={() => handleOpenModal(doc)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(doc._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {doctors.length > doctorsPerPage && (
        <div className="flex flex-wrap justify-center mt-4 gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-1 rounded-md font-medium border transition ${
                currentPage === i + 1
                  ? "bg-teal-500 text-white"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingId ? "Edit Doctor" : "Register Doctor"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={28} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-400 outline-none"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-400 outline-none"
                  required
                />
                <input
                  type="text"
                  name="degree"
                  placeholder="Degree"
                  value={formData.degree}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-400 outline-none"
                />
                <input
                  type="number"
                  name="experience"
                  placeholder="Experience (Yrs)"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-400 outline-none"
                />
                <input
                  type="number"
                  name="consultationFee"
                  placeholder="Consultation Fee"
                  value={formData.consultationFee}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-400 outline-none"
                />
                <input
                  type="number"
                  name="maxAppointmentsPerDay"
                  placeholder="Max Appointments/Day"
                  value={formData.maxAppointmentsPerDay}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-400 outline-none"
                />
                <input
                  type="text"
                  name="hospitalAddress"
                  placeholder="Hospital Address"
                  value={formData.hospitalAddress}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-400 outline-none col-span-2"
                />
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-400 outline-none"
                  required
                >
                  <option value="">Select Specialization</option>
                  {specializations.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-400 outline-none"
              />

              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                  className="h-5 w-5 text-teal-500 border-gray-300 rounded"
                />
                <label className="text-gray-700 font-medium">Available</label>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Profile Image
                </label>
                <input
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-400 outline-none"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="mt-2 w-32 h-32 rounded-full object-cover border shadow-lg"
                  />
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-linear-to-r from-teal-500 to-cyan-500 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 transition transform"
              >
                {editingId ? "Save Changes" : "Add Doctor"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctors;
