import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Ripples } from "ldrs/react";
import "ldrs/react/Ripples.css";
import DoctorCard from "./DoctorCard";

const Doctors = ({ specialization }) => {
  const navigate = useNavigate();
  const { doctors, loading } = useSelector((state) => state.specialization);

  const [showNoDoctors, setShowNoDoctors] = useState(false);

  useEffect(() => {
    let timer;

    if (!loading && (!doctors || doctors.length === 0)) {
      timer = setTimeout(() => setShowNoDoctors(true), 5000); // 5 sec delay
    } else {
      setShowNoDoctors(false);
    }

    return () => clearTimeout(timer);
  }, [loading, doctors]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Ripples size="60" speed="2" color="#0097a7" />
      </div>
    );
  }

  if (showNoDoctors) {
    return (
      <div className="text-center text-gray-500 py-10">
        No doctors found for{" "}
        <span className="font-semibold">{specialization}</span>.
      </div>
    );
  }

  if (doctors && doctors.length > 0) {
    return (
      <div className="px-4 py-8 md:px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
