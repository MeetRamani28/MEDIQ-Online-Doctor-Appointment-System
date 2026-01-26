import React from "react";
import bg from "../../../public/images/home.jpeg";
import Button from "../../components/atoms/PatientButton";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full min-h-[100vh] flex items-center">
      <img
        src={bg}
        alt="Healthcare"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-black/20" />

      <div className="relative z-10 px-4 sm:px-10 md:px-16 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
          BOOK AN <span className="text-[#0097a7]">APPOINTMENT</span>
        </h1>

        <p className="mt-4 text-gray-200 text-base sm:text-lg">
          We Offer A Full Spectrum Of Healthcare Services To Meet All Your
          Medical Needs.
        </p>

        <div className="mt-6">
          <Button name="Book Now" click={() => navigate("/patient/services")} />
        </div>
      </div>
    </section>
  );
};

export default Home;
