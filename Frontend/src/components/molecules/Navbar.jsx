import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

import logo from "../../../public/images/icon.png";
import NavButton from "../atoms/PatientButton";
import { logoutUser } from "../../features/auth/authThunks";

const navLinks = [
  { path: "/patient/home", label: "Home" },
  { path: "/patient/services", label: "Services" },
  { path: "/patient/blogs", label: "Blogs" },
  { path: "/patient/about", label: "About" },
  { path: "/patient/contact", label: "Contact" },
  { path: "/patient/appointments", label: "My Appointments" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setMenuOpen(false);
    navigate("/login");
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="fixed top-0 left-0 w-full h-[10vh] md:h-[11vh] bg-[#dceced] z-50 shadow">
      <div className="h-full flex items-center justify-between px-4 md:px-10">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="MEDIQ"
            className="w-10 h-10 md:w-12 md:h-12 rounded-full"
          />
          <h1 className="text-xl md:text-2xl font-medium">
            MEDI<span className="text-[#0097a7]">Q</span>
          </h1>
        </div>

        <div className="hidden md:flex gap-8 font-medium">
          {navLinks.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                isActive
                  ? "text-[#0097a7] border-b-2 border-[#0097a7]"
                  : "text-black hover:text-[#0097a7]"
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <span className="text-sm text-gray-700">
            Hi, <b>{user?.fullName}</b>
          </span>
          <NavButton
            name={loading ? "Logging out..." : "LOG OUT"}
            click={handleLogout}
            disabled={loading}
          />
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl"
        >
          {menuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden absolute top-[10vh] w-full h-[90vh] bg-[#dceced] flex flex-col items-center justify-center gap-8 text-lg">
          {navLinks.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              className="hover:text-[#0097a7]"
            >
              {label}
            </NavLink>
          ))}

          <NavButton
            name={loading ? "Logging out..." : "LOG OUT"}
            click={handleLogout}
            disabled={loading}
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
