import { motion } from "framer-motion";
import {
  Activity,
  BookOpenCheck,
  ListChecks,
  MessageSquareQuote,
  TimerReset,
} from "lucide-react";

const chapterIcons = {
  1: Activity,
  2: TimerReset,
  3: ListChecks,
  4: MessageSquareQuote,
  5: BookOpenCheck,
};

const words = {
  1: ["detail", "personality", "describe"],
  2: ["before", "then", "finally"],
  3: ["first", "next", "finally"],
  4: ["thesis", "reason", "opinion"],
  5: ["conflict", "choice", "story"],
};

export default function ChapterArtwork({ chapterId, title }) {
  const Icon = chapterIcons[chapterId] ?? BookOpenCheck;
  const orbitWords = words[chapterId] ?? ["learn", "practice", "grow"];

  return (
    <div className="relative mx-auto h-[300px] w-full max-w-[470px] sm:h-[350px]">
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

      <motion.div
        animate={{ y: [0, -7, 0], rotate: [0, 1.2, 0] }}
        transition={{ duration: 5.8, ease: "easeInOut", repeat: Infinity }}
        className="absolute left-1/2 top-1/2 grid h-40 w-40 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[42%_58%_56%_44%/46%_43%_57%_54%] bg-[#CFE8DD] shadow-[0_26px_70px_rgba(72,104,90,0.16)] sm:h-48 sm:w-48"
      >
        <div className="text-center">
          <Icon size={38} strokeWidth={1.8} className="mx-auto text-[#24332D]" />
          <span className="mt-3 block text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#5A7165]">
            Chapter {String(chapterId).padStart(2, "0")}
          </span>
        </div>
      </motion.div>

      {orbitWords.map((word, index) => {
        const positions = [
          "left-[2%] top-[18%]",
          "right-[2%] top-[22%]",
          "bottom-[9%] left-1/2 -translate-x-1/2",
        ];
        return (
          <motion.span
            key={word}
            animate={{ y: [0, index % 2 === 0 ? -5 : 5, 0] }}
            transition={{ duration: 4.5 + index * 0.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
            className={`absolute ${positions[index]} rounded-full border border-[#DDE5E0] bg-white/80 px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#607068] shadow-[0_10px_26px_rgba(36,51,45,0.05)] backdrop-blur-sm`}
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
