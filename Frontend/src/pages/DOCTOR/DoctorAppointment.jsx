/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDoctorDashboard } from "../../features/doctor/doctorThunks";
import { completeAppointment } from "../../features/appointments/appointmentThunks";
import {
  clearAppointmentError,
  clearAppointmentSuccess,
} from "../../features/appointments/appointmentSlice";
import { clearDoctorError } from "../../features/doctor/doctorSlice";
import {
  Calendar,
  User,
  X,
  Stethoscope,
  FileEdit,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Ripples } from "ldrs/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "ldrs/react/Ripples.css";

const AppointmentCard = ({ appointment, onCompleteClick }) => {
  const date = new Date(appointment.appointmentDate).toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-5 md:p-6 transition-all duration-200 hover:shadow-md hover:border-emerald-100 group">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
            <User size={24} />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-slate-800 tracking-tight">
              {appointment.user?.fullName || "Private Patient"}
            </h3>
            <div className="flex items-center gap-3 mt-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Calendar size={12} className="text-emerald-500" /> {date}
              </span>
              <span className="w-1 h-1 bg-slate-200 rounded-full" />
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-emerald-500" />{" "}
                {appointment.appointmentTime}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-6">
          <span
            className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
              appointment.status === "CONFIRMED"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {appointment.status}
          </span>
          <button
            onClick={() => onCompleteClick(appointment)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:text-slate-800 transition-all active:scale-95 shadow-sm"
          >
            <CheckCircle size={14} /> Complete
          </button>
        </div>
      </div>
    </div>
  );
};

// ... CompleteModal component remains same as your previous code ...
const CompleteModal = ({ onClose, onSubmit, loading }) => {
  const [form, setForm] = useState({
    symptoms: "",
    diagnosis: "",
    prescription: "",
    doctorNotes: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-[2px] p-4">
      {/* મોડલની વિડ્થ નાની કરી (max-w-md) અને હાઈટ ફિક્સ કરી */}
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col border border-slate-100 animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
              <FileEdit size={18} />
            </div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight">
              Finalize Case
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body - Scrollable Area */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(form);
          }}
          className="flex flex-col"
        >
          <div className="p-6 space-y-5 max-h-[400px] overflow-y-auto custom-scrollbar text-left">
            {[
              { name: "symptoms", label: "Symptoms", icon: Activity },
              { name: "diagnosis", label: "Diagnosis", icon: Stethoscope },
              { name: "prescription", label: "Prescription", icon: FileEdit },
              { name: "doctorNotes", label: "Doctor Notes", icon: AlertCircle },
            ].map(({ name, label, icon: Icon }) => (
              <div key={name} className="space-y-1.5">
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  <Icon size={12} className="text-emerald-500" /> {label}
                </label>
                <textarea
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required
                  rows={2}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-300 transition-all placeholder:text-slate-300"
                  placeholder={`Enter ${label.toLowerCase()}...`}
                />
              </div>
            ))}
          </div>

          {/* Footer Actions - Fixed at bottom */}
          <div className="p-5 bg-slate-50/50 border-t border-slate-100 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-[11px] uppercase tracking-wider hover:bg-slate-900 shadow-lg shadow-slate-200 transition-all disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DoctorAppointment = () => {
  const dispatch = useDispatch();
  const { dashboard, loading } = useSelector((s) => s.doctor);
  const {
    loading: actionLoading,
    successMessage,
    error: apptError,
  } = useSelector((s) => s.appointment);

  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(getDoctorDashboard());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearAppointmentSuccess());
      setSelectedAppointment(null);
      dispatch(getDoctorDashboard());
    }
  }, [successMessage, dispatch]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-3">
        <Ripples size={60} speed={2} color="#10b981" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">
          Fetching Appointments
        </span>
      </div>
    );
  }

  const appointments = dashboard?.upcomingAppointments || [];

  // Pagination Logic
  const totalPages = Math.ceil(appointments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = appointments.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 md:p-10">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
          <div className="text-left">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Consultation Queue
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Review and manage your daily patient schedule
            </p>
          </div>
          <div className="px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">
              {appointments.length} Total
            </span>
          </div>
        </header>

        <div className="space-y-4">
          {currentItems.length ? (
            <>
              {currentItems.map((appt) => (
                <AppointmentCard
                  key={appt._id}
                  appointment={appt}
                  onCompleteClick={setSelectedAppointment}
                />
              ))}

              {/* Pagination UI */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-10">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="flex items-center gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-xl text-xs font-bold transition-all shadow-sm ${
                          currentPage === i + 1
                            ? "bg-emerald-500 text-white border-emerald-500"
                            : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-200"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center bg-white rounded-4xl border border-dashed border-slate-200">
              <Calendar size={40} className="mx-auto text-slate-100 mb-3" />
              <p className="text-slate-400 text-sm font-medium italic">
                No pending appointments found.
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedAppointment && (
        <CompleteModal
          onClose={() => setSelectedAppointment(null)}
          onSubmit={(medicalRecord) =>
            dispatch(
              completeAppointment({
                appointmentId: selectedAppointment._id,
                medicalRecord,
              }),
            )
          }
          loading={actionLoading}
        />
      )}
    </div>
  );
};

export default DoctorAppointment;
