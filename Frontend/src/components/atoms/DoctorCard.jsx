import getImageSrc from "./getImageSrc";
import {
  Star,
  CheckCircle2,
  ArrowUpRight,
  GraduationCap,
  Clock,
  ShieldCheck,
} from "lucide-react";

const DoctorCard = ({ doctor, navigate }) => {
  const profile = doctor.doctorProfile || {};

  return (
    <div className="relative group bg-gradient-to-b from-white to-[#f0f9fa] rounded-[2.5rem] border border-cyan-100/50 p-6 flex flex-col justify-between transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,151,167,0.15)] hover:-translate-y-2 overflow-hidden">
      {/* Background Decor Golas - Modern UI touch */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-100/30 rounded-full blur-3xl group-hover:bg-cyan-200/50 transition-colors" />

      {/* Top Section: Badge & Image */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-[#0097a7] rounded-3xl rotate-6 opacity-10 group-hover:rotate-12 transition-transform duration-500" />
          <img
            src={getImageSrc(profile.profileImage)}
            alt={doctor.fullName}
            className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-md relative z-10"
          />
          <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-xl shadow-lg border-2 border-white z-20">
            <CheckCircle2 size={12} fill="currentColor" />
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-cyan-100">
            <Star className="text-amber-400 fill-amber-400" size={12} />
            <span className="text-[11px] font-black text-slate-700">4.9</span>
          </div>
          <div className="flex items-center gap-1 bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-200">
            <ShieldCheck size={12} className="text-[#0097a7]" />
            <span className="text-[9px] font-black text-[#0097a7] uppercase tracking-widest">
              Verified
            </span>
          </div>
        </div>
      </div>

      {/* Mid Section: Professional Info */}
      <div className="space-y-4 relative z-10">
        <div>
          <h3 className="text-2xl font-black text-[#0097a7] tracking-tighter leading-tight group-hover:text-[#0097a7] transition-colors">
            Dr. {doctor.fullName}
          </h3>
          <div className="inline-block mt-2 px-3 py-1 bg-cyan-500 text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-lg shadow-sm shadow-cyan-200">
            {profile.specialization?.name || "Specialist"}
          </div>
        </div>

        {/* Technical Grid with subtle colors */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm p-3 rounded-2xl border border-cyan-50 shadow-inner">
            <GraduationCap size={16} className="text-cyan-600" />
            <span className="text-[11px] font-black text-slate-600 uppercase">
              {profile.degree || "MBBS"}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm p-3 rounded-2xl border border-cyan-50 shadow-inner">
            <Clock size={16} className="text-cyan-600" />
            <span className="text-[11px] font-black text-slate-600 uppercase">
              {profile.experience || 0}+ Yrs
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Action & Pricing */}
      <div className="mt-8 pt-6 border-t border-cyan-100/50 flex items-center justify-between relative z-10">
        <div>
          <span className="block text-[10px] font-black text-cyan-600 uppercase tracking-[0.2em] mb-0.5">
            Consultation Fee
          </span>
          <p className="text-3xl font-black text-[#0097a7] tracking-tighter flex items-center">
            <span className="text-lg mr-0.5 text-[#0097a7]">₹</span>
            {profile.consultationFee || "0"}
          </p>
        </div>

        {/* High-End Interactive Button */}
        <button
          onClick={() => navigate(`/patient/doctors/${doctor._id}`)}
          className="group/btn relative h-14 w-14 bg-[#0097a7] text-white rounded-2xl flex items-center justify-center transition-all duration-300 hover:bg-[#0097a7] hover:shadow-[0_15px_30px_rgba(0,151,167,0.4)] active:scale-95 overflow-hidden"
        >
          <ArrowUpRight
            size={24}
            className="relative z-10 transition-transform duration-500 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity" />
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
