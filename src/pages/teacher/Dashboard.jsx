import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  FolderUp,
  Sparkles,
  Users,
  Award,
} from "lucide-react";
import Button from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import TeacherLab from "../../components/teacher/TeacherLab";
import TeacherJourney from "../../components/teacher/TeacherJourney";
import { getAllProjectSubmissions } from "../../services/progress";
import { getStudentsByClass } from "../../services/teacher";

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

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [studentCount, setStudentCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  const teacherName = profile?.full_name?.trim() || "Teacher";

  useEffect(() => {
    let active = true;
    async function loadStats() {
      try {
        const [studentsXC, studentsXD, subsXC, subsXD] = await Promise.all([
          getStudentsByClass("XC"),
          getStudentsByClass("XD"),
          getAllProjectSubmissions("XC"),
          getAllProjectSubmissions("XD"),
        ]);
        if (active) {
          const totalStudents = (studentsXC?.length || 0) + (studentsXD?.length || 0);
          const allSubs = [...(subsXC || []), ...(subsXD || [])];
          const pending = allSubs.filter((s) => s.status !== "reviewed").length;
          setStudentCount(totalStudents);
          setPendingCount(pending);
        }
      } catch (e) {
        console.warn("Could not load stats:", e);
      }
    }
    loadStats();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="grid min-h-[460px] items-center gap-8 border-b border-[#E3E9E5] pb-12 pt-3 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:gap-12 lg:pb-16 lg:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <span className="ml-eyebrow">
            <Sparkles size={14} /> Teacher workspace · Class XC & XD
          </span>

          <h1 className="mt-5 text-[clamp(2.8rem,6vw,5.5rem)] font-extrabold leading-[0.92] tracking-[-0.065em] text-[#24332D]">
            Guide your classroom
            <span className="relative ml-3 inline-block whitespace-nowrap">
              forward.
              <span className="absolute -bottom-1 left-1 right-0 h-3 -rotate-1 rounded-full bg-[#F4D7C5]/70 -z-10 sm:h-4" />
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-[#68766F] sm:text-lg sm:leading-8">
            Welcome back, <strong className="text-[#34463E]">{teacherName}</strong>. Monitor real-time student mission progress, evaluate video project submissions, and curate learning materials.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="group"
              onClick={() => navigate("/teacher/students")}
            >
              Monitor Students
              <ArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/teacher/review")}
            >
              Review Submissions ({pendingCount})
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="hidden lg:block"
        >
          <TeacherLab />
        </motion.div>
      </section>

      {/* Metric Strip */}
      <section className="grid border-b border-[#E3E9E5] py-5 sm:grid-cols-3 sm:divide-x sm:divide-[#E1E7E3] sm:py-6">
        <Metric
          icon={Users}
          label="Total Students"
          value={studentCount > 0 ? String(studentCount) : "—"}
          detail="Enrolled across Class XC & XD"
        />
        <Metric
          icon={FolderUp}
          label="Pending Review"
          value={String(pendingCount)}
          detail={pendingCount > 0 ? "Awaiting your score & feedback" : "All submissions reviewed"}
        />
        <Metric
          icon={BookOpen}
          label="Curriculum"
          value="5 Chapters"
          detail="6-Step Marzano method enabled"
        />
      </section>

      {/* Teacher Roadmap / Journey */}
      <TeacherJourney />
    </div>
  );
}
