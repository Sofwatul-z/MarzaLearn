import { motion } from "framer-motion";
import {
  Activity,
  BookOpenCheck,
  ListChecks,
  MessageSquareQuote,
  TimerReset,
} from "lucide-react";

import ch1Hero from "../../assets/chapter 1/step 1/assets/card-character.png";
import ch2Hero from "../../assets/chapter 2/step 1/assets/card-friends-group.png";
import ch3Hero from "../../assets/chapter 3/step 1/assets/card-healthy-girl.png";
import ch4Hero from "../../assets/chapter 1/step 6/assets/card-medalist.png";
import ch5Hero from "../../assets/chapter 1/step 4/assets/card-handshake-pair.png";

const chapterImages = {
  1: ch1Hero,
  2: ch2Hero,
  3: ch3Hero,
  4: ch4Hero,
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
  const heroImage = chapterImages[chapterId] ?? ch1Hero;
  const orbitWords = words[chapterId] ?? ["learn", "practice", "grow"];

  return (
    <div className="relative mx-auto h-[320px] w-full max-w-[470px] sm:h-[370px]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 44, ease: "linear", repeat: Infinity }}
        className="absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#BED5C9] sm:h-[290px] sm:w-[290px]"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 58, ease: "linear", repeat: Infinity }}
        className="absolute left-1/2 top-1/2 h-[190px] w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#EBD6C9] sm:h-[220px] sm:w-[220px]"
      />

      {/* Floating Center Artwork */}
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, 1.2, 0] }}
        transition={{ duration: 5.2, ease: "easeInOut", repeat: Infinity }}
        className="absolute left-1/2 top-1/2 flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 z-10"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-[#CFE8DD]/60 blur-xl -z-10" />
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
            className={`absolute ${positions[index]} z-20 rounded-full border border-[#DDE5E0] bg-white/90 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#55675E] shadow-[0_10px_26px_rgba(36,51,45,0.06)] backdrop-blur-sm select-none pointer-events-none`}
          >
            {word}
          </motion.span>
        );
      })}

      <span className="absolute bottom-[26%] left-[11%] h-3 w-3 rounded-full bg-[#F4D7C5]" />
      <span className="absolute right-[12%] top-[49%] h-2.5 w-2.5 rounded-full bg-[#9FCFBB]" />
      <span className="sr-only">Visual motif for {title}</span>
    </div>
  );
}
