import React, { useState } from "react";
import {
  ShieldCheck,
  ArrowRight,
  Clock,
  Target,
  Award,
  Users,
  Activity,
  Globe,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import Button from "../../components/atoms/PatientButton";

const About = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <section className="w-full min-h-screen pt-[16vh] pb-32 bg-white font-sans selection:bg-[#0097a7] selection:text-white relative overflow-hidden">
      {/* Background Pattern - subtle technical vibe */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#0097a7 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* --- 01. HEADER: CLEAN & STRUCTURED --- */}
        <header className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-[#0097a7]" />{" "}
              {/* Icon ahiya add karyu che */}
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#0097a7]">
                Foundation & Vision
              </span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-[#0097a7] tracking-tighter leading-[1.05]">
            Engineering the future <br />
            of <span className="text-[#0097a7] italic">patient care.</span>
          </h1>
        </header>

        {/* --- 02. CORE CONTENT: TWO COLUMN SPLIT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-8">
          <div className="space-y-12">
            <p className="text-slate-600 text-xl leading-relaxed font-medium">
              MEDIQ operates as a high-fidelity healthcare ecosystem designed to
              bridge the gap between advanced medical expertise and seamless
              patient accessibility.
            </p>

            {/* Feature List */}
            <div className="space-y-8">
              <SimpleFeatureItem
                icon={<ShieldCheck className="text-[#0097a7]" size={22} />}
                title="Data Integrity"
                desc="AES-256 end-to-end encrypted medical records."
              />
              <SimpleFeatureItem
                icon={<Clock className="text-[#0097a7]" size={22} />}
                title="Real-time Availability"
                desc="Instant synchronization with specialist schedules."
              />
              <SimpleFeatureItem
                icon={<Globe className="text-[#0097a7]" size={22} />}
                title="Global Standards"
                desc="Adhering to international ISO & HIPAA protocols."
              />
            </div>

              <div className="pt-4">
                <Button
                  name={
                    <div className="flex items-center gap-3">
                      {showMore ? "Close Detailed View" : "Read Our Mission"}
                      {showMore ? (
                        <ChevronRight
                          size={16}
                          className="rotate-90 transition-transform duration-300"
                        />
                      ) : (
                        <ArrowRight
                          size={16}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      )}
                    </div>
                  }
                  className="!bg-[#0097a7] !text-white !py-5 !px-10 !rounded-xl !text-sm !font-black uppercase tracking-widest transition-all hover:bg-slate-900 hover:shadow-[0_20px_40px_rgba(0,151,167,0.3)] group border-none shadow-lg"
                  click={() => setShowMore(!showMore)}
                />
              </div>
            </div>

          {/* Right Image with Minimal Floating Card */}
          <div className="relative">
            <div className="overflow-hidden rounded-3xl border-8 border-slate-50 shadow-2xl">
              <img
                src="/images/about.jpg"
                alt="MEDIQ Facility"
                className="w-full h-auto object-cover opacity-95 hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div className="absolute -bottom-10 -left-10 bg-[#0097a7] text-white p-10 rounded-3xl shadow-2xl hidden md:block">
              <p className="text-5xl font-black tracking-tighter leading-none mb-2 italic">
                06+
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                Years clinical trust
              </p>
            </div>
          </div>
        </div>

        {/* --- 03. EXPANDABLE CONTENT --- */}
        {showMore && (
          <div className="py-2 border-y border-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-16 animate-in slide-in-from-bottom-10 duration-700">
            <div className="space-y-6">
              <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center">
                <Target className="text-[#0097a7]" size={28} />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 tracking-tight uppercase">
                Our Mission
              </h3>
              <p className="text-slate-500 leading-relaxed text-lg font-medium">
                To empower every individual with immediate, expert medical
                consultation. We are building a future where logistics never
                stand in the way of recovery.
              </p>
            </div>

            <div className="bg-slate-50 p-12 rounded-[2.5rem] border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                  <Award className="text-[#0097a7]" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 uppercase">
                  Vetting Process
                </h3>
                <p className="text-slate-500 mb-8 text-sm leading-relaxed font-medium">
                  Our multi-node vetting system ensures only top 5% of
                  board-certified practitioners are onboarded to the platform.
                </p>
              </div>
              <a
                href="#"
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#0097a7] hover:gap-4 transition-all"
              >
                Specialist Requirements <ArrowRight size={16} />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const SimpleFeatureItem = ({ icon, title, desc }) => (
  <div className="flex items-start gap-6 group">
    <div className="w-12 h-12 shrink-0 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-[#0097a7]/10 transition-colors border border-slate-100">
      {icon}
    </div>
    <div>
      <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-1">
        {title}
      </h4>
      <p className="text-sm text-slate-500 font-medium leading-relaxed">
        {desc}
      </p>
    </div>
  </div>
);

const StatBlock = ({ icon, value, label }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 text-[#0097a7]">
      {icon}
      <span className="h-[1px] w-4 bg-slate-100"></span>
    </div>
    <div>
      <p className="text-5xl font-bold text-slate-900 tracking-tighter mb-1">
        {value}
      </p>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
        {label}
      </p>
    </div>
  </div>
);

export default About;
