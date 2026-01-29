/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserRound, Stethoscope, CalendarCheck, Clock } from "lucide-react";
import { getAdminDashboard } from "../../features/admin/adminThunks";
import { Ripples } from "ldrs/react";
import "ldrs/react/Ripples.css";

const AdminDashboard = () => {
  const dispatch = useDispatch();

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
      bgColor: "bg-blue-100",
    },
    {
      label: "Total Doctors",
      value: dashboard?.totalDoctors ?? 0,
      icon: Stethoscope,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      label: "Total Appointments",
      value: dashboard?.totalAppointments ?? 0,
      icon: CalendarCheck,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      label: "Pending Appointments",
      value: dashboard?.pendingAppointments ?? 0,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
  ];

  const today = new Date().toDateString();
  const latestAppointments =
    dashboard?.latestAppointments?.filter(
      (appt) =>
        new Date(appt.appointmentDate).toDateString() === today &&
        appt.status?.toLowerCase() === "pending"
    ) || [];

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">
          Welcome back, Admin. Here is what's happening today.
        </p>
      </header>

      {loading && (
        <div className="flex flex-col justify-center items-center h-96">
          <Ripples size={80} speed={2} color="#0097a7" />
          <p className="mt-4 text-[#0097a7] font-medium animate-pulse">
            Syncing dashboard data...
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

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map(({ label, value, icon: Icon, color, bgColor }) => (
              <div
                key={label}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      {label}
                    </p>
                    <h2 className="text-3xl font-bold text-gray-900">
                      {value}
                    </h2>
                  </div>
                  <div className={`p-4 rounded-2xl ${bgColor} ${color}`}>
                    <Icon size={28} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-50">
              <h2 className="text-xl font-bold text-gray-800">
                Today's Pending Appointments
              </h2>
            </div>

            <div className="p-6">
              {latestAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarCheck className="text-gray-300" size={32} />
                  </div>
                  <p className="text-gray-500">
                    No pending appointments scheduled for today.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-separate border-spacing-y-3">
                    <thead>
                      <tr className="text-left text-gray-400 uppercase text-[11px] tracking-wider px-3">
                        <th className="pb-2 font-semibold">Patient Name</th>
                        <th className="pb-2 font-semibold">Assigned Doctor</th>
                        <th className="pb-2 font-semibold">Appt Date</th>
                        <th className="pb-2 font-semibold text-right pr-4">
                          Current Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {latestAppointments.map((appt) => (
                        <tr
                          key={appt._id}
                          className="group bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors rounded-xl"
                        >
                          <td className="py-4 px-4 font-semibold text-gray-800 rounded-l-2xl">
                            {appt.user?.fullName || "Unknown Patient"}
                          </td>
                          <td className="py-4 px-4 text-gray-600">
                            Dr. {appt.doctor?.fullName || "Unassigned"}
                          </td>
                          <td className="py-4 px-4 text-gray-500 italic">
                            {appt.appointmentDate
                              ? new Date(
                                  appt.appointmentDate
                                ).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                })
                              : "N/A"}
                          </td>
                          <td className="py-4 px-4 text-right rounded-r-2xl pr-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700 uppercase tracking-tighter">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
                              {appt.status || "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
