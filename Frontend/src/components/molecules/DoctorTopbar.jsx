import { Menu, Bell } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../features/auth/authThunks";

const DoctorTopbar = ({ setSidebarOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-gray-600"
        >
          <Menu size={24} />
        </button>

        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          Doctor Panel
        </h2>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative text-gray-600 hover:text-gray-800">
          <Bell size={22} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-[#0097a7]/10 text-[#0097a7] flex items-center justify-center font-semibold">
            D
          </div>

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
