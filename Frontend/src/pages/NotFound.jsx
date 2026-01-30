import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-white px-4">
      {/* Illustration */}
      <div className="max-w-sm w-full mb-8">
        <img
          src="https://undraw.co/api/illustrations/404?color=10b981"
          alt="404 Illustration"
          className="w-full h-auto"
        />
      </div>

      <h1 className="text-6xl font-extrabold text-gray-800 mb-4">404</h1>

      <p className="text-xl sm:text-2xl text-gray-600 mb-6 text-center">
        Oops! The page you’re looking for doesn’t exist.
      </p>

      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-md"
      >
        <ArrowLeft size={20} />
        Go Back Home
      </button>
    </div>
  );
};

export default NotFound;
