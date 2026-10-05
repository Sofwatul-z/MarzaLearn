import { motion } from "framer-motion";
import Logo from "./Logo";

export default function Loader({ fullscreen = false, label = "Loading..." }) {
  return (
    <div
      className={`flex items-center justify-center ${
        fullscreen ? "ml-app-shell min-h-screen" : "min-h-40"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="relative flex flex-col items-center gap-4 text-center">
        {fullscreen && <Logo compact className="mb-1 pointer-events-none" />}
        <div className="relative h-11 w-11">
          <div className="absolute inset-0 rounded-full border-[3px] border-[#DCEBE4]" />
          <motion.div
            className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#24332D]"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.82, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <p className="text-sm font-semibold text-[#6C7973]">{label}</p>
      </div>
    </div>
  );
}
