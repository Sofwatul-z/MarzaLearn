import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function BouncingGuideArrow({
  isReady = false,
  text = "CLICK HERE!",
  subtext = "Ready to proceed!",
  direction = "down",
}) {
  if (!isReady) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 12 }}
      animate={{
        opacity: 1,
        scale: [1, 1.08, 1],
        y: direction === "down" ? [0, -10, 0] : [0, -6, 0],
      }}
      transition={{
        scale: { repeat: Infinity, duration: 1.4, ease: "easeInOut" },
        y: { repeat: Infinity, duration: 1.1, ease: "easeInOut" },
        opacity: { duration: 0.25 },
      }}
      className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-500 to-red-600 p-1.5 pl-3 pr-4 shadow-[0_12px_32px_rgba(220,38,38,0.45)] ring-4 ring-red-400/30 select-none cursor-pointer"
    >
      {/* Animated Red Pointing Hand Icon from Reference Image */}
      <motion.div
        animate={{ y: [0, 4, 0] }}
        transition={{ repeat: Infinity, duration: 0.7, ease: "easeInOut" }}
        className="flex items-center justify-center rounded-xl bg-white p-1.5 shadow-inner"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 fill-red-600 stroke-red-700"
          strokeWidth="1.5"
        >
          {/* Stylized pointing index finger glove */}
          <path d="M9 11V4a2 2 0 0 1 4 0v7h1a1.5 1.5 0 0 1 1.5 1.5v.5h.5a1.5 1.5 0 0 1 1.5 1.5v.5h.5a1.5 1.5 0 0 1 1.5 1.5v3a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6v-5a2 2 0 0 1 2-2h3z" />
        </svg>
      </motion.div>

      <div className="flex flex-col text-left">
        <span className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-yellow-200">
          <Sparkles size={11} className="animate-spin text-yellow-200" />
          {text}
        </span>
        <span className="text-[12px] font-black tracking-tight text-white drop-shadow-sm">
          {subtext}
        </span>
      </div>

      <motion.span
        animate={{ y: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 0.6 }}
        className="text-white text-base font-black"
      >
        👇
      </motion.span>
    </motion.div>
  );
}
