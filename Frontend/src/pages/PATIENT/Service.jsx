import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSpecializations,
  fetchDoctorsBySpecialization,
} from "../../features/specialization/specializationThunks";
import Category from "../../components/atoms/Category";
import Doctors from "../../components/atoms/Doctors";
import { Ripples } from "ldrs/react";

const Service = () => {
  const dispatch = useDispatch();
  const [selectedSpec, setSelectedSpec] = useState("All");
  const { loading } = useSelector((state) => state.specialization);

  // Initial Load Dispatch: Service page mount thay tyre j dispatch kari dyo
  useEffect(() => {
    dispatch(fetchSpecializations());
    dispatch(fetchDoctorsBySpecialization("All"));
  }, [dispatch]);

  return (
    <section className="w-full min-h-screen pt-[16vh] pb-24 bg-white">
      {/* Header logic same raheshe... */}

      <div className="max-w-7xl mx-auto px-6 mb-12">
        {/* Category ne selectedSpec ane setter pass karo jethi extra dispatch na thay */}
        <Category active={selectedSpec} setActive={setSelectedSpec} />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-[50vh] bg-slate-50 rounded-[3rem] border border-slate-100 border-dashed animate-pulse">
            <Ripples size="64" speed="2" color="#0097a7" />
            <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Synchronizing Directory...
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
