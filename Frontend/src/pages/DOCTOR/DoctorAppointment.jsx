import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDoctorDashboard } from "../../features/doctor/doctorThunks";
import { completeAppointment } from "../../features/appointments/appointmentThunks";
import {
  clearAppointmentError,
  clearAppointmentSuccess,
} from "../../features/appointments/appointmentSlice";
import { clearDoctorError } from "../../features/doctor/doctorSlice";

import { CalendarClock, User, X, Stethoscope } from "lucide-react";

import { Ripples } from "ldrs/react";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "ldrs/react/Ripples.css";

const AppointmentCard = ({ appointment, onCompleteClick }) => {
  const date = new Date(appointment.appointmentDate).toLocaleDateString();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="font-semibold text-gray-800 flex items-center gap-2">
            <User size={16} className="text-emerald-500" />
            {appointment.user?.fullName || "Unknown Patient"}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            {date} • {appointment.appointmentTime}
          </p>

          <span className="inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
            {appointment.status}
          </span>
        </div>

        <button
          onClick={() => onCompleteClick(appointment)}
          className="px-6 py-2 rounded-xl bg-emerald-500 text-white text-sm hover:bg-emerald-600 transition"
        >
          Complete
        </button>
      </div>
    </div>
  );
};

const CompleteModal = ({ onClose, onSubmit, loading }) => {
  const [form, setForm] = useState({
    symptoms: "",
    diagnosis: "",
    prescription: "",
    doctorNotes: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg max-h-[85vh] rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <Stethoscope className="text-emerald-500" />
            <h2 className="text-lg font-semibold text-gray-800">
              Complete Appointment
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {[
            { name: "symptoms", label: "Symptoms" },
            { name: "diagnosis", label: "Diagnosis" },
            { name: "prescription", label: "Prescription" },
            { name: "doctorNotes", label: "Doctor Notes" },
          ].map(({ name, label }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <textarea
                name={name}
                value={form[name]}
                onChange={handleChange}
                required
                rows={3}
                className="w-full resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>
          ))}

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Submit & Complete"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DoctorAppointment = () => {
  const dispatch = useDispatch();

  const { dashboard, loading, error } = useSelector((s) => s.doctor);
  const {
    loading: actionLoading,
    successMessage,
    error: apptError,
  } = useSelector((s) => s.appointment);

  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    dispatch(getDoctorDashboard());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearDoctorError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearAppointmentSuccess());
      setSelectedAppointment(null);
      dispatch(getDoctorDashboard());
    }

    if (apptError) {
      toast.error(apptError);
      dispatch(clearAppointmentError());
    }
  }, [successMessage, apptError, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Ripples size={80} speed={2} color="#10b981" />
      </div>
    );
  }

  const appointments = dashboard?.upcomingAppointments || [];

  const handleCompleteSubmit = (medicalRecord) => {
    dispatch(
      completeAppointment({
        appointmentId: selectedAppointment._id,
        medicalRecord,
      })
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br p-4 sm:p-6 lg:p-8">
      <ToastContainer position="top-right" />

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <CalendarClock className="text-emerald-500" />
          Doctor Appointments
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Review and complete patient consultations
        </p>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-3xl p-6 shadow-sm border">
        {appointments.length ? (
          <div className="space-y-4">
            {appointments.map((appt) => (
              <AppointmentCard
                key={appt._id}
                appointment={appt}
                onCompleteClick={setSelectedAppointment}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-10">
            No upcoming appointments
          </p>
        )}
      </div>

      {selectedAppointment && (
        <CompleteModal
          onClose={() => setSelectedAppointment(null)}
          onSubmit={handleCompleteSubmit}
          loading={actionLoading}
        />
      )}
    </div>
  );
};

export default DoctorAppointment;
