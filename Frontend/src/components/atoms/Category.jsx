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
    <div className="flex flex-wrap gap-3 justify-center py-4">
      <Specialization
        name="All"
        isActive={active === "All"}
        onClick={handleSelect}
      />

      {list
        .filter((s) => s.isActive)
        .map((spec) => (
          <Specialization
            key={spec._id}
            name={spec.name}
            isActive={active === spec.name}
            onClick={handleSelect}
          />
        ))}
    </div>
  );
};

export default Category;
