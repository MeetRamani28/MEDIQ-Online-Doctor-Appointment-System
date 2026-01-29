import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/atoms/PatientButton";
import bg from "../../../public/images/home.jpeg";

const Home = () => {
  const navigate = useNavigate();

  return (
    <section className="relative h-screen w-full flex items-center justify-start overflow-hidden">
      <img
        src={bg}
        alt="Healthcare background"
        loading="eager"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent" />

      <div className="relative z-10 px-5 sm:px-10 md:px-16 max-w-2xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
          Book an <span className="text-[#0097a7]">Appointment</span>
        </h1>

        <p className="mt-4 text-gray-200 text-base sm:text-lg leading-relaxed">
          We offer a complete spectrum of healthcare services designed to meet
          your medical needs with care, trust, and expertise.
        </p>

        <div className="mt-7">
          <Button name="Book Now" click={() => navigate("/patient/services")} />
        </div>
      </div>
    </section>
  );
};

export default Home;
