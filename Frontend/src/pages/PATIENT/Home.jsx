import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Stethoscope,
  Zap,
  ArrowRight,
  ShieldCheck,
  Users,
  Clock,
  Search,
  CheckCircle2,
  HeartPulse,
  Activity,
} from "lucide-react";
import Button from "../../components/atoms/PatientButton";
import bg from "../../../public/images/home.jpeg";

const Home = () => {
  const navigate = useNavigate();

  return (
    <main className="bg-white py-6 selection:bg-[#0097a7] selection:text-white">
      {/* --- SECTION 1: REFINED HERO --- */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden border-b border-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 text-[#0097a7] text-xs font-bold uppercase tracking-[0.1em]">
              <Activity size={14} className="animate-pulse" />
              Next-Gen Medical Experience
            </div>

            <h1 className="text-5xl md:text-7xl xl:text-8xl font-black text-slate-900 leading-[0.95] tracking-tighter">
              Healthcare <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0097a7] to-cyan-500 italic">
                Redefined.
              </span>
            </h1>

            <p className="text-slate-500 text-lg md:text-xl max-w-xl leading-relaxed mx-auto lg:mx-0">
              Skip the long queues and travel time. Connect with India's
              top-tier medical specialists through our secure, high-fidelity
              platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
              <Button
                name="Book Appointment"
                className="!bg-[#0097a7] !py-5 !px-12 !text-lg !font-bold !rounded-[1.25rem] hover:shadow-2xl hover:shadow-[#0097a7]/30 transition-all transform hover:-translate-y-1"
                click={() => navigate("/patient/services")}
              />
            </div>

            {/* Micro Stats */}
            <div className="flex items-center gap-10 justify-center lg:justify-start pt-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter"
                  >
                    DR
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-[#0097a7] flex items-center justify-center text-[10px] font-bold text-white tracking-tighter">
                  +500
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200 hidden sm:block"></div>
              <p className="text-slate-500 text-sm font-medium leading-tight">
                Trusted by <br />
                <span className="text-slate-900 font-bold">
                  10,000+ Families
                </span>
              </p>
            </div>
          </div>

          {/* Clean Image Composition */}
          <div className="relative group">
            <div className="absolute inset-0 bg-[#0097a7] rounded-[3.5rem] rotate-2 opacity-5 scale-105 group-hover:rotate-1 transition-transform duration-500" />
            <div className="relative overflow-hidden rounded-[3.5rem] border-8 border-slate-50 shadow-2xl">
              <img
                src={bg}
                alt="Doctor Consultation"
                className="w-full h-[500px] xl:h-[600px] object-cover hover:scale-105 transition-transform duration-700"
              />
              {/* Floating Glass Overlay */}
              <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/80 backdrop-blur-md rounded-3xl border border-white/20 shadow-lg flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0097a7] rounded-2xl flex items-center justify-center text-white shrink-0">
                  <HeartPulse />
                </div>
                <div>
                  <p className="text-slate-900 font-bold text-sm leading-none">
                    Instant Vitals Sync
                  </p>
                  <p className="text-slate-500 text-xs mt-1 font-medium italic">
                    Connected to your wearables
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: THE PROCESS (BENTO STYLE) --- */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
              A Healthier You, in 3 Steps.
            </h2>
            <p className="text-slate-500 font-medium">
              We've automated the complex medical logistics for your comfort.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              num="01"
              icon={<Search className="text-[#0097a7]" size={28} />}
              title="Locate Expert"
              desc="Browse verified medical professionals filtered by your specific needs and past reviews."
            />
            <StepCard
              num="02"
              icon={<Clock className="text-[#0097a7]" size={28} />}
              title="Schedule Slot"
              desc="Select a time that works for you. No more endless waits in sterile clinic reception areas."
            />
            <StepCard
              num="03"
              icon={<CheckCircle2 className="text-[#0097a7]" size={28} />}
              title="Expert Consultation"
              desc="High-definition video call with digital prescriptions delivered immediately post-session."
            />
          </div>
        </div>
      </section>

      {/* --- SECTION 3: CORE VALUE (HIGH CONTRAST) --- */}
      <section className="py-32 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
              Clinical Precision <br /> Meets{" "}
              <span className="text-[#0097a7]">Digital Speed.</span>
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed max-w-2xl">
              We leverage AES-256 encryption to ensure your medical history
              stays between you and your doctor. No compromise, ever.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ValueFeature
              icon={<ShieldCheck className="text-[#0097a7]" />}
              title="HIPAA Compliant"
              desc="Military-grade security."
            />
            <ValueFeature
              icon={<Users className="text-[#0097a7]" />}
              title="Verified MDs"
              desc="Board-certified specialists."
            />
            <ValueFeature
              icon={<Zap className="text-[#0097a7]" />}
              title="AI Prescriptions"
              desc="Error-free digital notes."
            />
            <ValueFeature
              icon={<HeartPulse className="text-[#0097a7]" />}
              title="24/7 Access"
              desc="Care that never sleeps."
            />
          </div>
        </div>

        {/* Feature Visual Grid */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <div className="p-8 bg-slate-900 rounded-[2.5rem] flex flex-col justify-end min-h-[220px] shadow-xl">
            <p className="text-5xl font-black text-white leading-none tracking-tighter italic opacity-30 mb-auto">
              NABL
            </p>
            <div>
              <p className="text-2xl font-bold text-white">Reports</p>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
                Verified Labs
              </p>
            </div>
          </div>
          <div className="p-8 bg-[#0097a7] rounded-[2.5rem] flex flex-col justify-end min-h-[220px] shadow-xl">
            <p className="text-white font-black text-4xl mb-auto opacity-40 italic underline decoration-white/20 underline-offset-8">
              24H
            </p>
            <div>
              <p className="text-2xl font-bold text-white">Support</p>
              <p className="text-cyan-100 font-bold text-xs uppercase tracking-widest mt-1">
                Live Human Chat
              </p>
            </div>
          </div>
          <div className="col-span-2 p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:border-[#0097a7]/30 transition-all flex flex-col gap-4 group">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="text-amber-400 text-lg">
                  ★
                </span>
              ))}
            </div>
            <p className="text-slate-800 font-bold text-lg leading-snug group-hover:text-slate-950">
              "The most intuitive healthcare app. The video quality is flawless
              and getting reports in 2 hours is a game changer."
            </p>
            <div className="flex items-center gap-3 mt-2">
              <div className="w-10 h-10 rounded-full bg-[#0097a7]/10 flex items-center justify-center text-[#0097a7] font-black text-xs uppercase tracking-widest">
                AK
              </div>
              <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em]">
                Patient Feedback
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

// Reusable Components
const StepCard = ({ num, icon, title, desc }) => (
  <div className="group relative p-12 bg-white border border-slate-200/60 rounded-[3rem] transition-all hover:shadow-[0_20px_50px_rgba(0,151,167,0.1)] hover:border-[#0097a7]/40 hover:-translate-y-1">
    <div className="text-slate-100 font-black text-8xl absolute top-8 right-10 group-hover:text-[#0097a7]/5 transition-colors tracking-tighter leading-none pointer-events-none">
      {num}
    </div>
    <div className="relative z-10">
      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-md border border-slate-50 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
        {title}
      </h3>
      <p className="text-slate-500 text-sm leading-relaxed font-medium">
        {desc}
      </p>
    </div>
  </div>
);

const ValueFeature = ({ icon, title, desc }) => (
  <div className="flex gap-4 p-4 border border-transparent hover:border-slate-100 rounded-2xl transition-all">
    <div className="mt-1">{icon}</div>
    <div>
      <p className="text-slate-900 font-bold text-base leading-none">{title}</p>
      <p className="text-slate-500 text-xs mt-1 font-medium">{desc}</p>
    </div>
  </div>
);

export default Home;
