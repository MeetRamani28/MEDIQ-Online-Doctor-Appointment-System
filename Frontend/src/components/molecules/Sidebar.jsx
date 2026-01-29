/* eslint-disable no-unused-vars */
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserRound,
  CalendarCheck,
  Mail,
  Users,
  ClipboardList,
  LogOut,
  X,
} from "lucide-react";

const menu = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Doctors", path: "/admin/doctors", icon: UserRound },
  { name: "Appointments", path: "/admin/appointments", icon: CalendarCheck },
  { name: "Contacts", path: "/admin/contact", icon: Mail },
  { name: "Users", path: "/admin/users", icon: Users },
  {
    name: "Specializations",
    path: "/admin/specialization",
    icon: ClipboardList,
  },
];

const Sidebar = ({ open, setOpen }) => {
  const { pathname } = useLocation();

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
          fixed top-0 left-0 z-50 h-screen w-64
          bg-white/90 backdrop-blur-xl
          border-r border-gray-200
          shadow-xl
          transform transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-extrabold tracking-wide text-[#0097a7]">
              MEDIQ
            </h1>
            <p className="text-xs text-gray-500 font-medium">Admin Dashboard</p>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-gray-600 hover:text-gray-900 transition"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {menu.map(({ name, path, icon: Icon }) => {
            const isActive = pathname === path;

            return (
              <NavLink
                key={path}
                to={path}
                onClick={() => setOpen(false)}
                className={`
                  group relative flex items-center gap-3
                  px-4 py-3 rounded-xl
                  text-sm font-medium
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-[#0097a7]/10 text-[#0097a7] shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  }
                `}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#0097a7]" />
                )}

                <div
                  className={`
                    flex items-center justify-center
                    w-8 h-8 rounded-lg
                    transition
                    ${
                      isActive
                        ? "bg-[#0097a7]/15 text-[#0097a7]"
                        : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                    }
                  `}
                >
                  <Icon size={18} />
                </div>

                <span className="tracking-wide">{name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
