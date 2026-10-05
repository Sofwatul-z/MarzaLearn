import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpenText, Layers3 } from "lucide-react";
import ChapterPath from "../../components/student/ChapterPath";
import Loader from "../../components/common/Loader";
import useStudentJourney from "../../hooks/useStudentJourney";

export default function ChapterMap() {
  const { chapters, summary, loading, error } = useStudentJourney();
  const [semester, setSemester] = useState(1);

  useEffect(() => {
    if (summary.currentChapter?.semester) {
      setSemester(Number(summary.currentChapter.semester));
    }
  }, [summary.currentChapter?.semester]);

  if (loading) {
    return <Loader label="Preparing your learning path..." />;
  }

  return (
    <div>
      <section className="relative overflow-hidden border-b border-[#E3E9E5] pb-10 pt-5 sm:pb-12 sm:pt-8 lg:pb-14">
        <div className="pointer-events-none absolute right-[-4rem] top-[-2rem] hidden select-none text-[11rem] font-extrabold tracking-[-0.09em] text-[#CFE8DD]/35 lg:block">
          05
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative max-w-3xl"
        >
          <span className="ml-eyebrow">
            <Layers3 size={14} /> 2 semesters · 5 chapters
          </span>
          <h1 className="ml-title mt-4">The full English journey.</h1>
          <p className="ml-subtitle mt-5 max-w-2xl">
            Move through each topic at your pace. When you begin the six-step mission inside a chapter, finish that mission in one learning session.
          </p>
        </motion.div>

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-[#738079]">
          <span className="inline-flex items-center gap-2">
            <BookOpenText size={15} className="text-[#527060]" /> Learn first
          </span>
          <span>→</span>
          <span>6 Marzano steps</span>
          <span>→</span>
          <span>Ultimate Project later</span>
        </div>
      </section>

      {error && (
        <p className="mt-7 rounded-2xl border border-[#E9C8C3] bg-[#FAECE9] px-4 py-3 text-sm font-semibold text-[#944A40]">
          Some progress data could not be loaded. Your chapter list is still available.
        </p>
      )}

      <div className="pt-10 sm:pt-12">
        <ChapterPath
          chapters={chapters}
          semester={semester}
          onSemesterChange={setSemester}
        />
      </div>
    </div>
  );
}
