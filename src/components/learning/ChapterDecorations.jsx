import DreamDecor from "./DreamDecor";
import { CHAPTER4_ASSETS } from "../../data/chapter4Assets";

export default function ChapterDecorations({ chapterId, variant = "default" }) {
  const isDream = Number(chapterId) === 4 && (variant === "landing" || variant === "session");
  const muted = variant === "session";

  if (!isDream) {
    return (
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(148, 163, 184, 0.12) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(148, 163, 184, 0.12) 1px, transparent 1px)
            `,
            backgroundSize: "28px 28px",
          }}
        />
      </div>
    );
  }

  const layerOpacity = muted ? 0.72 : 1;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      aria-hidden="true"
      style={{ opacity: layerOpacity }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #FCE7F3 0%, #F3E8FF 22%, #EDE9FE 48%, #F5F3FF 78%, #FDF2F8 100%)",
        }}
      />

      <svg className="absolute -left-24 -top-16 h-[420px] w-[720px] opacity-90" viewBox="0 0 720 420" fill="none">
        <path
          d="M0 220C80 140 160 90 280 120C400 150 430 40 560 70C650 92 700 40 720 20V0H0V220Z"
          fill="#FBCFE8"
          opacity="0.55"
        />
        <path
          d="M0 280C120 200 210 170 330 200C470 236 500 110 640 150C690 166 720 120 720 120V70C680 90 600 160 470 130C340 100 300 220 170 190C80 168 30 210 0 240V280Z"
          fill="#C4B5FD"
          opacity="0.5"
        />
      </svg>

      <svg className="absolute -right-10 top-24 h-[380px] w-[640px] opacity-80" viewBox="0 0 640 380" fill="none">
        <path
          d="M640 0C560 80 500 70 400 110C280 160 300 40 180 80C80 112 40 40 0 20V0H640Z"
          fill="#DDD6FE"
        />
        <path
          d="M640 90C540 150 500 120 390 170C260 230 300 90 170 140C80 172 40 90 0 70V20C70 60 140 160 270 110C400 60 390 200 520 150C580 126 620 150 640 160V90Z"
          fill="#F9A8D4"
          opacity="0.28"
        />
      </svg>

      <svg className="absolute -bottom-10 left-[-8%] h-[280px] w-[70%] opacity-80" viewBox="0 0 900 280" fill="none">
        <path
          d="M0 180C120 120 200 210 340 160C490 106 520 200 680 150C790 116 860 170 900 140V280H0V180Z"
          fill="#DDD6FE"
        />
        <path
          d="M0 230C140 180 230 250 380 200C540 146 560 240 720 190C820 156 870 220 900 200V280H0V230Z"
          fill="#C4B5FD"
          opacity="0.45"
        />
      </svg>

      <svg className="absolute -bottom-6 right-[-6%] h-[240px] w-[48%] opacity-75" viewBox="0 0 640 240" fill="none">
        <path
          d="M640 80C540 140 470 70 360 120C230 180 250 60 120 110C50 140 20 90 0 80V240H640V80Z"
          fill="#FCE7F3"
        />
      </svg>

      <span className="absolute left-[12%] top-[18%] h-40 w-40 rounded-full bg-violet-200/40 blur-3xl" />
      <span className="absolute right-[10%] top-[36%] h-48 w-48 rounded-full bg-pink-200/35 blur-3xl" />
      <span className="absolute bottom-[12%] left-[40%] h-36 w-36 rounded-[42%] bg-fuchsia-200/30 blur-3xl" />

      <DreamDecor
        src={CHAPTER4_ASSETS.awan}
        className="absolute left-[-2%] top-16 w-28 sm:left-4 sm:top-20 sm:w-36 lg:w-44"
        blob="white"
        duration={7.2}
      />
      <DreamDecor
        src={CHAPTER4_ASSETS.awan}
        className="absolute right-[-4%] top-28 w-32 sm:right-6 sm:w-40 lg:w-48"
        blob="pink"
        duration={8.1}
        delay={0.6}
        rotate={8}
      />
      <DreamDecor
        src={CHAPTER4_ASSETS.bulan}
        className="absolute left-3 top-[28%] w-20 sm:left-8 sm:w-28 lg:left-10 lg:w-32"
        blob="cream"
        duration={6.8}
      />
      <DreamDecor
        src={CHAPTER4_ASSETS.bintang}
        className="absolute right-[14%] top-[18%] w-16 sm:w-20"
        blob="cream"
        duration={5.4}
        delay={0.3}
      />
      <DreamDecor
        src={CHAPTER4_ASSETS.bintang}
        className="absolute left-[18%] bottom-[22%] w-12 sm:w-16"
        blob="cream"
        opacity={0.85}
        duration={6}
        delay={1.1}
      />
      <DreamDecor
        src={CHAPTER4_ASSETS.alarm}
        className="absolute bottom-8 left-4 w-16 sm:bottom-12 sm:left-10 sm:w-20 lg:w-24"
        blob="violet"
        duration={5.8}
        delay={0.4}
      />
      <DreamDecor
        src={CHAPTER4_ASSETS.bintang}
        className="absolute bottom-16 right-8 w-14 sm:right-14 sm:w-18"
        blob="pink"
        duration={7}
        delay={0.9}
      />
      {!muted && (
        <DreamDecor
          src={CHAPTER4_ASSETS.awan}
          className="absolute bottom-[8%] right-[28%] hidden w-28 lg:block"
          blob="lavender"
          opacity={0.7}
          duration={9}
        />
      )}
    </div>
  );
}
