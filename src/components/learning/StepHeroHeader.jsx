import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, Lightbulb, CheckCircle2, Sparkles } from "lucide-react";
import { getChapterTheme } from "../../data/chapterThemes";

/**
 * StepHeroHeader — Environmental Full-Width Hero Section
 *
 * Sesuai spesifikasi Paket 01 (Badminton Warm-up):
 * - Lapisan ilustrasi full-width (di luar container max-width konten).
 * - Tidak dibungkus kartu rounded; latar menyatu dengan ivory #F8F5EC.
 * - Desktop: hero-desktop (rasio asli 3:2), teks di area tenang kiri (6-40%).
 * - Karakter sudah ada di dalam hero; tidak menambahkan character.png di atasnya.
 * - Mobile: hero-mobile (rasio 2:3), teks berada dalam alur normal di atas gambar.
 * - Sambungan bawah dengan transisi ringan pada lantai tanpa memudarkan kaki.
 * - Dekorasi: racket-shuttle di tepi kosong transisi kiri, shuttlecock di tepi kanan.
 */
export default function StepHeroHeader({
  asset,
  currentStep,
  totalSteps = 6,
  isReady = false,
  chapterId = 1,
}) {
  const [showFullImage, setShowFullImage] = useState(false);

  if (!asset) return null;

  const theme = getChapterTheme(chapterId);
  const isBadmintonTheme = chapterId === 1 && asset.heroDesktop;

  // Asset sources (optimized WebP with fallback to main image)
  const heroDesktopSrc = asset.heroDesktop || asset.image;
  const heroMobileSrc = asset.heroMobile || asset.image;
  const racketShuttle = asset.decorations?.racketShuttle;
  const shuttlecock = asset.decorations?.shuttlecock;

  return (
    <>
      {/* ========================================================================= */}
      {/* FULL-WIDTH HERO LAYER (BREAKOUT OUTSIDE MAX-WIDTH CONTAINER ON DESKTOP)    */}
      {/* ========================================================================= */}
      <section
        className="relative w-full lg:left-1/2 lg:right-1/2 lg:-ml-[50vw] lg:-mr-[50vw] lg:w-screen lg:max-w-[100vw] overflow-hidden mb-8 lg:mb-10 transition-colors"
        style={{ backgroundColor: theme.heroBg }}
        aria-label="Chapter learning hero"
      >
        {isBadmintonTheme ? (
          /* ======================================================================= */
          /* 01-BADMINTON-WARMUP SPECIALIZED FULL-BLEED COMPOSITION                   */
          /* ======================================================================= */
          <div className="relative w-full">
            {/* ------------------------------------------------------------------- */}
            {/* DESKTOP (>= 1024px): 3:2 Aspect Hero with Text in Quiet Left Zone    */}
            {/* ------------------------------------------------------------------- */}
            <div className="hidden lg:block relative w-full overflow-hidden">
              {/* Background Full-Width Image Container */}
              <div className="relative w-full max-w-[1920px] mx-auto aspect-[3/2] max-h-[820px] min-h-[580px]">
                <img
                  src={heroDesktopSrc}
                  alt="Badminton player warming up on court"
                  className="absolute inset-0 h-full w-full object-cover object-right-bottom select-none"
                  fetchPriority="high"
                />

                {/* Light Transition Blend only at bottom court floor without fading feet/shoes */}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#F8F5EC] via-[#F8F5EC]/40 to-transparent"
                  aria-hidden="true"
                />

                {/* Left ambient sunlight soft extension into ivory background */}
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#F8F5EC] to-transparent"
                  aria-hidden="true"
                />

                {/* HTML Text Overlay strictly positioned in the quiet left zone (6% to 40%) */}
                <div className="absolute inset-0 z-10 flex items-center">
                  <div className="w-full max-w-[1240px] mx-auto px-8 lg:px-12">
                    <div className="max-w-[480px] xl:max-w-[520px] py-10">
                      {/* Step Pill */}
                      <div className="inline-flex items-center gap-2 rounded-full bg-[#183B40] px-4 py-1.5 text-xs font-black tracking-wider text-white shadow-sm">
                        <Sparkles size={13} className="text-[#63B7A8]" />
                        <span className="font-mono text-[11px] tracking-widest text-[#F8F5EC]">
                          STEP 0{currentStep}
                        </span>
                        <span className="text-white/40">·</span>
                        <span className="uppercase text-[11px] text-[#F8F5EC]">
                          {asset.badge.split("·")[1]?.trim() || asset.badge}
                        </span>
                      </div>

                      {/* Title */}
                      <h1 className="mt-4 text-3xl xl:text-4xl font-extrabold tracking-[-0.04em] text-[#183B40] leading-[1.15]">
                        {asset.title}
                      </h1>

                      {/* Educational Focus Tip Box */}
                      <div className="mt-5 relative overflow-hidden rounded-2xl border border-[#63B7A8]/30 bg-white/90 p-4 xl:p-5 shadow-xs backdrop-blur-sm">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#D93435]" aria-hidden="true" />
                        <div className="flex items-start gap-3.5 pl-1.5">
                          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#F8F5EC] text-[#183B40] shadow-inner">
                            <Lightbulb size={17} className="text-[#D93435]" />
                          </span>
                          <div>
                            <span className="block text-[10px] font-black uppercase tracking-widest text-[#D93435]">
                              {theme.tipLabel}
                            </span>
                            <p className="mt-1 text-xs xl:text-sm font-semibold leading-relaxed text-[#183B40]">
                              {asset.tip}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Interaction Controls */}
                      <div className="mt-6 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            const el = document.querySelector("[data-step-content]");
                            el?.scrollIntoView({ behavior: "smooth", block: "start" });
                          }}
                          className="inline-flex items-center gap-2 rounded-full bg-[#183B40] px-5 py-2.5 text-sm font-black text-white shadow-md transition-all hover:bg-[#234d54] active:scale-95"
                        >
                          Start activity
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowFullImage(true)}
                          className="inline-flex items-center gap-2 rounded-full border border-[#DDE5E0] bg-white/80 px-4 py-2.5 text-xs font-bold text-[#183B40] shadow-2xs hover:bg-white"
                        >
                          <Maximize2 size={13} />
                          Inspect scene
                        </button>

                        {isReady && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#107C55] px-3.5 py-1 text-xs font-black text-white shadow-xs">
                            <CheckCircle2 size={13} /> Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtle Right Shuttlecock Accent at empty margin */}
                {shuttlecock && (
                  <div
                    className="pointer-events-none absolute right-8 top-16 z-20 hidden xl:block w-20 opacity-85 transition-transform"
                    aria-hidden="true"
                  >
                    <img
                      src={shuttlecock}
                      alt=""
                      className="w-full h-auto object-contain drop-shadow-sm rotate-12"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* MOBILE (< 1024px): Normal Flow — Text on Top, Hero-Mobile Below   */}
            {/* ------------------------------------------------------------------- */}
            <div className="block lg:hidden px-4 sm:px-6 pt-5 pb-6">
              {/* Text in Normal Flow */}
              <div className="max-w-xl mx-auto">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#183B40] px-3 py-1 text-[11px] font-black tracking-wider text-white shadow-sm">
                    <Sparkles size={11} className="text-[#63B7A8]" />
                    <span className="font-mono text-[10px] tracking-widest text-[#F8F5EC]">
                      STEP 0{currentStep}
                    </span>
                    <span className="text-white/40">·</span>
                    <span className="uppercase text-[10px]">
                      {asset.badge.split("·")[1]?.trim() || asset.badge}
                    </span>
                  </div>

                  {isReady && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#107C55] px-2.5 py-0.5 text-[10px] font-black text-white shadow-xs">
                      <CheckCircle2 size={11} /> Done
                    </span>
                  )}
                </div>

                <h1 className="mt-3 text-lg sm:text-2xl font-extrabold tracking-[-0.03em] text-[#183B40] leading-snug">
                  {asset.title}
                </h1>

                {/* Mobile Focus Tip */}
                <div className="mt-3.5 relative overflow-hidden rounded-xl border border-[#63B7A8]/30 bg-white/95 p-3.5 shadow-xs">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D93435]" aria-hidden="true" />
                  <div className="pl-1.5">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-[#D93435]">
                      {theme.tipLabel}
                    </span>
                    <p className="mt-0.5 text-xs font-semibold leading-relaxed text-[#183B40]">
                      {asset.tip}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Hero Image (hero-mobile, ratio 2:3, full width, no clipping) */}
              <div className="mt-5 max-w-md mx-auto relative overflow-hidden rounded-2xl shadow-sm">
                <img
                  src={heroMobileSrc}
                  alt="Badminton player warming up on court"
                  className="w-full h-auto aspect-[2/3] object-cover object-top select-none cursor-pointer"
                  onClick={() => setShowFullImage(true)}
                  loading="eager"
                />

                {/* Light bottom transition without obscuring athlete feet */}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#F8F5EC] via-[#F8F5EC]/30 to-transparent"
                  aria-hidden="true"
                />

                <button
                  type="button"
                  onClick={() => setShowFullImage(true)}
                  className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm"
                >
                  <Maximize2 size={11} />
                  Inspect
                </button>
              </div>
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* Racket-Shuttle Transition Accent on empty left transition boundary   */}
            {/* ------------------------------------------------------------------- */}
            {racketShuttle && (
              <div
                className="pointer-events-none absolute -bottom-8 left-4 z-20 hidden lg:block w-48 xl:w-56 opacity-90 transition-transform hover:scale-105"
                aria-hidden="true"
              >
                <img
                  src={racketShuttle}
                  alt=""
                  className="w-full h-auto object-contain drop-shadow-md -rotate-6"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        ) : (
          /* ======================================================================= */
          /* GENERAL THEME FALLBACK (FOR OTHER CHAPTERS)                              */
          /* ======================================================================= */
          <div className="relative w-full px-6 lg:px-12 py-10 max-w-[1240px] mx-auto">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-black tracking-wider text-white shadow-sm" style={{ backgroundColor: theme.accentPrimary }}>
                  <Sparkles size={12} className="text-yellow-300" />
                  <span className="font-mono text-[11px]">STEP 0{currentStep}</span>
                  <span>·</span>
                  <span className="uppercase text-[11px]">{asset.badge.split("·")[1]?.trim() || asset.badge}</span>
                </div>
                <h1 className="mt-4 text-3xl lg:text-4xl font-extrabold text-[#183B40]">
                  {asset.title}
                </h1>
                <div className={`mt-5 relative overflow-hidden rounded-2xl border ${theme.tipBorder} ${theme.tipBg} p-4 shadow-xs`}>
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${theme.tipAccent}`} aria-hidden="true" />
                  <div className="pl-1.5">
                    <span className={`block text-[11px] font-black uppercase ${theme.tipLabelColor}`}>{theme.tipLabel}</span>
                    <p className="mt-1 text-xs sm:text-sm font-semibold text-[#183B40]">{asset.tip}</p>
                  </div>
                </div>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-sm">
                <img
                  src={asset.image}
                  alt={asset.title}
                  className="h-full w-full object-cover cursor-pointer"
                  onClick={() => setShowFullImage(true)}
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* LIGHTBOX MODAL (Full Resolution Inspection)                                */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showFullImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
            onClick={() => setShowFullImage(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="relative max-h-[92vh] max-w-4xl overflow-hidden rounded-3xl bg-[#183B40] border border-white/20 p-2 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowFullImage(false)}
                className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/70 text-white transition-transform hover:scale-110 hover:bg-black/90"
                aria-label="Close"
              >
                <X size={20} />
              </button>
              <img
                src={heroDesktopSrc}
                alt={asset.title}
                className="max-h-[80vh] w-full rounded-2xl object-contain"
              />
              <div className="p-4 text-center">
                <p className="text-base font-black text-white">{asset.title}</p>
                <p className="text-xs text-[#63B7A8] mt-1">{asset.tip}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
