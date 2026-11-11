import { motion } from "framer-motion";
import { getChapterTheme } from "../../data/chapterThemes";
import { CHAPTER4_ASSETS } from "../../data/chapter4Assets";
import DreamDecor from "./DreamDecor";

import ch1Hero from "../../assets/chapter 1/step 1/assets/card-character.png";
import ch2Hero from "../../assets/chapter 2/step 1/assets/card-friends-group.png";
import ch3Hero from "../../assets/chapter 3/step 1/assets/card-healthy-girl.png";
import ch5Hero from "../../assets/chapter 1/step 4/assets/card-handshake-pair.png";

const chapterImages = {
  1: ch1Hero,
  2: ch2Hero,
  3: ch3Hero,
  4: CHAPTER4_ASSETS.orang,
  5: ch5Hero,
};

const words = {
  1: ["detail", "personality", "describe"],
  2: ["before", "then", "finally"],
  3: ["first", "next", "finally"],
  4: ["thesis", "reason", "opinion"],
  5: ["conflict", "choice", "story"],
};

export default function ChapterArtwork({ chapterId, title }) {
  const theme = getChapterTheme(chapterId);
  const heroImage = chapterImages[chapterId] ?? ch1Hero;
  const orbitWords = words[chapterId] ?? ["learn", "practice", "grow"];

  if (Number(chapterId) === 4) {
    return <NightHeroScene title={title} theme={theme} orbitWords={orbitWords} />;
  }

  return (
    <div className="relative mx-auto h-[320px] w-full max-w-[470px] sm:h-[370px]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 44, ease: "linear", repeat: Infinity }}
        style={{ borderColor: theme?.borderSoft || "#BED5C9" }}
        className="absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed sm:h-[290px] sm:w-[290px]"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 58, ease: "linear", repeat: Infinity }}
        style={{ borderColor: theme?.border || "#EBD6C9" }}
        className="absolute left-1/2 top-1/2 h-[190px] w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-full border sm:h-[220px] sm:w-[220px]"
      />

      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, 1.2, 0] }}
        transition={{ duration: 5.2, ease: "easeInOut", repeat: Infinity }}
        className="absolute left-1/2 top-1/2 flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 z-10"
      >
        <div className="relative">
          <div
            style={{ backgroundColor: theme?.primary || "#CFE8DD" }}
            className="absolute inset-0 rounded-full opacity-60 blur-2xl -z-10"
          />
          <img
            src={heroImage}
            alt={title}
            className="w-40 sm:w-48 h-auto max-h-56 object-contain drop-shadow-[0_22px_45px_rgba(36,51,45,0.22)] select-none pointer-events-none"
          />
        </div>
      </motion.div>

      {orbitWords.map((word, index) => {
        const positions = [
          "left-[1%] top-[18%]",
          "right-[1%] top-[20%]",
          "bottom-[8%] left-1/2 -translate-x-1/2",
        ];
        return (
          <motion.span
            key={word}
            animate={{ y: [0, index % 2 === 0 ? -5 : 5, 0] }}
            transition={{ duration: 4.5 + index * 0.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
            style={{
              borderColor: theme?.borderSoft,
              color: theme?.primaryDark,
            }}
            className={`absolute ${positions[index]} z-20 rounded-full border bg-white/90 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] shadow-[0_10px_26px_rgba(36,51,45,0.06)] backdrop-blur-sm select-none pointer-events-none`}
          >
            {word}
          </motion.span>
        );
      })}

      <span
        style={{ backgroundColor: theme?.accent || "#F4D7C5" }}
        className="absolute bottom-[26%] left-[11%] h-3 w-3 rounded-full opacity-80"
      />
      <span
        style={{ backgroundColor: theme?.primary || "#9FCFBB" }}
        className="absolute right-[12%] top-[49%] h-2.5 w-2.5 rounded-full opacity-80"
      />
      <span className="sr-only">Visual motif for {title}</span>
    </div>
  );
}

function NightHeroScene({ title, theme, orbitWords }) {
  const positions = [
    "left-0 top-[8%]",
    "right-0 top-[12%]",
    "bottom-[2%] left-1/2 -translate-x-1/2",
  ];

  return (
    <div className="relative mx-auto h-[360px] w-full max-w-[520px] sm:h-[420px]">
      <div
        className="absolute left-1/2 top-[56%] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl sm:h-64 sm:w-64"
        style={{ backgroundColor: theme.primary }}
      />
      <span className="absolute left-[8%] top-[22%] h-24 w-24 rounded-[42%] bg-pink-200/50 blur-2xl" />
      <span className="absolute right-[10%] bottom-[18%] h-20 w-20 rounded-full bg-violet-200/50 blur-2xl" />

      <DreamDecor
        src={CHAPTER4_ASSETS.bulan}
        className="absolute left-0 top-2 z-20 w-20 sm:w-24"
        blob="cream"
        duration={6.4}
      />
      <DreamDecor
        src={CHAPTER4_ASSETS.awan}
        className="absolute -right-2 top-6 z-10 w-24 sm:w-28"
        blob="pink"
        duration={7.6}
        delay={0.4}
      />
      <DreamDecor
        src={CHAPTER4_ASSETS.bintang}
        className="absolute right-[18%] top-0 z-20 w-14 sm:w-16"
        blob="cream"
        duration={5.2}
      />
      <DreamDecor
        src={CHAPTER4_ASSETS.alarm}
        className="absolute bottom-6 left-1 z-20 w-16 sm:bottom-8 sm:w-20"
        blob="violet"
        duration={5.6}
        delay={0.3}
      />
      <DreamDecor
        src={CHAPTER4_ASSETS.bintang}
        className="absolute bottom-10 right-2 z-20 w-12 sm:w-14"
        blob="pink"
        duration={6.8}
        delay={0.8}
      />

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5.4, ease: "easeInOut", repeat: Infinity }}
        className="absolute left-1/2 top-[54%] z-10 w-[220px] -translate-x-1/2 -translate-y-1/2 sm:w-[260px]"
      >
        <span className="absolute left-1/2 top-[62%] h-16 w-40 -translate-x-1/2 rounded-full bg-violet-300/50 blur-2xl" />
        <img
          src={CHAPTER4_ASSETS.orang}
          alt=""
          className="relative z-10 h-auto w-full object-contain drop-shadow-[0_22px_40px_rgba(91,33,182,0.22)] select-none pointer-events-none"
        />
      </motion.div>

      {orbitWords.map((word, index) => (
        <motion.span
          key={word}
          animate={{ y: [0, index % 2 === 0 ? -6 : 6, 0] }}
          transition={{ duration: 4.2 + index * 0.4, repeat: Infinity, ease: "easeInOut", delay: index * 0.15 }}
          className={`absolute ${positions[index]} z-20 rounded-full border border-violet-200 bg-white/95 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#5B21B6] shadow-[0_10px_26px_rgba(91,33,182,0.12)] select-none pointer-events-none`}
        >
          {word}
        </motion.span>
      ))}

      <span className="sr-only">Visual motif for {title}</span>
    </div>
  );
}
