import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/molecules/Sidebar";
import Topbar from "../components/molecules/Topbar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7FBFC] flex">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 lg:ml-64 flex flex-col">
        <Topbar setSidebarOpen={setSidebarOpen} />
        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
