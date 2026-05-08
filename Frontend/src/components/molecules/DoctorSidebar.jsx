/* eslint-disable no-unused-vars */
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  LayoutDashboard,
  CalendarCheck,
  FileText,
  UserRound,
  LogOut,
  X,
  ChevronRight,
} from "lucide-react";
import { logoutUser } from "../../features/auth/authThunks";
import logo from "/images/icon.png";

const menu = [
  { name: "Dashboard", path: "/doctor/dashboard", icon: LayoutDashboard },
  { name: "Appointments", path: "/doctor/appointment", icon: CalendarCheck },
  { name: "Medical Records", path: "/doctor/medicalrecord", icon: FileText },
  { name: "Profile", path: "/doctor/profile", icon: UserRound },
];

const DoctorSidebar = ({ open, setOpen }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "Dr";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-40 lg:hidden transition-all duration-300"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-72 bg-white shadow-2xl border-r border-slate-100
          flex flex-col transition-all duration-500 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-8 py-8">
          <div className="p-2 bg-cyan-50 rounded-xl">
            <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-teal-500 bg-clip-text text-transparent tracking-tight">
            MEDIQ
          </h1>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-[2px] mb-4">
            Main Menu
          </p>
          {menu.map(({ name, path, icon: Icon }) => {
            const isActive = pathname === path;

            return (
              <NavLink
                key={path}
                to={path}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `
                  group relative flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300
                  ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-600 to-teal-500 text-white shadow-lg shadow-cyan-200"
                      : "text-slate-500 hover:bg-slate-50 hover:text-cyan-600"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={22}
                    className={`transition-colors duration-300 ${isActive ? "text-white" : "text-slate-400 group-hover:text-cyan-600"}`}
                  />
                  <span className="font-medium text-[15px]">{name}</span>
                </div>
                {isActive && (
                  <ChevronRight size={16} className="text-white/70" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Section - User Profile & Logout */}
        <div className="p-4 border-t border-slate-50 bg-slate-50/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-slate-500 font-semibold hover:bg-red-50 hover:text-red-600 transition-all duration-300 border border-transparent hover:border-red-100"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden absolute top-7 right-6 p-1.5 bg-slate-50 text-slate-400 rounded-lg hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>
      </aside>
    </>
  );
};

export default DoctorSidebar;
