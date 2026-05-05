import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSpecializations,
  fetchDoctorsBySpecialization,
} from "../../features/specialization/specializationThunks";
import Specialization from "./Specialization";

const Category = () => {
  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.specialization);

  const [active, setActive] = useState("All");

  useEffect(() => {
    dispatch(fetchSpecializations());
    dispatch(fetchDoctorsBySpecialization("All"));
  }, [dispatch]);

  const handleSelect = (name) => {
    setActive(name);
    dispatch(fetchDoctorsBySpecialization(name));
  };

  return (
    <div className="w-full">
      {/* Label (Optional but looks premium) */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          Filter by Specialization
        </span>
        <div className="h-px flex-grow bg-slate-100 ml-4 hidden md:block"></div>
      </div>

      {/* Horizontal Scrollable Container */}
      <div className="flex flex-nowrap items-center gap-3 overflow-x-auto pb-4 scrollbar-hide no-scrollbar -mx-2 px-2">
        {/* "All" Pillar */}
        <div className="shrink-0">
          <Specialization
            name="All"
            isActive={active === "All"}
            onClick={handleSelect}
            // Passing extra styling if your Specialization component supports it
            className="!rounded-2xl !px-8 !py-3 !font-bold !text-sm transition-all"
          />
        </div>

        {/* Dynamic List with Divider logic if needed */}
        {list
          .filter((s) => s.isActive)
          .map((spec) => (
            <div key={spec._id} className="shrink-0">
              <Specialization
                name={spec.name}
                isActive={active === spec.name}
                onClick={handleSelect}
                className="!rounded-2xl !px-8 !py-3 !font-bold !text-sm transition-all"
              />
            </div>
          ))}
      </div>

      {/* Subtle Bottom Border for Section Definition */}
      <div className="w-full h-px bg-slate-50 mt-2"></div>

      {/* Inline Style for hiding scrollbars while keeping functionality */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `,
        }}
      />
    </div>
  );
};

export default Category;
