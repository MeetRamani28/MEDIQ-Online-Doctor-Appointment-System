import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Stethoscope } from "lucide-react";

const LoadingScreen = () => {
  const [slowLoading, setSlowLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSlowLoading(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-sm w-full border border-blue-100/60 relative overflow-hidden"
      >
        {/* Subtle Background Glow */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-indigo-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* Animated Medical Icon & Pulse Ring */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Outer Pulsing Aura */}
          <motion.div
            animate={{ scale: [1, 1.35, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-20 h-20 bg-blue-500/15 rounded-full"
          />

          {/* Rotating Gradient Border Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-full border-2 border-transparent border-t-blue-600 border-r-indigo-500 border-b-cyan-400 p-1 flex items-center justify-center shadow-md shadow-blue-500/10"
          >
            <div className="w-full h-full bg-blue-50 rounded-full flex items-center justify-center">
              <Stethoscope className="w-7 h-7 text-blue-600" />
            </div>
          </motion.div>
        </div>

        {/* Heading */}
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 bg-clip-text text-transparent mb-2">
          MEDIQ Online
        </h2>

        {/* Sub-text */}
        <motion.p
          key={slowLoading ? "slow" : "fast"}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-600 text-sm font-medium mb-4 min-h-[40px] flex items-center justify-center"
        >
          {slowLoading
            ? "Connecting to medical server... (Waking up Render instance)"
            : "Initializing healthcare portal..."}
        </motion.p>

        {/* Animated Pulse Waves */}
        <div className="flex items-center gap-1.5 mb-5">
          <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scaleY: [0.6, 1.4, 0.6], opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
                className="w-1.5 h-4 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600"
              />
            ))}
          </div>
        </div>

        {/* Footer info tag */}
        <p className="text-[11px] text-gray-400 font-medium tracking-wide">
          {slowLoading
            ? "⚡ Free-tier host warming up (~15s) — thank you for your patience!"
            : "✨ Fast & Secure Doctor Appointment Platform"}
        </p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
