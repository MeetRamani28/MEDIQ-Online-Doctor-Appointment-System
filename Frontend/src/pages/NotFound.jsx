import { useNavigate } from "react";
import { motion } from "framer-motion";
import { Stethoscope, ArrowLeft, Home, FileQuestion, HelpCircle, Activity } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Animated Blurs */}
      <div className="absolute top-1/4 left-1/3 w-[450px] h-[450px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Central Glass Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-lg w-full bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl text-center relative z-10"
      >
        {/* Animated Icon Badge */}
        <div className="relative mb-6 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-24 h-24 bg-blue-500/20 rounded-full"
          />
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/25 relative z-10">
            <FileQuestion className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* 404 Large Header */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-7xl font-black bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500 bg-clip-text text-transparent mb-2 tracking-tight"
        >
          404
        </motion.h1>

        {/* Subtitle */}
        <h2 className="text-xl font-bold text-white mb-2">
          Page Not Found
        </h2>

        <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          The medical resource or page you are searching for does not exist or has been relocated within the MEDIQ network.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/")}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </motion.button>
        </div>

        {/* Footer info */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-blue-400" />
            <span>MEDIQ Healthcare</span>
          </div>
          <div className="flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>System Operational</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
