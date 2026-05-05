import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { submitContact } from "../../features/contact/contactThunks";
import { toast } from "react-toastify";
import { clearContactState } from "../../features/contact/contactSlice";
import {
  MailPlus,
  Headset,
  MapPinned,
  SendHorizontal,
  Fingerprint,
  Timer,
  Sparkles,
} from "lucide-react";
import Button from "../../components/atoms/PatientButton";

const Contact = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.contact);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    dispatch(submitContact(data));
  };

  useEffect(() => {
    if (success) {
      toast.success("Transmission Secure: Message Sent.");
      reset();
      dispatch(clearContactState());
    }
    if (error) {
      toast.error(error);
      dispatch(clearContactState());
    }
  }, [success, error, dispatch, reset]);

  return (
    <section className="w-full min-h-screen pt-[16vh] pb-32 bg-[#fcfdfe] font-sans selection:bg-[#0097a7] selection:text-white relative overflow-hidden">
      {/* --- PREMIUM BACKGROUND ELEMENTS --- */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0097a7]/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-[100px] -z-10 -translate-x-1/4 translate-y-1/4" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* --- 01. HEADER: HIGH-END TYPOGRAPHY --- */}
        <header className="mb-24">
          <div className="flex items-center gap-4 mb-6">
            {/* <div className="h-[1px] w-12 bg-slate-200"></div> */}
            <div className="flex items-center gap-2 text-[#0097a7]">
              <Sparkles size={14} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">
                Direct Interface
              </span>
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold text-slate-900 tracking-tighter leading-none">
            Connect with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0097a7] to-cyan-500 italic font-medium">
              Intelligence.
            </span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          {/* --- 02. LEFT: CONTACT NODES WITH DEPTH --- */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-10">
              <ContactNode
                icon={<MailPlus size={22} />}
                label="Digital Correspondence"
                value="concierge@mediq.com"
                color="bg-blue-50 text-blue-600"
              />
              <ContactNode
                icon={<Headset size={22} />}
                label="Priority Support"
                value="+91 79 4000 1234"
                color="bg-emerald-50 text-emerald-600"
              />
              <ContactNode
                icon={<MapPinned size={22} />}
                label="Innovation Hub"
                value="Satellite, Ahmedabad, GJ"
                color="bg-purple-50 text-purple-600"
              />
            </div>

            {/* Response Performance Metric */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative p-8 bg-white rounded-2xl border border-slate-100 flex items-center gap-6 shadow-sm">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-[#0097a7] shadow-xl ring-4 ring-slate-50">
                  <Timer size={26} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                    Response Protocol
                  </p>
                  <p className="text-base font-bold text-slate-800 leading-tight">
                    Instant triage.{" "}
                    <span className="text-[#0097a7]">45m average.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* --- 03. RIGHT: THE PREMIUM GLASS FORM --- */}
          <div className="lg:col-span-7">
            <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] p-8 md:p-14 relative overflow-hidden">
              {/* Subtle Form Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0097a7]/5 rounded-bl-[100px] -z-10" />

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="group space-y-3">
                    <FieldLabel icon={<Fingerprint size={12} />}>
                      Identity
                    </FieldLabel>
                    <input
                      {...register("name", { required: true })}
                      placeholder="Full Name"
                      className="contact-input"
                    />
                  </div>
                  <div className="group space-y-3">
                    <FieldLabel icon={<MailPlus size={12} />}>
                      Node Address
                    </FieldLabel>
                    <input
                      {...register("email", { required: true })}
                      type="email"
                      placeholder="Email"
                      className="contact-input"
                    />
                  </div>
                </div>

                <div className="group space-y-3">
                  <FieldLabel icon={<Sparkles size={12} />}>
                    Message Context
                  </FieldLabel>
                  <textarea
                    {...register("message", { required: true })}
                    placeholder="How can our clinical experts assist you today?"
                    rows="4"
                    className="contact-input resize-none"
                  />
                </div>

                <div className="pt-6">
                  <Button
                    loading={loading}
                    name={
                      <div className="flex items-center gap-4">
                        <span className="tracking-[0.2em] font-black uppercase text-[11px]">
                          {loading
                            ? "Transmitting Data..."
                            : "Transmit Message"}
                        </span>
                        {!loading && (
                          <SendHorizontal
                            size={18}
                            className="group-hover:translate-x-2 group-hover:-translate-y-1 transition-all duration-300"
                          />
                        )}
                      </div>
                    }
                    className="!bg-[#0097a7] !text-white !py-6 !px-14 !rounded-2xl transition-all hover:!bg-[#0097a7] group shadow-[0_20px_40px_rgba(0,0,0,0.1)] active:scale-95"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .contact-input {
            width: 100%;
            background-color: transparent;
            border-bottom: 2px solid #f1f5f9;
            padding: 12px 2px;
            outline: none;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            font-weight: 600;
            color: #0f172a;
            font-size: 1.1rem;
            letter-spacing: -0.01em;
        }
        .contact-input:focus {
            border-bottom-color: #0097a7;
            padding-left: 8px;
        }
        .contact-input::placeholder {
            color: #cbd5e1;
            font-size: 0.95rem;
            font-weight: 500;
            transition: color 0.3s ease;
        }
        .contact-input:focus::placeholder {
            color: #94a3b8;
        }
      `,
        }}
      />
    </section>
  );
};

// Sub-components with Enhanced UI
const ContactNode = ({ icon, label, value, color }) => (
  <div className="flex items-center gap-8 group cursor-pointer">
    <div
      className={`w-14 h-14 shrink-0 ${color} rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm ring-1 ring-black/5`}
    >
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] leading-none mb-2 group-hover:text-[#0097a7] transition-colors">
        {label}
      </p>
      <p className="text-xl font-bold text-slate-800 tracking-tight group-hover:translate-x-1 transition-transform duration-300">
        {value}
      </p>
    </div>
  </div>
);

const FieldLabel = ({ children, icon }) => (
  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2 ml-1 group-focus-within:text-[#0097a7] transition-colors">
    {icon} {children}
  </label>
);

export default Contact;
