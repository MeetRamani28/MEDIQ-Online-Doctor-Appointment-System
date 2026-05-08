import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DoctorSidebar from "../components/molecules/DoctorSidebar";
import DoctorTopbar from "../components/molecules/DoctorTopbar";

const DoctorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">
      <DoctorSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 transition-all duration-300 ease-in-out lg:ml-72">
        <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/75 border-b border-slate-200/60">
          <DoctorTopbar setSidebarOpen={setSidebarOpen} />
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto w-full">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
        </main>

        <footer className="p-6 text-center text-sm text-slate-400 border-t border-slate-100">
          © 2026 MedTech Systems. All rights reserved.
        </footer>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DoctorLayout;
