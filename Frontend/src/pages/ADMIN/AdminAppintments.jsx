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

const AdminAppointments = () => {
  const dispatch = useDispatch();
  const { appointments, appointmentsLoading, error } = useSelector(
    (state) => state.admin
  );

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
      updateAppointmentStatusByAdmin({ appointmentId, status: newStatus })
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
    return transitions[status] || [];
  };

  const indexOfLastAppt = currentPage * appointmentsPerPage;
  const indexOfFirstAppt = indexOfLastAppt - appointmentsPerPage;
  const currentAppointments = appointments.slice(
    indexOfFirstAppt,
    indexOfLastAppt
  );
  const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={2000} />
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 text-gray-800">
        Appointments
      </h1>

      {appointmentsLoading ? (
        <div className="flex flex-col justify-center items-center h-96">
          <Ripples size={80} speed={2} color="#0097a7" />
          <p className="mt-4 text-[#0097a7] font-medium animate-pulse">
            Loading appointments...
          </p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-20 text-gray-500 font-medium">
          No appointments found.
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentAppointments.map((appt) => (
              <div
                key={appt._id}
                className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-3 hover:shadow-xl transition"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">
                      {appt.user?.fullName}
                    </p>
                    <p className="text-sm text-gray-500">{appt.user?.email}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">
                      {appt.doctor?.fullName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {appt.doctor?.email}
                    </p>
                  </div>
                </div>

                <div className="text-gray-600 text-sm">
                  <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {new Date(appt.appointmentDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-semibold">Time:</span>{" "}
                    {appt.appointmentTime}
                  </p>
                </div>

                <div className="mt-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white ${
                      appt.status === "PENDING"
                        ? "bg-yellow-500"
                        : appt.status === "CANCELLED"
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                  >
                    {appt.status}
                  </span>
                </div>

                {getAllowedTransitions(appt.status).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {getAllowedTransitions(appt.status).map((statusOption) => (
                      <button
                        key={statusOption}
                        onClick={() =>
                          handleStatusChange(appt._id, statusOption)
                        }
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          statusOption === "COMPLETED"
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : statusOption === "CANCELLED"
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-yellow-500 text-white hover:bg-yellow-600"
                        }`}
                      >
                        {statusOption}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {appointments.length > appointmentsPerPage && (
            <div className="flex flex-wrap justify-center mt-6 gap-2">
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
        </>
      )}
    </div>
  );
};

export default AdminAppointments;
