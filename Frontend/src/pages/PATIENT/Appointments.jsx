import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyAppointments,
  cancelAppointment,
} from "../../features/appointments/appointmentThunks";
import { useNavigate } from "react-router-dom";
import {
  clearAppointmentError,
  clearAppointmentSuccess,
} from "../../features/appointments/appointmentSlice";
import { Ripples } from "ldrs/react";
import "ldrs/react/Ripples.css";
import { toast } from "react-toastify";
import Button from "../../components/atoms/PatientButton";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  MapPin,
  X,
  CheckCircle2,
  History,
  Timer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const statusConfig = {
  PENDING: {
    style: "bg-amber-50 text-amber-700 border-amber-100",
    label: "Scheduled",
    icon: <Timer size={12} className="animate-pulse" />,
  },
  CANCELLED: {
    style: "bg-slate-50 text-slate-400 border-slate-100",
    label: "Terminated",
    icon: <X size={12} />,
  },
  COMPLETED: {
    style: "bg-emerald-50 text-emerald-700 border-emerald-100",
    label: "Concluded",
    icon: <CheckCircle2 size={12} />,
  },
};

const MyAppointments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    myAppointments = [],
    loading,
    error,
    successMessage,
  } = useSelector((state) => state.appointment || {});

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 4;

  useEffect(() => {
    dispatch(getMyAppointments());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAppointmentError());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearAppointmentSuccess());
    }
  }, [error, successMessage, dispatch]);

  const handleCancel = (id) => {
    if (window.confirm("Confirm cancellation of this medical consultation?")) {
      dispatch(cancelAppointment(id));
    }
  };

  // Pagination Logic
  const indexOfLastAppt = currentPage * appointmentsPerPage;
  const indexOfFirstAppt = indexOfLastAppt - appointmentsPerPage;
  const currentAppointments = myAppointments.slice(
    indexOfFirstAppt,
    indexOfLastAppt,
  );
  const totalPages = Math.ceil(myAppointments.length / appointmentsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-white">
        <Ripples size="60" speed="2" color="#0097a7" />
        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
          Loading Records
        </p>
      </div>
    );
  }

  const stats = {
    active: myAppointments.filter((a) => a.status === "PENDING").length,
    total: myAppointments.length,
  };

  return (
    <section className="min-h-screen bg-white pt-[16vh] pb-32 selection:bg-[#0097a7] selection:text-white">
      <div className="max-w-4xl mx-auto px-6">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 border-b border-slate-100 pb-10">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
              Medical{" "}
              <span className="text-slate-400 font-medium">Timeline</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage your professional medical engagements.
            </p>
          </div>
          <div className="mt-6 md:mt-0 flex items-center gap-8">
            <StatBlock label="Active Sessions" value={stats.active} />
            <StatBlock label="Total Records" value={stats.total} />
          </div>
        </div>

        {/* --- APPOINTMENTS LIST --- */}
        {myAppointments.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-slate-50 rounded-xl">
            <Calendar className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 font-medium">
              No medical records found.
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-100 min-h-[500px]">
              {currentAppointments.map((appt) => (
                <div
                  key={appt._id}
                  className="py-8 group flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all"
                >
                  <div className="flex items-start gap-6">
                    <div className="hidden md:flex flex-col items-center justify-center w-14 h-14 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-[#0097a7]/10 group-hover:text-[#0097a7] transition-colors">
                      <span className="text-[9px] font-black uppercase">
                        {format(new Date(appt.appointmentDate), "MMM")}
                      </span>
                      <span className="text-xl font-bold leading-none">
                        {format(new Date(appt.appointmentDate), "dd")}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#0097a7] transition-colors">
                        Dr. {appt.doctor.fullName}
                      </h2>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400 text-xs font-medium">
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} /> {appt.appointmentTime}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} /> Consultation Hub
                        </span>
                        <span className="md:hidden flex items-center gap-1.5">
                          <Calendar size={14} />{" "}
                          {format(new Date(appt.appointmentDate), "dd MMM")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded border text-[10px] font-bold uppercase tracking-wider ${statusConfig[appt.status].style}`}
                    >
                      {statusConfig[appt.status].icon}
                      {statusConfig[appt.status].label}
                    </div>

                    {appt.status === "PENDING" && (
                      <button
                        onClick={() => handleCancel(appt._id)}
                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded transition-all"
                        title="Cancel Session"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* --- PAGINATION CONTROLS --- */}
            {myAppointments.length > appointmentsPerPage && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full border border-slate-100 text-slate-400 disabled:opacity-30 hover:bg-slate-50 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${
                        currentPage === i + 1
                          ? "bg-[#0097a7] text-white shadow-lg shadow-[#0097a7]/20"
                          : "text-slate-400 hover:bg-slate-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full border border-slate-100 text-slate-400 disabled:opacity-30 hover:bg-slate-50 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}

        {/* --- FOOTER ACTION --- */}
        <div className="mt-20 p-8 bg-slate-50 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#0097a7]">
              <History size={20} />
            </div>
            <p className="text-sm text-slate-600 font-medium">
              Need to schedule a follow-up session?
            </p>
          </div>
          <Button
            name="New Consultation"
            click={() => navigate("/patient/services")}
            className="!bg-[#0097a7] !text-white !py-3 !px-6 !rounded-lg !text-[10px] !font-black uppercase tracking-widest shadow-lg shadow-[#0097a7]/20"
          />
        </div>
      </div>
    </section>
  );
};

const StatBlock = ({ label, value }) => (
  <div className="text-right">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
      {label}
    </p>
    <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
  </div>
);

export default MyAppointments;
