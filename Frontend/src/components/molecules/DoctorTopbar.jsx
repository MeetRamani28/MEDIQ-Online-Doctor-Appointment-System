import { Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser, fetchUserProfile } from "../../features/auth/authThunks";
import { useEffect, useState } from "react";
import getImageSrc from "../../components/atoms/getImageSrc";

const DoctorTopbar = ({ setSidebarOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (!user || !user.doctorProfile) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user?.doctorProfile?.profileImage) {
      setAvatar(getImageSrc(user.doctorProfile.profileImage));
    } else {
      setAvatar(null);
    }
  }, [user]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "D";
    const names = name.split(" ");
    return names.length > 1
      ? names[0][0].toUpperCase() + names[1][0].toUpperCase()
      : name[0].toUpperCase();
  };

  const goToProfile = () => {
    navigate("/doctor/profile");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-gray-600 hover:text-gray-800 transition"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          Dr. {user?.fullName || "Doctor"}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={goToProfile}
            className="w-10 h-10 rounded-full overflow-hidden shadow-md focus:outline-none"
          >
            {avatar ? (
              <img
                src={avatar}
                alt={user?.fullName || "Doctor"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-linear-to-tr from-[#00bfa5] to-[#0097a7] text-white flex items-center justify-center font-bold">
                {getInitials(user?.fullName)}
              </div>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="hidden sm:block text-sm border border-[#0097a7] text-[#0097a7] px-4 py-1.5 rounded-lg hover:bg-[#0097a7] hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default DoctorTopbar;
