import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Maximize2, X, Lightbulb, CheckCircle2 } from "lucide-react";

export default function StepHeroHeader({ asset, currentStep, totalSteps = 6, isReady = false }) {
  const [showFullImage, setShowFullImage] = useState(false);

  if (!asset) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`relative mb-8 overflow-hidden rounded-[28px] border border-black/5 bg-gradient-to-br ${asset.gradient} p-5 shadow-sm sm:p-7`}
      >
        {/* Playful background decorative bubbles */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/40 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 left-1/3 h-36 w-36 rounded-full bg-white/30 blur-xl" />

        <div className="relative z-10 flex flex-col-reverse gap-6 md:flex-row md:items-center md:justify-between">
          {/* Left Text & Cheerful Guidance */}
          <div className="max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1 text-xs font-black tracking-wide text-[#24332D] shadow-xs backdrop-blur-md">
                <Sparkles size={13} className="text-amber-500 animate-pulse" />
                {asset.badge}
              </span>

              {isReady && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-black text-white shadow-xs"
                >
                  <CheckCircle2 size={12} /> Selesai!
                </motion.span>
              )}
            </div>

            <h2 className="mt-3 text-2xl font-black tracking-[-0.035em] text-[#1E2E27] sm:text-3xl">
              {asset.title}
            </h2>

            {/* Friendly Mascot Tip Speech Bubble */}
            <div className="mt-3.5 inline-flex items-start gap-2.5 rounded-2xl bg-white/85 px-4 py-3 text-xs font-semibold leading-relaxed text-[#4A5D54] shadow-xs backdrop-blur-sm sm:text-sm">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-700">
                <Lightbulb size={12} />
              </span>
              <p>{asset.tip}</p>
            </div>
          </div>

          {/* Right Themed Illustration Card */}
          <div className="relative mx-auto shrink-0 md:mx-0">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-white/80 shadow-md transition-all duration-300 hover:shadow-xl"
              onClick={() => setShowFullImage(true)}
            >
              <img
                src={asset.image}
                alt={asset.title}
                className="h-44 w-72 object-cover transition-transform duration-500 group-hover:scale-105 sm:h-48 sm:w-80"
              />

              {/* Hover overlay hint */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 backdrop-blur-xs transition-opacity duration-200 group-hover:opacity-100">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#24332D] shadow-md">
                  <Maximize2 size={13} /> Perbesar Gambar
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Lightbox Modal for students to view the detailed illustration */}
      <AnimatePresence>
        {showFullImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            onClick={() => setShowFullImage(false)}
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
                onClick={() => setShowFullImage(false)}
                className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white transition-transform hover:scale-110 hover:bg-black/80"
                aria-label="Tutup"
              >
                <X size={18} />
              </button>
              <img
                src={asset.image}
                alt={asset.title}
                className="max-h-[82vh] w-full rounded-2xl object-contain"
              />
              <div className="p-3 text-center">
                <p className="text-sm font-extrabold text-[#24332D]">{asset.title}</p>
                <p className="text-xs text-[#6B7972]">{asset.tip}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
