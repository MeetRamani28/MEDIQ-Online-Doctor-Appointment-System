import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/molecules/Sidebar";
import Topbar from "../components/molecules/Topbar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-screen bg-[#f8fafc] flex overflow-hidden antialiased text-slate-800">
      {/* Structural Left Navigation Anchor Panel */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Primary Dynamic Display Workspace */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 overflow-hidden">
        <Topbar setSidebarOpen={setSidebarOpen} />

        {/* Core Screen Canvas Wrapper */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
