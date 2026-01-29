import { Check, X } from "lucide-react";

const ToggleSwitch = ({ checked, onChange }) => {
  return (
    <button
      onClick={onChange}
      type="button"
      className={`relative w-12 h-7 flex items-center rounded-full transition-colors duration-300
        ${checked ? "bg-indigo-600" : "bg-gray-300"}`}
    >
      <span
        className={`absolute left-1 top-1 w-5 h-5 rounded-full bg-white shadow-md 
        flex items-center justify-center transition-all duration-300
        ${checked ? "translate-x-5" : ""}`}
      >
        {checked ? (
          <Check size={12} className="text-indigo-600" />
        ) : (
          <X size={12} className="text-gray-400" />
        )}
      </span>
    </button>
  );
};

export default ToggleSwitch;
