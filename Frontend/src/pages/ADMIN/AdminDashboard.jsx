/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  UserRound,
  Stethoscope,
  CalendarCheck,
  Clock,
  ExternalLink,
  SlidersHorizontal,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAdminDashboard } from "../../features/admin/adminThunks";
import { Ripples } from "ldrs/react";
import "ldrs/react/Ripples.css";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dashboard, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAdminDashboard());
  }, [dispatch]);

  const stats = [
    {
      label: "Total Patients",
      value: dashboard?.totalUsers ?? 0,
      icon: UserRound,
      color: "text-blue-600",
      bgColor: "bg-blue-50/70",
      borderColor: "hover:border-blue-200",
    },
    {
      label: "Total Doctors",
      value: dashboard?.totalDoctors ?? 0,
      icon: Stethoscope,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50/70",
      borderColor: "hover:border-emerald-200",
    },
    {
      label: "Total Appointments",
      value: dashboard?.totalAppointments ?? 0,
      icon: CalendarCheck,
      color: "text-violet-600",
      bgColor: "bg-violet-50/70",
      borderColor: "hover:border-violet-200",
    },
    {
      label: "Pending Lineup",
      value: dashboard?.pendingAppointments ?? 0,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50/70",
      borderColor: "hover:border-amber-200",
    },
  ];

  const todayISO = new Date().toISOString().split("T")[0];

  const latestAppointments =
    dashboard?.latestAppointments?.filter((appt) => {
      if (!appt.appointmentDate) return false;
      const apptISO = new Date(appt.appointmentDate).toISOString().split("T")[0];
      return apptISO === todayISO && appt.status?.toLowerCase() === "pending";
    }) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10 selection:bg-slate-100">
      {/* Header Panel */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Metrics stream updated real-time for today,{" "}
            <span className="font-semibold text-slate-700">
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </span>
          </p>
        </div>
      </header>

      {/* Loading Canvas State */}
      {loading && (
        <div className="flex flex-col justify-center items-center h-[45vh] bg-white rounded-3xl border border-slate-100 shadow-sm">
          <Ripples size={55} speed={2} color="#0f172a" />
          <p className="mt-5 text-slate-500 text-xs font-medium tracking-widest uppercase animate-pulse">
            Sourcing dynamic clinical matrix...
          </p>
        </div>
      )}

      {/* Exceptional Error Alert Banner */}
      {error && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl shadow-sm animate-fade-in">
          <div className="flex gap-3 items-center">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <p className="text-rose-900 font-medium text-sm">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Main Structural Metrics Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(({ label, value, icon: Icon, color, bgColor, borderColor }) => (
              <div
                key={label}
                className={`bg-white rounded-2xl p-6 border border-slate-100 shadow-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md ${borderColor}`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {label}
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                      {value.toLocaleString()}
                    </h2>
                  </div>
                  <div className={`p-3 rounded-xl ${bgColor} ${color} shadow-inner`}>
                    <Icon size={20} strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Premium Priority Queue Layout */}
          <section className="space-y-4">
            {/* Context Actions Sub-Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cyan-700 text-white px-6 py-4 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </div>
                <div>
                  <h2 className="text-sm font-bold tracking-wide">Live Intake Priority Stream</h2>
                  <p className="text-[11px] text-slate-400">Real-time scheduling routing queue</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700/60">
                  {latestAppointments.length} Active Intakes
                </span>
              </div>
            </div>

            {/* Main Interactive Queue Container */}
            <div className="space-y-3">
              {latestAppointments.length === 0 ? (
                <div className="text-center py-20 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-inner">
                    <CalendarCheck className="text-slate-400" size={26} />
                  </div>
                  <h3 className="text-slate-900 font-bold text-sm">Priority Stream Clear</h3>
                  <p className="text-slate-400 text-xs max-w-xs mx-auto mt-1 leading-relaxed">
                    All operations have processed smoothly. No records currently match today's tracking stamp.
                  </p>
                </div>
              ) : (
                latestAppointments.map((appt) => (
                  <div
                    key={appt._id}
                    className="group bg-white hover:bg-slate-50/50 border border-slate-100 hover:border-slate-200 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:shadow-sm"
                  >
                    {/* Left Asymmetric Section: Demographic Detail */}
                    <div className="flex items-center gap-4 min-w-[280px]">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center group-hover:bg-white shadow-sm transition-colors uppercase">
                        {appt.user?.fullName ? appt.user.fullName.substring(0, 2) : "ID"}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {appt.user?.fullName || "Anonymous Account"}
                        </h4>
                        <span className="text-[11px] text-slate-400 font-medium tracking-tight block mt-0.5">
                          ID Ref: #{appt._id?.substring(appt._id.length - 8).toUpperCase() || "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Middle-Left Grid Node: Clinical Assignment */}
                    <div className="flex items-center gap-2.5 min-w-[220px]">
                      <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-emerald-600 group-hover:bg-emerald-50/60 transition-colors">
                        <Stethoscope size={16} />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          Assigned Clinician
                        </span>
                        <p className="text-xs font-semibold text-slate-700 mt-0.5">
                          {appt.doctor?.fullName ? `Dr. ${appt.doctor.fullName}` : "Awaiting Routing Match"}
                        </p>
                      </div>
                    </div>

                    {/* Middle-Right Grid Node: Scheduled Stamp */}
                    <div className="flex items-center gap-2.5 min-w-[150px]">
                      <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-purple-600 group-hover:bg-purple-50/60 transition-colors">
                        <Clock size={16} />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          Schedule Window
                        </span>
                        <p className="text-xs font-medium text-slate-600 mt-0.5">
                          {appt.appointmentDate
                            ? new Date(appt.appointmentDate).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Flexible Allocation"}
                        </p>
                      </div>
                    </div>

                    {/* Right-most Action Layout Cluster */}
                    <div className="flex items-center justify-between md:justify-end gap-6 border-t border-slate-50 pt-3 md:pt-0 md:border-none">
                      <div className="md:text-right">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100/70 uppercase tracking-widest">
                          <span className="w-1 h-1 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
                          {appt.status || "Pending"}
                        </span>
                      </div>
                      
                      {/* Interactive Utility Action Button */}
                      <button 
                        type="button"
                        onClick={() => navigate("/admin/appointments")}
                        className="p-2 text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl transition-all shadow-sm"
                        title="Review Record Profile"
                      >
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;