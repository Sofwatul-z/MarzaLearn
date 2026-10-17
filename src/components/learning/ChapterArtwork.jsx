import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Maximize2, X } from "lucide-react";
import { getStepAsset } from "../../data/stepAssets";

export default function ChapterArtwork({ chapterId, title }) {
  const asset = getStepAsset(chapterId, 1);
  const [showFull, setShowFull] = useState(false);

  return (
    <>
      <div className="relative mx-auto w-full max-w-[480px]">
        {/* Playful background glowing orbs */}
        <div className="absolute -left-6 -top-6 h-48 w-48 rounded-full bg-emerald-200/40 blur-2xl pointer-events-none" />
        <div className="absolute -right-6 -bottom-6 h-44 w-44 rounded-full bg-amber-200/40 blur-2xl pointer-events-none" />

        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="group relative cursor-pointer overflow-hidden rounded-[28px] border-4 border-white bg-white shadow-xl transition-all duration-300 hover:shadow-2xl"
          onClick={() => setShowFull(true)}
        >
          <img
            src={asset.image}
            alt={title}
            className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-72"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent p-5 flex flex-col justify-end text-white">
            <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider backdrop-blur-md">
              <Sparkles size={11} className="text-amber-300" /> {asset.badge}
            </span>
            <p className="mt-1 text-base font-black tracking-tight text-white drop-shadow-sm">{asset.title}</p>
          </div>

          <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 backdrop-blur-xs transition-opacity duration-200 group-hover:opacity-100">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#24332D] shadow-md">
              <Maximize2 size={13} /> Lihat Gambar Lengkap
            </span>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showFull && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            onClick={() => setShowFull(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-3xl bg-white p-2 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowFull(false)}
                className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white transition-transform hover:scale-110 hover:bg-black/80"
              >
                <X size={18} />
              </button>
              <img
                src={asset.image}
                alt={title}
                className="max-h-[82vh] w-full rounded-2xl object-contain"
              />
              <div className="p-3 text-center">
                <p className="text-sm font-extrabold text-[#24332D]">{title} — {asset.title}</p>
                <p className="text-xs text-[#6B7972]">{asset.tip}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
