import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Ripples } from "ldrs/react";
import { SearchX, Users2 } from "lucide-react"; // Navu element: Empty state icons
import "ldrs/react/Ripples.css";
import DoctorCard from "./DoctorCard";

const Doctors = ({ specialization }) => {
  const navigate = useNavigate();
  const { doctors, loading } = useSelector((state) => state.specialization);

  const [showNoDoctors, setShowNoDoctors] = useState(false);

  useEffect(() => {
    let timer;

    if (!loading && (!doctors || doctors.length === 0)) {
      timer = setTimeout(() => setShowNoDoctors(true), 1500); // 5 sec bov vadhare che, 1.5 sec ideal che
    } else {
      setShowNoDoctors(false);
    }

    return () => clearTimeout(timer);
  }, [loading, doctors]);

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[50vh] w-full border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/30 mt-8">
        <Ripples size="60" speed="2" color="#0097a7" />
        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          Syncing with specialists...
        </p>
      </div>
    );
  }

  // --- EMPTY STATE (NO DOCTORS FOUND) ---
  if (showNoDoctors) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in duration-700">
        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 border border-slate-100">
          <SearchX className="text-slate-300" size={32} />
        </div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">
          No Experts Available.
        </h3>
        <p className="text-slate-500 max-w-xs text-sm font-medium">
          Currently, we don't have doctors listed under{" "}
          <span className="text-[#0097a7] font-bold">"{specialization}"</span>.
          Please try another category.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-8 text-[#0097a7] font-black text-xs uppercase tracking-widest border-b-2 border-[#0097a7]/20 hover:border-[#0097a7] transition-all pb-1"
        >
          Refresh Directory
        </button>
      </div>
    );
  }

  // --- DATA GRID ---
  if (doctors && doctors.length > 0) {
    return (
      <div className="w-full mt-8 animate-in slide-in-from-bottom-4 duration-700">
        {/* Header info for the list */}
        <div className="flex items-center gap-4 mb-10 px-2">
          <div className="p-2 bg-[#e0f7f9] rounded-lg">
            <Users2 size={18} className="text-[#0097a7]" />
          </div>
          <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">
            Showing {doctors.length} Verified Professionals
          </p>
          <div className="h-px flex-grow bg-slate-50"></div>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} navigate={navigate} />
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default Doctors;
