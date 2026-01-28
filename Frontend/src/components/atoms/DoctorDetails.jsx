import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Ripples } from "ldrs/react";
import "ldrs/react/Ripples.css";
import { fetchDoctorById } from "../../features/specialization/specializationThunks";
import { createAppointment } from "../../features/appointments/appointmentThunks"; // ✅ import createAppointment
import getImageSrc from "../../components/atoms/getImageSrc";
import Button from "./Button";
import { addDays, startOfWeek, format, isToday } from "date-fns";
import { toast } from "react-toastify";

const DoctorDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, doctors, selectedDoctor } = useSelector(
    (state) => state.specialization
  );

  const doctor = doctors.find((d) => d._id === id) || selectedDoctor;
  const profile = doctor?.doctorProfile;

  useEffect(() => {
    if (!doctor) {
      dispatch(fetchDoctorById(id));
    }
  }, [dispatch, id, doctor]);

  // ----- Booking Slots State -----
  const [currentWeek, setCurrentWeek] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const generateTimeSlots = (day) => {
    const now = new Date();
    const selectedDate = new Date(day);
    let startHour = 9;

    if (isToday(selectedDate)) {
      const currentHour = now.getHours();
      startHour = currentHour + 1;
    }

    const slots = [];
    for (let i = startHour; i <= 20; i++) {
      const slotDate = new Date(day);
      slotDate.setHours(i, 0, 0);
      const formattedTime = format(slotDate, "hh:mm a");
      slots.push(formattedTime);
    }

    return slots.slice(0, profile?.maxAppointmentsPerDay || slots.length);
  };

  const getWeekDays = () =>
    [...Array(7)].map((_, i) => {
      const day = addDays(currentWeek, i);
      return {
        dayName: format(day, "EEE"),
        date: format(day, "d"),
        fullDate: format(day, "yyyy-MM-dd"),
        timeSlots: generateTimeSlots(day),
      };
    });

  const weekDays = getWeekDays();

  const nextWeek = () => {
    setCurrentWeek((prev) => addDays(prev, 7));
    setSelectedDayIndex(0);
    setSelectedSlot(null);
  };

  const prevWeek = () => {
    setCurrentWeek((prev) => addDays(prev, -7));
    setSelectedDayIndex(0);
    setSelectedSlot(null);
  };

  // ----- Handle Booking -----
  const handleBook = async () => {
    if (!selectedSlot) return;

    setBookingLoading(true);
    try {
      await dispatch(
        createAppointment({
          doctorId: doctor._id,
          appointmentDate: weekDays[selectedDayIndex].fullDate,
          appointmentTime: selectedSlot, // must match backend
        })
      ).unwrap();

      toast.success(
        `Appointment booked on ${weekDays[selectedDayIndex].fullDate} at ${selectedSlot}`
      );
      setSelectedSlot(null);
    } catch (err) {
      toast.error(err || "Failed to book appointment");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Ripples size="64" speed="2" color="#0097a7" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-20">{error}</div>;
  }

  if (!doctor) return null;

  return (
    <section className="min-h-screen bg-[#F7FBFC] pt-[12vh] px-4 sm:px-8 lg:px-16">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm p-6 sm:p-10 space-y-6">
        {/* Doctor Info */}
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <img
            src={getImageSrc(profile?.profileImage)}
            alt={doctor.fullName}
            className="w-32 h-32 rounded-2xl object-cover border"
          />

          <div className="flex-1 text-center sm:text-left space-y-1">
            <h1 className="text-2xl font-semibold text-gray-800">
              Dr. {doctor.fullName}
            </h1>
            <p className="text-[#0097a7] font-medium">
              {profile?.specialization?.name}
            </p>
            <p className="text-sm text-gray-500">
              {profile?.degree} • {profile?.experience}+ yrs experience
            </p>
            <p className="text-sm text-gray-500">
              Hospital: {profile?.hospitalAddress}
            </p>
            <p className="mt-2 font-semibold text-gray-800">
              ₹{profile?.consultationFee}
            </p>
          </div>
        </div>

        <div className="h-px bg-gray-200 my-4" />

        {/* About Doctor */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            About Doctor
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            {profile?.description || "No description available."}
          </p>
        </div>

        {/* Doctor Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
          <div className="bg-gray-50 p-4 rounded-xl text-center">
            <span className="text-gray-400">Email</span>
            <p className="font-medium truncate">{doctor.email}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl text-center">
            <span className="text-gray-400">Gender</span>
            <p className="font-medium">{doctor.gender}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl text-center">
            <span className="text-gray-400">Age</span>
            <p className="font-medium">{doctor.age}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl text-center">
            <span className="text-gray-400">Availability</span>
            <p className="font-medium">
              {profile?.available ? "Available" : "Not Available"}
            </p>
          </div>
        </div>

        {/* Booking Slots */}
        {profile?.available && (
          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Book Appointment
            </h2>

            <div className="flex justify-between items-center mb-2">
              <button
                onClick={prevWeek}
                className="px-3 py-1 text-sm rounded bg-gray-100 hover:bg-[#0097a7] hover:text-white transition"
              >
                Prev
              </button>

              <div className="flex gap-2 overflow-x-auto hide-scrollbar flex-1 mx-2">
                {weekDays.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedDayIndex(index);
                      setSelectedSlot(null);
                    }}
                    className={`px-3 py-2 rounded-full text-sm border min-w-[50px] transition ${
                      selectedDayIndex === index
                        ? "bg-[#0097a7] text-white border-[#0097a7]"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-[#0097a7] hover:text-white"
                    }`}
                  >
                    <div className="font-semibold">{day.dayName}</div>
                    <div>{day.date}</div>
                  </button>
                ))}
              </div>

              <button
                onClick={nextWeek}
                className="px-3 py-1 text-sm rounded bg-gray-100 hover:bg-[#0097a7] hover:text-white transition"
              >
                Next
              </button>
            </div>

            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {weekDays[selectedDayIndex].timeSlots.length > 0 ? (
                weekDays[selectedDayIndex].timeSlots.map((slot, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSlot(slot)}
                    className={`px-3 py-2 rounded-full border text-sm transition min-w-[70px] ${
                      selectedSlot === slot
                        ? "bg-[#0097a7] text-white border-[#0097a7]"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-[#0097a7] hover:text-white"
                    }`}
                  >
                    {slot}
                  </button>
                ))
              ) : (
                <p className="text-gray-500">
                  No available slots for this day.
                </p>
              )}
            </div>

            {/* Book Button */}
            <div className="mt-4 flex justify-center">
              <Button
                onClick={handleBook}
                disabled={!selectedSlot || bookingLoading}
                className="px-6 py-2 rounded-full w-full sm:w-auto"
                variant={selectedSlot ? "primary" : "outline"}
              >
                {bookingLoading
                  ? "Booking..."
                  : selectedSlot
                  ? `Book at ${selectedSlot}`
                  : "Select a slot to book"}
              </Button>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex-1"
          >
            Back to Doctors
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DoctorDetail;
