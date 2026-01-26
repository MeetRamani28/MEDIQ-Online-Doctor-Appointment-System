import { Outlet } from "react-router-dom";
import Navbar from "../components/molecules/Navbar";
import Footer from "../components/molecules/Footer";

const PatientLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default PatientLayout;
