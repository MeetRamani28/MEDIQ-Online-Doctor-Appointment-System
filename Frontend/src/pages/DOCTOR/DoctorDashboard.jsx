/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getDoctorDashboard } from "../../features/doctor/doctorThunks";
import { clearDoctorError } from "../../features/doctor/doctorSlice";
import { Ripples } from "ldrs/react";
import "ldrs/react/Ripples.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Users,
  AlertCircle,
  Clock,
  FileText,
  CalendarDays,
  User,
  ChevronRight,
  ShieldCheck,
  Activity,
} from "lucide-react";

const getAppointmentDateTime = (appointment) => {
  if (!appointment?.appointmentDate || !appointment?.appointmentTime)
    return null;
  const [time, modifier] = appointment.appointmentTime.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  const date = new Date(appointment.appointmentDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

// --- StatCard Component (Responsive) ---
const StatCard = ({ icon: Icon, label, value, bgClass, iconColor }) => (
  <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 w-full">
    <div className="flex items-center gap-3 md:gap-4 text-left">
      <div
        className={`p-3 rounded-xl md:rounded-2xl ${bgClass} bg-opacity-10 flex items-center justify-center shrink-0`}
      >
        <Icon size={22} strokeWidth={2.5} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
          {label}
        </p>
        <h3 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight truncate">
          {value ?? "0"}
        </h3>
      </div>
    </div>
  </div>
);

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dashboard, loading, error } = useSelector((state) => state.doctor);

  useEffect(() => {
    dispatch(getDoctorDashboard());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearDoctorError());
    }
  }, [error, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Ripples size={60} speed={2} color="#0d9488" />
      </div>
    );
  }

  const allUpcomingAppointments = [
    ...(dashboard?.todayAppointments || []),
    ...(dashboard?.upcomingAppointments || []),
  ]
    .filter(
      (appt, index, self) =>
        index === self.findIndex((a) => a._id === appt._id),
    )
    .sort((a, b) => getAppointmentDateTime(a) - getAppointmentDateTime(b) || 0)
    .slice(0, 5);

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 min-h-screen bg-[#F9FAFB] text-left">
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar />

      {/* Responsive Header */}
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Clinical Overview
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">
            Real-time synchronization with MedIQ Cloud
          </p>
        </div>
        <div className="flex items-center self-start sm:self-auto">
          <div className="px-3 py-1.5 md:px-4 md:py-2 bg-white rounded-xl border border-slate-200 text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            System Active
          </div>
        </div>
      </div>

      {/* Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          icon={Users}
          label="Total Patients"
          value={dashboard?.totalPatients}
          bgClass="bg-blue-600"
          iconColor="text-blue-600"
        />
        <StatCard
          icon={Activity}
          label="Today's Load"
          value={dashboard?.todayAppointments?.length}
          bgClass="bg-teal-600"
          iconColor="text-teal-600"
        />
        <StatCard
          icon={ShieldCheck}
          label="Cases Closed"
          value={dashboard?.completedAppointments}
          bgClass="bg-indigo-600"
          iconColor="text-indigo-600"
        />
        <StatCard
          icon={AlertCircle}
          label="Pending Reports"
          value={dashboard?.pendingReports}
          bgClass="bg-rose-600"
          iconColor="text-rose-600"
        />
      </div>

      {/* Main Content Layout: Stack on mobile, 2 columns on large screens */}
      <div className="mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Appointments Section */}
        <div className="lg:col-span-2 bg-white rounded-3xl md:rounded-4xl p-5 md:p-8 border border-slate-100 shadow-sm">
          <div className="flex flex-row justify-between items-center mb-6 gap-2">
            <h3 className="text-base md:text-lg font-bold text-slate-800 flex items-center gap-2">
              <CalendarDays className="text-teal-600 shrink-0" size={20} />
              <span className="truncate">Appointment Queue</span>
            </h3>
            <button
              onClick={() => navigate("/doctor/appointment")}
              className="text-[10px] md:text-xs font-bold text-teal-600 hover:bg-teal-50 px-3 py-1.5 md:px-4 md:py-2 rounded-xl transition-all uppercase tracking-wider border border-teal-100 shrink-0"
            >
              Expand
            </button>
          </div>

          <div className="space-y-3">
            {allUpcomingAppointments.length > 0 ? (
              allUpcomingAppointments.map((appt) => (
                <div
                  key={appt._id}
                  onClick={() => navigate("/doctor/appointment")}
                  className="flex items-center justify-between p-3 md:p-4 bg-slate-50/50 hover:bg-white rounded-2xl border border-transparent hover:border-slate-200 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3 md:gap-4 min-w-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white flex items-center justify-center border border-slate-100 text-slate-300 group-hover:text-teal-600 transition-colors shrink-0">
                      <User size={20} md:size={24} />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {appt.user?.fullName ?? "Secure Profile"}
                      </p>
                      <p className="text-[10px] md:text-[11px] font-bold text-slate-400 flex items-center gap-1.5 mt-1 uppercase">
                        <Clock size={12} className="text-teal-500" />{" "}
                        {appt.appointmentTime}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-slate-300 group-hover:text-teal-600 transition-all transform group-hover:translate-x-1 shrink-0"
                  />
                </div>
              ))
            ) : (
              <p className="text-center py-10 text-slate-400 text-xs md:text-sm font-medium italic border-2 border-dashed border-slate-50 rounded-2xl">
                Queue clear.
              </p>
            )}
          </div>
        </div>

        {/* Documentation Section */}
        <div className="bg-white rounded-3xl md:rounded-4xl p-5 md:p-8 border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6 md:mb-8">
            <FileText className="text-indigo-600 shrink-0" size={20} />
            <h3 className="text-base md:text-lg font-bold text-slate-800">
              Documentation
            </h3>
          </div>

          <div className="space-y-4 flex-1">
            {dashboard?.recentRecords?.slice(0, 4).map((record) => (
              <div
                key={record._id}
                onClick={() => navigate("/doctor/medicalrecord")}
                className="p-3 md:p-4 bg-slate-50/50 rounded-2xl border border-slate-50 hover:border-indigo-100 hover:bg-white transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="text-[11px] md:text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate pr-2">
                    {record.user?.fullName ?? "Private Record"}
                  </p>
                  <span className="text-[8px] md:text-[9px] font-black text-slate-300 uppercase tracking-widest shrink-0">
                    #{record._id?.slice(-4)}
                  </span>
                </div>
                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 italic">
                  {new Date(record.updatedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/doctor/medicalrecord")}
            className="w-full mt-6 md:mt-10 py-3 md:py-4 bg-slate-900 text-white rounded-2xl font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          >
            Audit Archive
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
