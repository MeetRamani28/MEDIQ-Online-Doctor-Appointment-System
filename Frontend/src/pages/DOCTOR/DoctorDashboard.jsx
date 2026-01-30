/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDoctorDashboard } from "../../features/doctor/doctorThunks";
import { clearDoctorError } from "../../features/doctor/doctorSlice";
import { Ripples } from "ldrs/react";
import "ldrs/react/Ripples.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Users,
  CalendarCheck,
  ClipboardCheck,
  FileWarning,
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

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <h3 className="text-2xl font-semibold text-gray-800 mt-1">
          {value ?? "--"}
        </h3>
      </div>
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
      >
        <Icon className="text-white" size={22} />
      </div>
    </div>
  </div>
);

const AppointmentCard = ({ appointment }) => (
  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition mb-3">
    <p className="font-medium text-gray-800">
      {appointment.user?.fullName ?? "Unknown Patient"}
    </p>
    <p className="text-sm text-gray-500">
      {appointment.appointmentDate
        ? new Date(appointment.appointmentDate).toLocaleDateString()
        : "--"}{" "}
      at <span className="font-medium">{appointment.appointmentTime}</span>
    </p>
    <p className="text-sm font-medium text-gray-600">
      Status: {appointment.status ?? "PENDING"}
    </p>
  </div>
);

const RecordCard = ({ record }) => (
  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition mb-3">
    <p className="font-medium text-gray-800">
      {record.user?.fullName ?? "Unknown Patient"}
    </p>
    <p className="text-sm text-gray-500">
      Updated on:{" "}
      {record.updatedAt
        ? new Date(record.updatedAt).toLocaleDateString()
        : "--"}
    </p>
  </div>
);

const DoctorDashboard = () => {
  const dispatch = useDispatch();
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
        <Ripples size={80} speed={2} color="#0097a7" />
      </div>
    );
  }

  const allUpcomingAppointments = [
    ...(dashboard?.todayAppointments || []),
    ...(dashboard?.upcomingAppointments || []),
  ]
    .filter(
      (appt, index, self) => index === self.findIndex((a) => a._id === appt._id)
    )
    .sort((a, b) => {
      const dateA = getAppointmentDateTime(a);
      const dateB = getAppointmentDateTime(b);
      if (!dateA || !dateB) return 0;
      return dateA - dateB;
    });

  const recentRecords = dashboard?.recentRecords || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Doctor Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your daily medical activity
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={Users}
          label="Total Patients"
          value={dashboard?.totalPatients ?? 0}
          color="bg-blue-500"
        />
        <StatCard
          icon={CalendarCheck}
          label="Today's Appointments"
          value={dashboard?.todayAppointments?.length ?? 0}
          color="bg-green-500"
        />
        <StatCard
          icon={ClipboardCheck}
          label="Completed Appointments"
          value={dashboard?.completedAppointments ?? 0}
          color="bg-emerald-500"
        />
        <StatCard
          icon={FileWarning}
          label="Pending Reports"
          value={dashboard?.pendingReports ?? 0}
          color="bg-orange-500"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Upcoming Appointments
          </h3>
          {allUpcomingAppointments.length > 0 ? (
            allUpcomingAppointments.map((appt) => (
              <AppointmentCard key={appt._id} appointment={appt} />
            ))
          ) : (
            <p className="text-sm text-gray-500">No upcoming appointments.</p>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Medical Records
          </h3>
          {recentRecords.length > 0 ? (
            recentRecords.map((record) => (
              <RecordCard key={record._id} record={record} />
            ))
          ) : (
            <p className="text-sm text-gray-500">
              No recent records available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
