import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BarChart3, CheckCircle2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import { getStudentsByClass, getStudentProgress } from "../../services/teacher";
import { CHAPTER_CATALOG } from "../../data/chapterCatalog";
import BackDashboard from "../../components/teacher/BackDashboard";

export default function TeacherAnalytics() {
  const navigate = useNavigate();
  const [className, setClassName] = useState("XC");
  const [students, setStudents] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadAnalytics() {
      setLoading(true);
      setError("");
      try {
        const studentRows = await getStudentsByClass(className);
        const progressRows = await Promise.all(
          (studentRows ?? []).map(async (student) => ({
            student,
            progress: await getStudentProgress(student.id),
          }))
        );

        if (!active) return;
        setStudents(studentRows ?? []);
        setProgress(progressRows);
      } catch (loadError) {
        console.error("Failed to load teacher analytics:", loadError);
        if (active) {
          setStudents([]);
          setProgress([]);
          setError("Analytics belum dapat dimuat. Pastikan RPC siswa dan tabel student_progress tersedia.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadAnalytics();
    return () => { active = false; };
  }, [className]);

  const summary = useMemo(() => {
    const values = progress.flatMap(({ progress: rows }) => rows ?? []).map((row) => Number(row.percentage ?? 0));
    const completed = progress.flatMap(({ progress: rows }) => rows ?? []).filter((row) => row.status === "completed" || Number(row.percentage) >= 100).length;
    return {
      average: values.length ? Math.round(values.reduce((total, value) => total + value, 0) / values.length) : 0,
      completed,
      totalStudents: students.length,
    };
  }, [progress, students.length]);

  return (
  <section className="min-h-screen bg-white py-10">
    <div className="max-w-5xl mx-auto px-8">
      <BackDashboard />
      <div className="mb-14">
        <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-slate-400">
          Teacher Workspace
        </p>

        <h1 className="mt-3 text-4xl md:text-[42px] font-bold tracking-tight text-[#23332e]">
          Class Insight
        </h1>

        <p className="mt-4 max-w-lg text-sm md:text-base text-slate-500">
          Understand classroom performance and learning development.
        </p>
      </div>



      <div className="border-t border-slate-100">

        {[
          {
            title: "Average Score",
            value: `${summary.average}%`,
            description: "Average student learning performance."
          },
          {
            title: "Completed Activities",
            value: `${summary.completed}`,
            description: "Completed learning activities."
          },
          {
            title: "Students",
            value: `${summary.totalStudents}`,
            description: "Students included in this class."
          }
        ].map((item, index) => (

          <div
            key={item.title}
            className="flex items-center gap-6 py-10 border-b border-slate-100"
          >

            <div className="w-12 h-12 shrink-0 rounded-full bg-[#edf6f1] flex items-center justify-center text-sm font-semibold text-[#23332e]">
              {String(index + 1).padStart(2, "0")}
            </div>


            <div className="flex-1">

              <p className="text-[11px] uppercase tracking-widest text-slate-400">
                {item.title}
              </p>

              <p className="mt-2 text-3xl font-bold text-[#23332e]">
                {item.value}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                {item.description}
              </p>

            </div>

          </div>

        ))}

      </div>



      <div className="mt-12 border-t border-slate-100 pt-10">
        <p className="text-[11px] uppercase tracking-widest text-slate-400">
          Performance Overview
        </p>

        <div className="mt-5 py-8 border-b border-slate-100">
          <p className="text-sm text-slate-500">
            Classroom performance overview is calculated from student progress data.
          </p>
        </div>
      </div>


    </div>
  </section>
);
}

function Metric({ icon: Icon, label, value }) {
  return <div className="rounded-2xl bg-white p-5 shadow-sm"><Icon size={20} className="text-[#527060]" /><p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p><p className="mt-1 text-3xl font-extrabold text-[#24344d]">{value}</p></div>;
}
