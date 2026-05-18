/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAdminError } from "../../features/admin/adminSlice";
import {
  fetchAllAppointments,
  updateAppointmentStatusByAdmin,
} from "../../features/admin/adminThunks";
import { Ripples } from "ldrs/react";
import "ldrs/react/Ripples.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  ArrowRight,
  Check,
  X,
  RefreshCw,
} from "lucide-react";

const AdminAppointments = () => {
  const dispatch = useDispatch();
  const {
    appointments = [],
    appointmentsLoading,
    error,
  } = useSelector((state) => state.admin);

  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 6;

  useEffect(() => {
    dispatch(fetchAllAppointments());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAdminError());
    }
  }, [error, dispatch]);

  const handleStatusChange = (appointmentId, newStatus) => {
    dispatch(
      updateAppointmentStatusByAdmin({ appointmentId, status: newStatus }),
    )
      .unwrap()
      .then(() => toast.success(`Appointment status updated to ${newStatus}`))
      .catch((err) => toast.error(err));
  };

  const getAllowedTransitions = (status) => {
    const transitions = {
      PENDING: ["CANCELLED", "COMPLETED"],
      CANCELLED: ["PENDING", "COMPLETED"],
      COMPLETED: [],
    };
    return transitions[status?.toUpperCase()] || [];
  };

  // Pagination Logic
  const indexOfLastAppt = currentPage * appointmentsPerPage;
  const indexOfFirstAppt = indexOfLastAppt - appointmentsPerPage;
  const currentAppointments = appointments.slice(
    indexOfFirstAppt,
    indexOfLastAppt,
  );
  const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

  const getStatusStyles = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-100/80 dot-amber-500";
      case "CANCELLED":
        return "bg-rose-50 text-rose-700 border-rose-100/80 dot-rose-500";
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-700 border-emerald-100/80 dot-emerald-500";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100 dot-slate-500";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 selection:bg-cyan-50">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        shadow-sm
      />

      {/* Main Panel Command Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Operational Appointment Stream
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Audit patient-to-clinician tracking routes, state transitions, and
            real-time intake files.
          </p>
        </div>
        {!appointmentsLoading && appointments.length > 0 && (
          <span className="inline-flex self-start sm:self-auto items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-cyan-600 to-teal-500 text-white rounded-xl shadow-xs">
            {appointments.length} Total Logs Hosted
          </span>
        )}
      </header>

      {/* Loading Canvas Matrix */}
      {appointmentsLoading ? (
        <div className="flex flex-col justify-center items-center h-[45vh] bg-white border border-slate-100 rounded-3xl shadow-xs">
          <Ripples size={55} speed={2} color="#0891b2" />
          <p className="mt-5 text-slate-500 text-xs font-semibold tracking-widest uppercase animate-pulse">
            Sourcing Encounter Registries...
          </p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-24 bg-white border border-slate-100 rounded-3xl shadow-xs">
          <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-inner">
            <Calendar className="text-slate-300" size={26} />
          </div>
          <h3 className="text-slate-800 font-bold text-sm">
            Registry Stream Empty
          </h3>
          <p className="text-slate-400 text-xs max-w-xs mx-auto mt-1 leading-relaxed">
            No active appointment schemas or matching allocation instances are
            linked to the system database.
          </p>
        </div>
      ) : (
        <>
          {/* Main Asymmetric Grid Core */}
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {currentAppointments.map((appt) => (
              <div
                key={appt._id}
                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-slate-200/80 group"
              >
                <div className="space-y-4">
                  {/* Top Block: Profile Routing Pipeline */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-50 pb-3">
                    {/* Patient Cluster */}
                    <div className="flex items-center gap-2.5 max-w-[45%]">
                      <div className="w-8 h-8 rounded-lg bg-cyan-50 border border-cyan-100/60 text-cyan-700 flex items-center justify-center shrink-0">
                        <User size={14} strokeWidth={2.5} />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {appt.user?.fullName || "Anonymous Account"}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {appt.user?.email || "No email link"}
                        </p>
                      </div>
                    </div>

                    {/* Routing Intersect Node */}
                    <ArrowRight
                      size={14}
                      className="text-slate-300 group-hover:text-cyan-500 transition-colors"
                    />

                    {/* Practitioner Cluster */}
                    <div className="flex items-center gap-2.5 max-w-[45%] text-right justify-end ml-auto">
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          Dr. {appt.doctor?.fullName || "Unallocated"}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {appt.doctor?.email || "No provider link"}
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100/60 text-emerald-700 flex items-center justify-center shrink-0">
                        <Stethoscope size={14} strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>

                  {/* Middle Block: Timestamp Metrics Metadata */}
                  <div className="grid grid-cols-2 gap-3 bg-slate-50/60 border border-slate-50/40 rounded-xl p-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <Calendar size={14} className="text-slate-400 shrink-0" />
                      <span>
                        {appt.appointmentDate
                          ? new Date(appt.appointmentDate).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )
                          : "Flexible Allocation"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 font-medium border-l border-slate-200/60 pl-3">
                      <Clock size={14} className="text-slate-400 shrink-0" />
                      <span>{appt.appointmentTime || "Not windowed"}</span>
                    </div>
                  </div>

                  {/* Status Indicator Pill Display */}
                  <div className="pt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border ${getStatusStyles(
                        appt.status,
                      )}`}
                    >
                      <span className="w-1 h-1 rounded-full mr-2 bg-current animate-pulse" />
                      {appt.status || "UNKNOWN_STATE"}
                    </span>
                  </div>
                </div>

                {/* Bottom Action Block: State Machine Transitions Selector */}
                {getAllowedTransitions(appt.status).length > 0 ? (
                  <div className="flex items-center gap-1.5 mt-5 pt-3 border-t border-slate-50">
                    {getAllowedTransitions(appt.status).map((statusOption) => {
                      const isCompleted = statusOption === "COMPLETED";
                      const isCancelled = statusOption === "CANCELLED";

                      return (
                        <button
                          key={statusOption}
                          onClick={() =>
                            handleStatusChange(appt._id, statusOption)
                          }
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase transition-all duration-150 border active:scale-95 ${
                            isCompleted
                              ? "bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border-emerald-100 hover:border-emerald-600 shadow-2xs"
                              : isCancelled
                                ? "bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border-rose-100 hover:border-rose-600 shadow-2xs"
                                : "bg-amber-50 hover:bg-amber-600 text-amber-700 hover:text-white border-amber-100 hover:border-amber-600 shadow-2xs"
                          }`}
                        >
                          {isCompleted && <Check size={12} strokeWidth={2.5} />}
                          {isCancelled && <X size={12} strokeWidth={2.5} />}
                          {!isCompleted && !isCancelled && (
                            <RefreshCw size={12} strokeWidth={2.5} />
                          )}
                          {statusOption}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-5 pt-3 border-t border-slate-50/40 text-left">
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 uppercase tracking-widest">
                      Immutable Historical Log
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination Command Cluster Layout */}
          {appointments.length > appointmentsPerPage && (
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
        </>
      )}
    </div>
  );
};

export default AdminAppointments;
