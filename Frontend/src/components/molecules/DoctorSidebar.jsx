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
    if (!name) return "D";
    const names = name.split(" ");
    return names.length > 1
      ? names[0][0].toUpperCase() + names[1][0].toUpperCase()
      : name[0].toUpperCase();
  };

  return (
    <>
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 bg-white shadow-xl border-r border-gray-100
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          {user?.doctorProfile?.profileImage ? (
            <img
              src={logo}
              alt={user.fullName}
              className="w-10 h-10 rounded-full object-cover shadow-md"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-[#00bfa5] to-[#0097a7] text-white flex items-center justify-center font-bold shadow-md text-sm">
              {getInitials(user?.fullName)}
            </div>
          )}
          <h1 className="text-2xl font-bold text-[#0097a7] tracking-wide whitespace-nowrap">
            MEDIQ
          </h1>
        </div>

        <nav className="px-3 py-6 space-y-1">
          {menu.map(({ name, path, icon: Icon }) => {
            const isActive = pathname === path;

            return (
              <NavLink
                key={path}
                to={path}
                onClick={() => setOpen(false)}
                className={`
                  relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${
                    isActive
                      ? "bg-linear-to-r from-[#00bfa5] to-[#0097a7] text-white shadow-lg font-semibold"
                      : "text-gray-700 hover:bg-gray-100 hover:text-[#0097a7]"
                  }
                `}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-md" />
                )}
                <Icon
                  size={20}
                  className={isActive ? "text-white" : "text-gray-500"}
                />
                <span className="text-sm">{name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-6 w-full px-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-red-500 hover:text-white transition-all shadow-sm"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        <button
          onClick={() => setOpen(false)}
          className="lg:hidden absolute top-5 right-5 text-gray-600 hover:text-gray-800"
        >
          <X size={22} />
        </button>
      </aside>
    </>
  );
};

export default DoctorSidebar;
