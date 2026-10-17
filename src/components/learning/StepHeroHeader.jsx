import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Maximize2, X, Lightbulb, CheckCircle2, Bookmark, Compass } from "lucide-react";

export default function StepHeroHeader({ asset, currentStep, totalSteps = 6, isReady = false }) {
  const [showFullImage, setShowFullImage] = useState(false);

  if (!asset) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative mb-8 overflow-hidden rounded-[36px] bg-gradient-to-br from-[#FBFCF8] via-[#F4F9F6] to-[#EAF4EF] border border-[#DCE8E1] p-6 shadow-sm sm:p-8"
      >
        {/* Soft atmospheric organic gradient shapes matching reference style */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 left-1/4 h-56 w-56 rounded-full bg-amber-200/35 blur-2xl" />
        <div className="pointer-events-none absolute top-1/2 right-1/3 h-40 w-40 rounded-full bg-sky-200/30 blur-2xl" />

        <div className="relative z-10 flex flex-col-reverse gap-8 md:flex-row md:items-center md:justify-between">
          {/* Left Hero Guidance in English */}
          <div className="max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-white/95 px-3.5 py-1 text-xs font-black tracking-wide text-[#24332D] shadow-xs backdrop-blur-md">
                <Sparkles size={13} className="text-amber-500 animate-pulse" />
                {asset.badge}
              </span>

              {isReady && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-black text-white shadow-xs"
                >
                  <CheckCircle2 size={12} /> Step Completed!
                </motion.span>
              )}
            </div>

            <h2 className="mt-3.5 text-2xl font-black tracking-[-0.035em] text-[#1E2E27] sm:text-3xl lg:text-[2rem] leading-tight">
              {asset.title}
            </h2>

            {/* Motivational Tip & Strategy */}
            <div className="mt-4 inline-flex items-start gap-3 rounded-2xl border border-white/80 bg-white/90 p-4 text-xs font-semibold leading-relaxed text-[#4A5D54] shadow-xs backdrop-blur-sm sm:text-sm">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-700">
                <Lightbulb size={13} />
              </span>
              <div>
                <span className="block text-[10px] font-black uppercase tracking-wider text-amber-800">
                  Mission Pro-Tip
                </span>
                <p className="mt-0.5 text-slate-600">{asset.tip}</p>
              </div>
            </div>
          </div>

          {/* Right Seamless Integrated Illustration with Floating Badges */}
          <div className="relative mx-auto shrink-0 md:mx-0">
            {/* Ambient halo glow */}
            <div className="absolute inset-0 -m-3 rounded-3xl bg-gradient-to-tr from-emerald-300/30 via-teal-200/20 to-amber-200/30 blur-xl" />

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
              className="group relative cursor-pointer overflow-hidden rounded-[26px] border-4 border-white bg-white shadow-lg transition-all duration-300 hover:shadow-2xl"
              onClick={() => setShowFullImage(true)}
            >
              <img
                src={asset.image}
                alt={asset.title}
                className="h-48 w-72 object-cover transition-transform duration-500 group-hover:scale-105 sm:h-52 sm:w-80"
              />

              {/* Seamless Bottom Gradient & Tag */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 flex items-center justify-between text-white">
                <span className="text-[10px] font-black uppercase tracking-wider text-white/90">
                  Step {String(currentStep).padStart(2, "0")} / 0{totalSteps}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold backdrop-blur-xs">
                  <Maximize2 size={10} /> Zoom
                </span>
              </div>
            </motion.div>

            {/* Floating Achievement Badge Top-Left (Reference Image Style) */}
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              className="absolute -left-3 -top-3 rounded-full border border-white/80 bg-white/95 px-3 py-1 shadow-md backdrop-blur-md hidden sm:flex items-center gap-1.5 text-[10px] font-black text-emerald-800"
            >
              <Compass size={11} className="text-emerald-600" /> English Focus
            </motion.div>

            {/* Floating Tag Bottom-Right */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 0.5 }}
              className="absolute -right-2 -bottom-2 rounded-full border border-white/80 bg-white/95 px-3 py-1 shadow-md backdrop-blur-md hidden sm:flex items-center gap-1.5 text-[10px] font-black text-[#24332D]"
            >
              <Bookmark size={11} className="text-amber-500" /> Active Learning
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Lightbox Modal */}
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
                aria-label="Close"
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
