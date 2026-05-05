import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Ripples } from "ldrs/react";
import "ldrs/react/Ripples.css";
import { fetchDoctorById } from "../../features/specialization/specializationThunks";
import { createAppointment } from "../../features/appointments/appointmentThunks";
import getImageSrc from "../../components/atoms/getImageSrc";
import Button from "../../components/atoms/PatientButton";
import { addDays, startOfWeek, format, isToday } from "date-fns";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Star,
  GraduationCap,
  Mail,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Briefcase,
  Verified,
} from "lucide-react";

const DoctorDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, doctors, selectedDoctor } = useSelector(
    (state) => state.specialization,
  );

  const doctor = doctors.find((d) => d._id === id) || selectedDoctor;
  const profile = doctor?.doctorProfile;

  useEffect(() => {
    if (!doctor) dispatch(fetchDoctorById(id));
    window.scrollTo(0, 0);
  }, [dispatch, id, doctor]);

  const [currentWeek, setCurrentWeek] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const nextWeek = () => setCurrentWeek((prev) => addDays(prev, 7));
  const prevWeek = () => setCurrentWeek((prev) => addDays(prev, -7));

  const generateTimeSlots = (day) => {
    const now = new Date();
    const selectedDate = new Date(day);
    let startHour = 9;
    if (isToday(selectedDate)) startHour = now.getHours() + 1;
    const slots = [];
    for (let i = Math.max(startHour, 9); i <= 20; i++) {
      const slotDate = new Date(day);
      slotDate.setHours(i, 0, 0);
      slots.push(format(slotDate, "hh:mm a"));
    }
    return slots.slice(0, profile?.maxAppointmentsPerDay || slots.length);
  };

  const weekDays = [...Array(7)].map((_, i) => {
    const day = addDays(currentWeek, i);
    return {
      dayName: format(day, "EEE"),
      date: format(day, "dd"),
      fullDate: format(day, "yyyy-MM-dd"),
      timeSlots: generateTimeSlots(day),
    };
  });

  const handleBook = async () => {
    if (!selectedSlot) return;
    setBookingLoading(true);
    try {
      await dispatch(
        createAppointment({
          doctorId: doctor._id,
          appointmentDate: weekDays[selectedDayIndex].fullDate,
          appointmentTime: selectedSlot,
        }),
      ).unwrap();
      toast.success(`Success! Slot booked at ${selectedSlot}`);
      setSelectedSlot(null);
    } catch (err) {
      toast.error(err || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-white">
        <Ripples size="64" speed="2" color="#0097a7" />
      </div>
    );

  if (!doctor) return null;

  return (
    <main className="min-h-screen bg-[#F9FAFB] pt-[12vh] pb-24 font-sans selection:bg-[#0097a7] selection:text-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-[#0097a7] transition-all group"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-xs font-bold uppercase tracking-widest">
              Directory
            </span>
          </button>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-cyan-50 rounded-full border border-cyan-100">
            <Verified size={14} className="text-[#0097a7]" />
            <span className="text-[10px] font-black text-[#0097a7] uppercase tracking-widest">
              Medical Board Verified
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT: MINIMAL PROFILE */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100">
              <div className="flex flex-col items-center">
                <img
                  src={getImageSrc(profile?.profileImage)}
                  alt={doctor.fullName}
                  className="w-36 h-36 rounded-3xl object-cover mb-6 border-4 border-slate-50 shadow-sm"
                />
                <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">
                  Dr. {doctor.fullName}
                </h1>
                <p className="text-[#0097a7] text-xs font-black uppercase tracking-[0.2em] mb-4">
                  {profile?.specialization?.name}
                </p>
                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-lg">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span className="text-[10px] font-black text-amber-700 uppercase">
                    4.9 Review Score
                  </span>
                </div>
              </div>

              <div className="mt-8 space-y-4 pt-8 border-t border-slate-50">
                <InfoItem
                  icon={<GraduationCap size={16} />}
                  label="Education"
                  value={profile?.degree}
                />
                <InfoItem
                  icon={<Briefcase size={16} />}
                  label="Experience"
                  value={`${profile?.experience}+ Years`}
                />
                <InfoItem
                  icon={<Mail size={16} />}
                  label="Contact"
                  value={doctor.email}
                />
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 mb-2">
                  Location
                </p>
                <p className="text-sm font-medium leading-relaxed mb-4">
                  {profile?.hospitalAddress}
                </p>
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <MapPin size={20} className="text-cyan-400" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: BOOKING ENGINE */}
          <div className="lg:col-span-8 space-y-6">
            {/* BIO CARD */}
            <div className="bg-white rounded-[2rem] p-10 border border-slate-100">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-4">
                Professional Bio
              </h2>
              <p className="text-slate-600 text-lg font-medium leading-relaxed leading-snug">
                {profile?.description ||
                  "Dedicated to providing high-quality, compassionate healthcare. Specializing in advanced diagnosis and treatment plans tailored to individual patient needs."}
              </p>
            </div>

            {/* BOOKING CARD */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">
                  Pick a Schedule
                </h2>
                <div className="flex gap-2">
                  <NavBtn onClick={prevWeek} icon={<ChevronLeft size={18} />} />
                  <NavBtn
                    onClick={nextWeek}
                    icon={<ChevronRight size={18} />}
                  />
                </div>
              </div>

              {/* DATE STRIP */}
              <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar">
                {weekDays.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedDayIndex(index);
                      setSelectedSlot(null);
                    }}
                    className={`shrink-0 flex flex-col items-center justify-center w-16 py-4 rounded-2xl border-2 transition-all ${
                      selectedDayIndex === index
                        ? "bg-[#0097a7] border-[#0097a7] text-white shadow-lg shadow-cyan-100 -translate-y-1"
                        : "bg-white border-slate-50 text-slate-400 hover:border-cyan-100"
                    }`}
                  >
                    <span className="text-[9px] font-black uppercase mb-1">
                      {day.dayName}
                    </span>
                    <span className="text-lg font-black tracking-tight">
                      {day.date}
                    </span>
                  </button>
                ))}
              </div>

              {/* SLOTS GRID */}
              <div className="mt-8 border-t border-slate-50 pt-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2">
                  <Clock size={14} /> Select Available Time
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {weekDays[selectedDayIndex].timeSlots.length > 0 ? (
                    weekDays[selectedDayIndex].timeSlots.map((slot, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-4 rounded-xl font-bold text-xs transition-all active:scale-95 ${
                          selectedSlot === slot
                            ? "bg-slate-900 text-white shadow-xl"
                            : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-transparent"
                        }`}
                      >
                        {slot}
                      </button>
                    ))
                  ) : (
                    <div className="col-span-full py-10 bg-slate-50 rounded-2xl text-center border border-dashed border-slate-200">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        No slots found for this date
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ACTION BAR */}
              <div className="mt-12 flex items-center justify-between p-2 bg-slate-50 rounded-3xl">
                <div className="pl-6">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Consultation Fee
                  </p>
                  <p className="text-2xl font-black text-slate-900 tracking-tight">
                    ₹{profile?.consultationFee}
                  </p>
                </div>
                <Button
                  click={handleBook}
                  disabled={!selectedSlot || bookingLoading}
                  className={`!py-5 !px-10 !rounded-2xl !text-sm !font-black uppercase tracking-widest transition-all ${
                    selectedSlot
                      ? "!bg-[#0097a7] hover:shadow-xl shadow-cyan-200"
                      : "!bg-slate-200 !text-slate-400"
                  }`}
                  name={bookingLoading ? "Processing..." : "Confirm Booking"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `.no-scrollbar::-webkit-scrollbar { display: none; }`,
        }}
      />
    </main>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-4">
    <div className="text-[#0097a7] shrink-0">{icon}</div>
    <div className="min-w-0">
      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">
        {label}
      </p>
      <p className="text-sm font-bold text-slate-700 truncate">
        {value || "Verified Specialist"}
      </p>
    </div>
  </div>
);

const NavBtn = ({ onClick, icon }) => (
  <button
    onClick={onClick}
    className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#0097a7] hover:bg-cyan-50 transition-all border border-transparent hover:border-cyan-100"
  >
    {icon}
  </button>
);

export default DoctorDetail;
