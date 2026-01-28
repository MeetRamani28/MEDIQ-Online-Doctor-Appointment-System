const Specialization = ({ name, isActive, onClick }) => {
  return (
    <button
      onClick={() => onClick(name)}
      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200
        ${
          isActive
            ? "bg-[#0097a7] text-white shadow-md scale-105"
            : "bg-white text-gray-700 hover:bg-[#0097a7] hover:text-white"
        }`}
    >
      {name}
    </button>
  );
};

export default Specialization;
