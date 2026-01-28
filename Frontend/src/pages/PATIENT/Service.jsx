import React, { useState } from "react";
import { useSelector } from "react-redux";
import Category from "../../components/atoms/Category";
import Doctors from "../../components/atoms/Doctors";
import { Ripples } from "ldrs/react";
import "ldrs/react/Ripples.css";

const Service = () => {
  const [selectedSpec, setSelectedSpec] = useState("All");
  const { loading } = useSelector((state) => state.specialization);

  return (
    <section className="w-full min-h-screen pt-[12vh] pb-12 bg-[#F7FBFC]">
      <div className="text-center mb-10 px-4">
        <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm sm:text-base">
          Find experienced doctors across multiple specializations and book
          appointments instantly.
        </p>
      </div>

      <div className="mb-8">
        <Category onSelect={setSelectedSpec} />
      </div>

      <div className="px-4 sm:px-6 lg:px-10">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-[55vh] bg-white rounded-3xl shadow-sm">
            <Ripples size="64" speed="2" color="#0097a7" />
            <p className="mt-4 text-sm text-gray-500">
              Fetching best doctors for you...
            </p>
          </div>
        ) : (
          <Doctors specialization={selectedSpec} />
        )}
      </div>
    </section>
  );
};

export default Service;
