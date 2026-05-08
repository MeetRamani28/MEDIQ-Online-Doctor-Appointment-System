/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  ChevronDown,
} from "lucide-react";
import { fetchUserProfile } from "../../features/auth/authThunks";
import { getDoctorDashboard } from "../../features/doctor/doctorThunks";
import getImageSrc from "../../components/atoms/getImageSrc";

const DoctorTopbar = ({ setSidebarOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state માંથી 'dashboard' ડેટા મેળવવો (dashboardData ને બદલે dashboard વાપરો)
  const { user } = useSelector((state) => state.auth);
  const { dashboard } = useSelector((state) => state.doctor || {}); 

  const [avatar, setAvatar] = useState(null);
  const [greeting, setGreeting] = useState("Good Morning");

  // નેટવર્ક રિસ્પોન્સ મુજબ 'dashboard.todayAppointments' નો ઉપયોગ કરવો
  const waitingCount = dashboard?.todayAppointments?.length || 0;

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    // ડેટા ફેચ કરવા માટે ડેશબોર્ડ થન્ક ડિસ્પેચ કરવો
    dispatch(getDoctorDashboard());

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

  const getInitials = (name) => {
    if (!name) return "Dr";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <header className="h-20 bg-white/80 backdrop-blur-xl flex items-center justify-between px-6 lg:px-10 border-b border-slate-100 sticky top-0 z-20">
      <div className="flex items-center gap-6">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2.5 rounded-2xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all"
        >
          <Menu size={22} />
        </button>

        <div className="hidden sm:block text-left">
          <h2 className="text-[15px] font-bold text-slate-800 leading-tight">
            {greeting}, <span className="text-cyan-600">Dr. {user?.fullName?.split(" ")[0] || "Doctor"}</span>
          </h2>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">
            Let's check your queue today.
          </p>
        </div>

        {/* લાઈવ કાઉન્ટ જે હવે સાચો ડેટા બતાવશે */}
        <div className="hidden md:flex items-center gap-3 bg-cyan-50/50 border border-cyan-100/50 px-3 py-1.5 rounded-2xl ml-4">
          <p className="text-[10px] font-black text-cyan-700 flex items-center uppercase tracking-wider">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            {waitingCount < 10 ? `0${waitingCount}` : waitingCount} Patients Scheduled
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/doctor/profile")}
          className="flex items-center gap-3 p-1 rounded-2xl hover:bg-slate-50 transition-all group border border-transparent"
        >
          <div className="relative">
            {avatar ? (
              <img
                src={avatar}
                alt="Doctor"
                className="w-11 h-11 rounded-2xl object-cover ring-2 ring-transparent group-hover:ring-cyan-100 transition-all"
              />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-md uppercase">
                {getInitials(user?.fullName)}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-[3px] border-white rounded-full shadow-sm"></div>
          </div>
          <ChevronDown size={14} className="hidden md:block text-slate-300 group-hover:text-cyan-600 transition-transform" />
        </button>
      </div>
    </header>
  );
};

export default DoctorTopbar;