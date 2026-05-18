/* eslint-disable no-unused-vars */
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserRound,
  CalendarCheck,
  Mail,
  Users,
  ClipboardList,
  X,
  ChevronRight,
  Activity,
} from "lucide-react";
import logo from "/images/icon.png";

const menu = [
  { name: "Overview Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Practitioners", path: "/admin/doctors", icon: UserRound },
  { name: "Appointment Feed", path: "/admin/appointments", icon: CalendarCheck },
  { name: "User Communications", path: "/admin/contact", icon: Mail },
  { name: "Account Directory", path: "/admin/users", icon: Users },
  { name: "Specialization Nodes", path: "/admin/specialization", icon: ClipboardList },
];

const Sidebar = ({ open, setOpen }) => {
  const { pathname } = useLocation();

  return (
    <>
      {/* Overlay for mobile devices */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-40 lg:hidden transition-all duration-300"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-68 bg-white shadow-2xl border-r border-slate-100
          flex flex-col transition-all duration-500 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
      >
        {/* 🌟 LOGO SECTION: પૂર્વનિર્ધારિત ઓવરલેપિંગ ફિક્સ કરવા માટે લીડિંગ અને ગેપ સેટ કર્યો */}
        <div className="flex items-center gap-4 px-6 py-6 border-b border-slate-50">
          <div className="p-2.5 bg-cyan-50/70 text-cyan-600 rounded-xl shrink-0">
            <Activity size={22} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col min-w-0 leading-tight">
            <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-cyan-600 to-teal-500 bg-clip-text text-transparent uppercase">
              MEDIQ
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 whitespace-nowrap block">
              Enterprise Suite
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 space-y-2 mt-6 overflow-y-auto">
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-4">
            Admin Menu
          </p>
          {menu.map(({ name, path, icon: Icon }) => {
            const isActive = pathname === path;

            return (
              <NavLink
                key={path}
                to={path}
                onClick={() => setOpen(false)}
                className={`
                  group relative flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300
                  ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-600 to-teal-500 text-white shadow-md shadow-cyan-100/60 font-semibold"
                      : "text-slate-500 hover:bg-slate-50 hover:text-cyan-600"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className={`transition-colors duration-300 ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-cyan-600"
                    }`}
                  />
                  <span className="text-xs font-bold uppercase tracking-wide">{name}</span>
                </div>
                {isActive && (
                  <ChevronRight size={14} className="text-white/80" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* System Version Signifier Footer */}
        <div className="p-4 border-t border-slate-100 text-center bg-slate-50/50">
          <p className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
            Platform Framework v3.1.0
          </p>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden absolute top-7 right-6 p-1.5 bg-slate-50 text-slate-400 rounded-lg hover:text-slate-600 transition-colors"
        >
          <X size={18} />
        </button>
      </aside>
    </>
  );
};

export default Sidebar;