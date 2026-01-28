import getImageSrc from "./getImageSrc";

const DoctorCard = ({ doctor, navigate }) => {
  const profile = doctor.doctorProfile || {};

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 flex flex-col">
      <div className="flex justify-center">
        <img
          src={getImageSrc(profile.profileImage)}
          alt={doctor.fullName}
          className="w-24 h-24 rounded-full object-cover border"
        />
      </div>

      <div className="text-center mt-4 space-y-1">
        <h3 className="text-lg font-semibold">Dr. {doctor.fullName}</h3>
        <p className="text-sm text-[#0097a7]">
          {profile.specialization?.name || "Specialist"}
        </p>
        <p className="text-sm text-gray-600">
          {profile.degree || "MBBS"} • {profile.experience || 0}+ yrs
        </p>
      </div>

      <div className="mt-3 text-center">
        <span className="text-gray-700 font-medium">
          ₹{profile.consultationFee || "—"}
        </span>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={() => navigate(`/patient/doctors/${doctor._id}`)}
          className="flex-1 border border-[#0097a7] text-[#0097a7] py-2 rounded-lg hover:bg-[#0097a7] hover:text-white transition"
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
