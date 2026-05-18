/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDoctorMedicalRecords } from "../../features/doctor/doctorThunks";
import { clearDoctorError } from "../../features/doctor/doctorSlice";
import {
  FileText,
  User,
  Calendar,
  Clock,
  Stethoscope,
  X,
  Search,
  ExternalLink,
  ClipboardCheck,
  Activity,
  Pill,
  History,
  ShieldCheck,
  Thermometer,
  PenTool,
  Database,
} from "lucide-react";
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
    <div className="group bg-white rounded-3xl border border-slate-100 p-6 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:border-emerald-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Patient Initial Avatar with Icon style */}
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg border border-emerald-100/50 shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
            {initials}
          </div>

          <div className="text-left">
            <h3 className="text-slate-800 font-bold text-lg tracking-tight group-hover:text-emerald-600 transition-colors">
              {record.user?.fullName}
            </h3>
            <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-emerald-500" />{" "}
                {new Date(record.appointmentDate).toLocaleDateString()}
              </span>
              <span className="w-1 h-1 bg-slate-200 rounded-full" />
              <span className="flex items-center gap-1.5">
                <Clock size={13} className="text-emerald-500" />{" "}
                {record.appointmentTime}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-block px-4 py-1.5 text-[10px] font-black uppercase tracking-tighter rounded-full bg-slate-50 text-slate-500 border border-slate-100">
            <ShieldCheck size={10} className="inline mr-1 text-emerald-500" />{" "}
            ID: {record._id.slice(-6)}
          </span>
          <button
            onClick={() => onView(record)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-500 text-white text-xs font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-slate-200 hover:shadow-emerald-200 active:scale-95"
          >
            <Database size={14} className="text-emerald-400" />
            Open Record
          </button>
        </div>
      </div>
    </div>
  );
};

const RecordModal = ({ record, onClose }) => {
  const mr = record.medicalRecord;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-white animate-in zoom-in-95 duration-300">
        {/* Modal Header with New Icons */}
        <div className="flex items-center justify-between px-10 py-8 border-b border-slate-50 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-emerald-500 border border-slate-100">
              <ClipboardCheck size={24} strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                Clinical Summary
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-emerald-500" /> Verified
                Medical Export
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-800 transition-all shadow-sm border border-transparent hover:border-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content with Contextual Icons */}
        <div className="p-10 max-h-[60vh] overflow-y-auto custom-scrollbar text-left grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <InfoIcon
              label="Full Name"
              value={record.user.fullName}
              icon={User}
              color="text-blue-500"
              bg="bg-blue-50"
            />
          </div>
          <InfoIcon
            label="Symptoms"
            value={mr.symptoms}
            icon={Thermometer}
            color="text-amber-500"
            bg="bg-amber-50"
          />
          <InfoIcon
            label="Diagnosis"
            value={mr.diagnosis}
            icon={Stethoscope}
            color="text-rose-500"
            bg="bg-rose-50"
          />
          <div className="md:col-span-2">
            <InfoIcon
              label="Prescription / Medication"
              value={mr.prescription}
              icon={Pill}
              color="text-emerald-500"
              bg="bg-emerald-50"
            />
          </div>
          <div className="md:col-span-2">
            <InfoIcon
              label="Clinical Remarks"
              value={mr.doctorNotes}
              icon={PenTool}
              color="text-indigo-500"
              bg="bg-indigo-50"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-10 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md active:scale-95"
          >
            Close Archive
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoIcon = ({ label, value, icon: Icon, color, bg }) => (
  <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:border-slate-200 transition-colors">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
      <div className={`p-1.5 rounded-lg ${bg}`}>
        <Icon size={14} className={color} />
      </div>
      {label}
    </p>
    <p className="text-slate-700 font-medium leading-relaxed pl-1">
      {value || "Not recorded"}
    </p>
  </div>
);

const DoctorMedicalRecord = () => {
  const dispatch = useDispatch();
  const { medicalRecords, loading, error } = useSelector((s) => s.doctor);
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearch] = useState("");

  useEffect(() => {
    dispatch(getDoctorMedicalRecords());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearDoctorError());
    }
  }, [error, dispatch]);

  const filteredRecords = medicalRecords.filter((r) =>
    r.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col justify-center items-center gap-4">
        <Ripples size={70} color="#10b981" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">
          Synchronizing Archives
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFCFD] p-6 md:p-10 lg:p-14">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Historical Data
              </span>
            </div>
            <h1 className="text-4xl font-light text-slate-900 tracking-tighter">
              Patient{" "}
              <span className="font-bold italic text-slate-800">Records</span>
            </h1>
          </div>

          {/* Search Bar */}
          <div className="relative group min-w-[300px]">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by patient name..."
              value={searchTerm}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 transition-all text-sm font-medium"
            />
          </div>
        </header>

        {/* Records List */}
        <div className="space-y-4">
          {filteredRecords.length ? (
            filteredRecords.map((r) => (
              <RecordCard key={r._id} record={r} onView={setSelected} />
            ))
          ) : (
            <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
              <History size={48} className="mx-auto text-slate-100 mb-4" />
              <p className="text-slate-400 text-sm font-medium italic tracking-wide">
                {searchTerm
                  ? "No records match your search query."
                  : "Archive terminal empty. No records found."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Record Detail Modal */}
      {selected && (
        <RecordModal record={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default DoctorMedicalRecord;
