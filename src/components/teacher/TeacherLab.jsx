import { motion } from "framer-motion";
import { Award, BookOpen, GraduationCap, Sparkles, Users } from "lucide-react";

const motionWords = ["curate", "review", "evaluate", "guide", "inspire"];

export default function TeacherLab() {
  return (
    <div className="relative mx-auto h-[330px] w-full max-w-[520px] sm:h-[390px]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 44, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 h-[270px] w-[270px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#BFD2C8] sm:h-[320px] sm:w-[320px]"
        aria-hidden="true"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 56, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 h-[205px] w-[205px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#F0D5C5] sm:h-[245px] sm:w-[245px]"
        aria-hidden="true"
      />

      {/* Central Geometric Studio Badge with Floating Motion (No Images) */}
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, 1.2, 0] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 grid h-40 w-40 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[42%_58%_55%_45%/45%_42%_58%_55%] bg-[#CFE8DD] shadow-[0_28px_70px_rgba(76,112,95,0.16)] sm:h-48 sm:w-48"
      >
        <div className="text-center">
          <GraduationCap size={40} strokeWidth={1.8} className="mx-auto text-[#24332D]" />
          <p className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[#24332D]">
            Studio
          </p>
          <p className="mt-0.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#61786D]">
            Teacher Lab
          </p>
        </div>
      </motion.div>

      {motionWords.map((word, index) => {
        const positions = [
          "left-[3%] top-[18%]",
          "right-[1%] top-[15%]",
          "left-[7%] bottom-[14%]",
          "right-[3%] bottom-[18%]",
          "left-1/2 top-[3%] -translate-x-1/2",
        ];

        return (
          <motion.span
            key={word}
            animate={{ y: [0, index % 2 === 0 ? -6 : 6, 0] }}
            transition={{
              duration: 4.6 + index * 0.35,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.22,
            }}
            className={`absolute ${positions[index]} rounded-full border border-[#DDE5E0] bg-white/[0.88] px-3.5 py-1.5 text-[11px] font-extrabold tracking-[-0.01em] text-[#52625B] shadow-[0_10px_28px_rgba(36,51,45,0.06)] backdrop-blur-sm select-none pointer-events-none`}
          >
            {word}
          </motion.span>
        );
      })}

      <span className="absolute bottom-[4%] left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#24332D]" />
      <span className="absolute left-[20%] top-[43%] h-3 w-3 rounded-full bg-[#F4D7C5]" />
      <span className="absolute right-[16%] top-[51%] h-2.5 w-2.5 rounded-full bg-[#9FCFBB]" />
    </div>
  );
}
