import { motion } from "framer-motion";
import { Sparkles, ArrowDown, ArrowRight } from "lucide-react";

export default function BouncingGuideArrow({ isReady = false, text = "Hebat! Lanjut ke langkah berikutnya yuk! 🚀", direction = "down" }) {
  if (!isReady) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -8, 0],
      }}
      transition={{
        y: {
          repeat: Infinity,
          duration: 1.2,
          ease: "easeInOut",
        },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
      }}
      className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-400 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 px-4 py-1.5 text-xs font-black text-white shadow-lg shadow-emerald-500/25 select-none"
    >
      <Sparkles size={14} className="text-yellow-200 animate-spin" />
      <span>{text}</span>
      {direction === "down" ? (
        <motion.span
          animate={{ y: [0, 3, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
        >
          <ArrowDown size={14} className="stroke-[3]" />
        </motion.span>
      ) : (
        <motion.span
          animate={{ x: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
        >
          <ArrowRight size={14} className="stroke-[3]" />
        </motion.span>
      )}
    </motion.div>
  );
}
