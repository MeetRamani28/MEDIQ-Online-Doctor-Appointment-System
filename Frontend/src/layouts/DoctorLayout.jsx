import { useState } from "react";
import DoctorSidebar from "../components/molecules/DoctorSidebar";
import DoctorTopbar from "../components/molecules/DoctorTopbar";
import { Outlet } from "react-router-dom";

const DoctorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      <DoctorSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 lg:ml-64 min-h-screen bg-gray-50">
        <DoctorTopbar setSidebarOpen={setSidebarOpen} />
        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
