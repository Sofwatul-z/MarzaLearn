import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  FolderUp,
  Sparkles,
} from "lucide-react";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import ChapterPath from "../../components/student/ChapterPath";
import useStudentJourney from "../../hooks/useStudentJourney";
import { useAuth } from "../../hooks/useAuth";

const motionWords = ["describe", "retell", "guide", "argue", "imagine"];

function LearningOrbit() {
  return (
    <div className="relative mx-auto h-[330px] w-full max-w-[520px] sm:h-[390px]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 h-[270px] w-[270px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#BFD2C8] sm:h-[320px] sm:w-[320px]"
        aria-hidden="true"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 h-[205px] w-[205px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#F0D5C5] sm:h-[245px] sm:w-[245px]"
        aria-hidden="true"
      />

      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 grid h-40 w-40 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[42%_58%_55%_45%/45%_42%_58%_55%] bg-[#CFE8DD] shadow-[0_28px_70px_rgba(76,112,95,0.15)] sm:h-48 sm:w-48"
      >
        <div className="text-center">
          <p className="text-5xl font-extrabold tracking-[-0.085em] text-[#24332D] sm:text-6xl">
            Aa
          </p>
          <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#61786D]">
            English lab
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
            className={`absolute ${positions[index]} rounded-full border border-[#DDE5E0] bg-white/[0.78] px-3 py-2 text-[11px] font-extrabold tracking-[-0.01em] text-[#52625B] shadow-[0_10px_28px_rgba(36,51,45,0.06)] backdrop-blur-sm`}
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

function Metric({ icon: Icon, value, label, detail }) {
  return (
    <div className="min-w-0 py-3 sm:px-6 sm:first:pl-0">
      <div className="flex items-center gap-2 text-[#597064]">
        <Icon size={16} strokeWidth={2.2} />
        <span className="text-[10px] font-extrabold uppercase tracking-[0.13em]">
          {label}
        </span>
      </div>
      <p className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[#24332D]">
        {value}
      </p>
      <p className="mt-1 truncate text-xs font-medium text-[#7C8983]">{detail}</p>
    </div>
  );
}

export default function Dashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { chapters, summary, loading, error } = useStudentJourney();
  const [semester, setSemester] = useState(1);

  const firstName = profile?.full_name?.trim().split(/\s+/)[0] || "Student";

  useEffect(() => {
    if (summary.currentChapter?.semester) {
      setSemester(Number(summary.currentChapter.semester));
    }
  }, [summary.currentChapter?.semester]);

  const semesterSummary = useMemo(() => {
    const semesterChapters = chapters.filter(
      (chapter) => Number(chapter.semester) === Number(semester)
    );
    const completed = semesterChapters.filter(
      (chapter) => chapter.missionStatus === "completed"
    ).length;

    return { completed, total: semesterChapters.length };
  }, [chapters, semester]);

  if (loading) {
    return <Loader label="Preparing your dashboard..." />;
  }

  const currentChapter = summary.currentChapter ?? chapters[0] ?? null;

  return (
    <div>
      <section className="grid min-h-[460px] items-center gap-8 border-b border-[#E3E9E5] pb-12 pt-3 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:gap-12 lg:pb-16 lg:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <span className="ml-eyebrow">
            <Sparkles size={14} /> Student workspace · Class {profile?.class_name ?? "—"}
          </span>

          <h1 className="mt-5 text-[clamp(3rem,7vw,6.6rem)] font-extrabold leading-[0.92] tracking-[-0.065em] text-[#24332D]">
            Keep your English
            <span className="relative ml-3 inline-block whitespace-nowrap">
              moving.
              <span className="absolute -bottom-1 left-1 right-0 h-3 -rotate-1 rounded-full bg-[#F4D7C5]/70 -z-10 sm:h-4" />
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-[#68766F] sm:text-lg sm:leading-8">
            Welcome back, <strong className="text-[#34463E]">{firstName}</strong>. Learn the topic first, complete all six Marzano steps in one session, then return later for the Ultimate Project.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="group"
              disabled={!currentChapter}
              onClick={() =>
                currentChapter && navigate(`/student/chapter/${currentChapter.id}`)
              }
            >
              {currentChapter?.missionStatus === "in_progress"
                ? "Continue learning"
                : "Start learning"}
              <ArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/student/chapters")}
            >
              Explore all chapters
            </Button>
          </div>

          {currentChapter && (
            <p className="mt-5 text-xs font-bold text-[#85918B]">
              Next: Chapter {String(currentChapter.id).padStart(2, "0")} · {currentChapter.title}
              {currentChapter.missionStatus === "in_progress"
                ? ` · Step ${Math.max(1, currentChapter.currentStep)} of 6`
                : ""}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="hidden lg:block"
        >
          <LearningOrbit />
        </motion.div>
      </section>

      <section className="grid border-b border-[#E3E9E5] py-5 sm:grid-cols-3 sm:divide-x sm:divide-[#E1E7E3] sm:py-6">
        <Metric
          icon={BookOpen}
          label="Current chapter"
          value={currentChapter ? `0${currentChapter.id}` : "—"}
          detail={currentChapter?.title ?? "No chapter available"}
        />
        <Metric
          icon={CheckCircle}
          label="Learning missions"
          value={`${summary.completedMissions}/${summary.totalChapters || 5}`}
          detail={`Semester ${semester}: ${semesterSummary.completed}/${semesterSummary.total} completed`}
        />
        <Metric
          icon={FolderUp}
          label="Ultimate Projects"
          value={`${summary.submittedProjects}/${summary.totalChapters || 5}`}
          detail={
            summary.reviewedProjects
              ? `${summary.reviewedProjects} reviewed by teacher`
              : "Submit after finishing each mission"
          }
        />
      </section>

      {error && (
        <p className="mt-8 rounded-2xl border border-[#E9C8C3] bg-[#FAECE9] px-4 py-3 text-sm font-semibold text-[#944A40]">
          Some progress data could not be loaded. Your chapters are still available.
        </p>
      )}

      <div className="pt-12 sm:pt-16">
        <ChapterPath
          chapters={chapters}
          semester={semester}
          onSemesterChange={setSemester}
          compact
        />
      </div>
    </div>
  );
}
