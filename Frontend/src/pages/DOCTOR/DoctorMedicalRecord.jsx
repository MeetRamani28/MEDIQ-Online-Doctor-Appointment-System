import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDoctorMedicalRecords } from "../../features/doctor/doctorThunks";
import { clearDoctorError } from "../../features/doctor/doctorSlice";
import { FileText, User, Calendar, Clock, Stethoscope, X } from "lucide-react";
import { Ripples } from "ldrs/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "ldrs/react/Ripples.css";

const RecordCard = ({ record, onView }) => {
  const initials = record.user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-semibold">
            {initials}
          </div>

          <div>
            <p className="text-gray-900 font-semibold text-lg">
              {record.user?.fullName}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(record.appointmentDate).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {record.appointmentTime}
              </span>
            </div>

            <span className="inline-block mt-3 px-3 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700 font-medium">
              {record.status}
            </span>
          </div>
        </div>

        <button
          onClick={() => onView(record)}
          className="self-start md:self-center px-6 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition text-sm"
        >
          View Medical Record
        </button>
      </div>
    </div>
  );
};

const RecordModal = ({ record, onClose }) => {
  const mr = record.medicalRecord;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <Stethoscope className="text-emerald-500" />
            <h2 className="text-lg font-semibold">Medical Record</h2>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="p-6 space-y-4 text-sm">
          <Info label="Patient" value={record.user.fullName} />
          <Info label="Symptoms" value={mr.symptoms} />
          <Info label="Diagnosis" value={mr.diagnosis} />
          <Info label="Prescription" value={mr.prescription} />
          <Info label="Doctor Notes" value={mr.doctorNotes} />
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="bg-gray-50 rounded-xl p-4">
    <p className="text-gray-500 text-xs uppercase tracking-wide">{label}</p>
    <p className="text-gray-800 mt-1">{value}</p>
  </div>
);

const DoctorMedicalRecord = () => {
  const dispatch = useDispatch();
  const { medicalRecords, loading, error } = useSelector((s) => s.doctor);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    dispatch(getDoctorMedicalRecords());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearDoctorError());
    }
  }, [error, dispatch]);

  if (loading) {
    return (
      <div className="h-[70vh] flex justify-center items-center">
        <Ripples size={80} color="#10b981" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br p-4 sm:p-6 lg:p-8">
      <ToastContainer />

      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <FileText className="text-emerald-500" />
          Medical Records
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          View completed consultations and patient medical history
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-4">
        {medicalRecords.length ? (
          medicalRecords.map((r) => (
            <RecordCard key={r._id} record={r} onView={setSelected} />
          ))
        ) : (
          <div className="bg-white rounded-2xl p-10 text-center text-gray-500 shadow">
            No medical records found
          </div>
        )}
      </div>

      {selected && (
        <RecordModal record={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default DoctorMedicalRecord;
