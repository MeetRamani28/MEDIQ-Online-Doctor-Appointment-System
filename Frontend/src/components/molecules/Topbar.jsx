import { Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authThunks";

const Topbar = ({ setSidebarOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <header
      className="
        sticky top-0 z-30
        h-16
        bg-white/80 backdrop-blur-xl
        border-b border-gray-200
        px-4 sm:px-6
        flex items-center justify-between
      "
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="
            lg:hidden
            p-2 rounded-xl
            text-gray-600
            hover:bg-gray-100
            transition
          "
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Admin Panel
          </h2>
          <p className="text-xs text-gray-500 hidden sm:block">
            Manage platform settings
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Logout */}
        <button
          onClick={handleLogout}
          className="
            flex items-center gap-2
            px-4 py-2
            rounded-xl
            border border-[#0097a7]
            text-[#0097a7]
            text-sm font-medium
            hover:bg-[#0097a7]
            hover:text-white
            transition
          "
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
