import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyAppointments,
  cancelAppointment,
} from "../../features/appointments/appointmentThunks";
import {
  clearAppointmentError,
  clearAppointmentSuccess,
} from "../../features/appointments/appointmentSlice";
import { Ripples } from "ldrs/react";
import "ldrs/react/Ripples.css";
import { toast } from "react-toastify";
import Button from "../../components/atoms/Button";
import { format } from "date-fns";

const statusStyles = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CANCELLED: "bg-red-100 text-red-600",
  COMPLETED: "bg-green-100 text-green-600",
};

const MyAppointments = () => {
  const dispatch = useDispatch();
  const {
    myAppointments = [],
    loading,
    error,
    successMessage,
  } = useSelector((state) => state.appointment || {});

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
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      dispatch(cancelAppointment(id));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F7FBFC]">
        <Ripples size="64" speed="2" color="#0097a7" />
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#F7FBFC] pt-[12vh] px-4 sm:px-8 lg:px-16 pb-16">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-gray-800">
            My <span className="text-[#0097a7]">Appointments</span>
          </h1>
          <p className="text-gray-500 mt-2 sm:mt-0">
            Manage and track your medical visits
          </p>
        </div>

        {myAppointments.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm">
            <p className="text-gray-500 text-lg">
              You don’t have any appointments yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {myAppointments.map((appt) => (
              <div
                key={appt._id}
                className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Left Info */}
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Dr. {appt.doctor.fullName}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      {format(new Date(appt.appointmentDate), "dd MMM yyyy")} •{" "}
                      {appt.appointmentTime}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        statusStyles[appt.status]
                      }`}
                    >
                      {appt.status}
                    </span>

                    {appt.status === "PENDING" && (
                      <Button
                        onClick={() => handleCancel(appt._id)}
                        variant="outline"
                        className="rounded-full px-5 py-2 border-red-400 text-red-500 hover:bg-red-50"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyAppointments;
