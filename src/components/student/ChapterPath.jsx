import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Circle,
  Clock3,
  FileCheck2,
  FileClock,
  Headphones,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";

const missionMeta = {
  not_started: {
    label: "Not Started",
    icon: Circle,
    className: "border-[#DCE4DF] bg-white text-[#77847E]",
  },
  in_progress: {
    label: "In Progress",
    icon: Clock3,
    className: "border-[#BBD9CC] bg-[#EAF4EF] text-[#48685A]",
  },
  completed: {
    label: "Completed",
    icon: Check,
    className: "border-[#AFCFBE] bg-[#DCEFE6] text-[#315C49]",
  },
};

const projectMeta = {
  not_submitted: { label: "Project not submitted", icon: FileClock },
  draft: { label: "Project draft", icon: FileClock },
  submitted: { label: "Project submitted", icon: FileCheck2 },
  reviewed: { label: "Project reviewed", icon: FileCheck2 },
};

function SemesterSwitch({ semester, onChange }) {
  return (
    <div
      className="inline-flex rounded-full border border-[#DCE4DF] bg-white/80 p-1 shadow-[0_8px_24px_rgba(36,51,45,0.04)]"
      aria-label="Choose semester"
    >
      {[1, 2].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={`rounded-full px-4 py-2 text-xs font-extrabold transition-all sm:px-5 ${
            semester === value
              ? "bg-[#24332D] text-white shadow-[0_6px_16px_rgba(36,51,45,0.14)]"
              : "text-[#6C7973] hover:bg-[#F4F7F5] hover:text-[#24332D]"
          }`}
          aria-pressed={semester === value}
        >
          Semester {value}
        </button>
      ))}
    </div>
  );
}

export default function ChapterPath({
  chapters,
  semester,
  onSemesterChange,
  compact = false,
}) {
  const navigate = useNavigate();
  const visibleChapters = chapters.filter(
    (chapter) => Number(chapter.semester) === Number(semester)
  );

  return (
    <section>
      <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <span className="ml-eyebrow">Learning path</span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.045em] text-[#24332D] sm:text-4xl">
            Your chapters, one clear path.
          </h2>
          {!compact && (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6C7973] sm:text-base">
              Each chapter has a Learn section, one six-step Marzano session, and a separate Ultimate Project.
            </p>
          )}
        </div>

        <SemesterSwitch semester={semester} onChange={onSemesterChange} />
      </div>

      <div className="relative">
        {visibleChapters.map((chapter, index) => {
          const mission = missionMeta[chapter.missionStatus] ?? missionMeta.not_started;
          const project = projectMeta[chapter.projectStatus] ?? projectMeta.not_submitted;
          const MissionIcon = mission.icon;
          const ProjectIcon = project.icon;
          const chapterNumber = String(chapter.id).padStart(2, "0");
          const isLast = index === visibleChapters.length - 1;
          const projectAvailable = chapter.missionStatus === "completed";

          return (
            <motion.article
              key={chapter.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.38, delay: index * 0.05 }}
              className="group relative grid grid-cols-[54px_minmax(0,1fr)] gap-4 sm:grid-cols-[74px_minmax(0,1fr)] sm:gap-6"
            >
              <div className="relative flex justify-center">
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 top-14 w-px bg-gradient-to-b from-[#BFD9CD] via-[#DDE6E1] to-[#E9EEEB] sm:top-16"
                  />
                )}
                <div
                  className={`relative z-10 grid h-12 w-12 place-items-center rounded-full border text-sm font-extrabold tracking-[-0.03em] transition-transform duration-300 group-hover:scale-[1.04] sm:h-14 sm:w-14 ${
                    chapter.missionStatus === "completed"
                      ? "border-[#AFCFBE] bg-[#CFE8DD] text-[#24332D]"
                      : chapter.missionStatus === "in_progress"
                        ? "border-[#24332D] bg-[#24332D] text-white"
                        : "border-[#DCE4DF] bg-[#FBFCF8] text-[#74817B]"
                  }`}
                >
                  {chapter.missionStatus === "completed" ? <Check size={19} /> : chapterNumber}
                </div>
              </div>

              <div
                className={`min-w-0 ${
                  isLast ? "pb-2" : compact ? "pb-9" : "pb-12"
                }`}
              >
                <div className="border-b border-[#E3E9E5] pb-7 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-8 sm:pb-8">
                  <div className="min-w-0">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.11em] ${mission.className}`}
                      >
                        <MissionIcon size={12} strokeWidth={2.4} />
                        {mission.label}
                      </span>

                      {chapter.listening && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#85918B]">
                          <Headphones size={13} /> Listening included
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8A9690]">
                      Chapter {chapterNumber} · {chapter.focus}
                    </p>
                    <h3 className="mt-1.5 text-2xl font-extrabold tracking-[-0.04em] text-[#24332D] sm:text-[1.8rem]">
                      {chapter.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6C7973]">
                      {chapter.description}
                    </p>

                    <div className="mt-5 max-w-xl">
                      <div className="mb-2 flex items-center justify-between gap-3 text-[11px] font-bold">
                        <span className="text-[#68766F]">6-Step Learning Mission</span>
                        <span className="tabular-nums text-[#506159]">
                          {chapter.missionPercent}%
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[#E9EEEB]">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${chapter.missionPercent}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full rounded-full bg-[#8FBDA9]"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#78857F]">
                      <ProjectIcon
                        size={14}
                        className={
                          chapter.projectStatus === "reviewed"
                            ? "text-[#3F7B61]"
                            : "text-[#87938D]"
                        }
                      />
                      <span>
                        {projectAvailable
                          ? `${project.label} · ${chapter.projectLabel}`
                          : `Ultimate Project · ${chapter.projectLabel}`}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-end sm:mt-0">
                    <Button
                      variant={
                        chapter.missionStatus === "in_progress" ? "primary" : "secondary"
                      }
                      className="group/button w-full whitespace-nowrap sm:w-auto"
                      onClick={() => navigate(`/student/chapter/${chapter.id}`)}
                    >
                      {chapter.missionStatus === "in_progress"
                        ? "Continue"
                        : chapter.missionStatus === "completed"
                          ? "Open chapter"
                          : "Start chapter"}
                      <ArrowUpRight
                        size={16}
                        className="transition-transform duration-200 group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5"
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
