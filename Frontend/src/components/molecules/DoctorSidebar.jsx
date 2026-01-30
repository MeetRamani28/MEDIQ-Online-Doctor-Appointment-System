/* eslint-disable no-unused-vars */
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  FileText,
  UserRound,
  LogOut,
  X,
} from "lucide-react";

const menu = [
  {
    name: "Dashboard",
    path: "/doctor/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Appointments",
    path: "/doctor/appointments",
    icon: CalendarCheck,
  },
  {
    name: "Medical Records",
    path: "/doctor/medical-records",
    icon: FileText,
  },
  {
    name: "Profile",
    path: "/doctor/profile",
    icon: UserRound,
  },
];

const DoctorSidebar = ({ open, setOpen }) => {
  const { pathname } = useLocation();

  return (
    <>
      {/* Overlay (mobile) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 bg-white
           border-gray-100
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5">
          <h1 className="text-2xl font-bold text-[#0097a7] tracking-wide">
            MEDIQ
          </h1>

          <button onClick={() => setOpen(false)} className="lg:hidden">
            <X size={22} />
          </button>
        </div>

        {/* Menu */}
        <nav className="px-3 py-4 space-y-1">
          {menu.map(({ name, path, icon: Icon }) => {
            const isActive = pathname === path;

            return (
              <NavLink
                key={path}
                to={path}
                onClick={() => setOpen(false)}
                className={`
                  relative flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-[#0097a7]/10 text-[#0097a7] font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                  }
                `}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#0097a7] rounded-r-md" />
                )}

                <Icon size={18} />
                <span className="text-sm">{name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default DoctorSidebar;
