import { Menu, LogOut, Bell, ShieldCheck, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/auth/authThunks";

const Topbar = ({ setSidebarOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Sourcing user metadata from Redux auth slice dynamically
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "AD";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <header
      className="
        sticky top-0 z-20
        h-16 w-full
        bg-white/80 backdrop-blur-md
        border-b border-slate-100
        px-4 sm:px-6 lg:px-8
        flex items-center justify-between
      "
    >
      {/* Left Control Cluster */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Mobile View Toggle Switch Handle */}
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="
            lg:hidden
            p-2 rounded-xl border border-slate-100
            text-slate-600 hover:text-cyan-600 hover:border-cyan-100
            bg-slate-50 hover:bg-cyan-50/50
            transition-all active:scale-95
          "
        >
          <Menu size={18} strokeWidth={2.5} />
        </button>

        <div className="truncate">
          <div className="flex items-center gap-1.5">
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            <h2 className="text-sm font-bold text-slate-800 tracking-tight truncate">
              {user?.role === "admin"
                ? "Core Control Console"
                : "Clinical Workspace"}
            </h2>
          </div>
          <p className="text-[11px] text-slate-400 font-medium hidden sm:block mt-0.5">
            Authorized administrative routing & operational monitoring portal
          </p>
        </div>
      </div>

      {/* Right Interaction/Action Hub */}
      <div className="flex items-center gap-3.5 shrink-0">
        {/* Secondary Informational Notification Trigger */}
        <button
          type="button"
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl transition-all hidden sm:flex active:scale-95"
          title="System Alerts"
        >
          <Bell size={16} />
        </button>

        {/* Security Access Verified Badge */}
        <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-500 border border-slate-100 rounded-lg">
          <ShieldCheck size={12} className="text-teal-500" /> Secure Node
        </div>

        {/* Vertical Divider line */}
        <span className="h-5 w-px bg-slate-200 hidden sm:block" />

        {/* Dynamic User Profile Context Badge */}
        <div className="flex items-center gap-2.5 pl-1 group cursor-pointer select-none">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-cyan-100 uppercase tracking-wider">
            {getInitials(user?.fullName || user?.name)}
          </div>
          <div className="hidden sm:block text-left max-w-[100px] truncate">
            <p className="text-xs font-bold text-slate-800 truncate leading-tight">
              {user?.fullName || user?.name || "MEDIQ System"}
            </p>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block mt-0.5 capitalize">
              {user?.role || "Root Profile"}
            </span>
          </div>
        </div>

        {/* Logout Command Element Trigger */}
        <button
          onClick={handleLogout}
          className="
            flex items-center gap-1.5
            px-3.5 py-1.5
            rounded-xl border border-slate-200
            text-slate-600 hover:text-rose-600
            bg-white hover:bg-rose-50 hover:border-rose-100
            text-xs font-bold uppercase tracking-wider
            transition-all active:scale-95 shadow-2xs
          "
        >
          <LogOut size={13} strokeWidth={2.5} />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
