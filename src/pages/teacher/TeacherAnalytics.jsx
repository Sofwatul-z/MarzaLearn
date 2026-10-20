import { useEffect, useMemo, useState, useCallback } from "react";
import { ArrowLeft, BarChart3, CheckCircle2, Users, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import { getStudentsWithProgress } from "../../services/teacher";
import { CHAPTER_CATALOG } from "../../data/chapterCatalog";
import BackDashboard from "../../components/teacher/BackDashboard";

export default function TeacherAnalytics() {
  const navigate = useNavigate();
  const [className, setClassName] = useState("XC");
  const [studentsWithProgress, setStudentsWithProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getStudentsWithProgress(className);
      setStudentsWithProgress(data ?? []);
    } catch (loadError) {
      console.error("Failed to load teacher analytics:", loadError);
      setStudentsWithProgress([]);
      setError("Analytics belum dapat dimuat. Pastikan koneksi Supabase tersedia.");
    } finally {
      setLoading(false);
    }
  }, [className]);

  useEffect(() => {
    loadAnalytics();

    // Listen for custom reset event dispatched in same tab
    const handleReset = () => {
      loadAnalytics();
    };
    window.addEventListener("marzalearn:session-reset", handleReset);
    window.addEventListener("marzalearn:mission-graded", handleReset);
    window.addEventListener("marzalearn:grade-updated", handleReset);

    // Listen for storage events across tabs
    window.addEventListener("storage", handleReset);

    // BroadcastChannel sync across tabs/windows
    let bc;
    try {
      if (typeof BroadcastChannel !== "undefined") {
        bc = new BroadcastChannel("marzalearn_sync");
        bc.onmessage = (event) => {
          if (
            event.data?.type === "SESSION_RESET" ||
            event.data?.type === "SESSION_RESET_ALL" ||
            event.data?.type === "MISSION_GRADED"
          ) {
            loadAnalytics();
          }
        };
      }
    } catch (e) {}

    return () => {
      window.removeEventListener("marzalearn:session-reset", handleReset);
      window.removeEventListener("marzalearn:mission-graded", handleReset);
      window.removeEventListener("marzalearn:grade-updated", handleReset);
      window.removeEventListener("storage", handleReset);
      if (bc) bc.close();
    };
  }, [loadAnalytics]);

  const summary = useMemo(() => {
    // Each student's average score from their progress
    const studentAvgs = studentsWithProgress.map((s) => Number(s.progress?.average_score ?? 0));
    const averageScore = studentAvgs.length
      ? Math.round(studentAvgs.reduce((total, val) => total + val, 0) / studentAvgs.length)
      : 0;

    // Total completed learning activities across all students
    const totalActivities = studentsWithProgress.reduce(
      (sum, s) => sum + Number(s.progress?.activities ?? 0),
      0
    );

    const totalCompletedChapters = studentsWithProgress.reduce(
      (sum, s) => sum + Number(s.progress?.completed_chapters ?? 0),
      0
    );

    return {
      average: averageScore,
      completed: totalActivities,
      completedChapters: totalCompletedChapters,
      totalStudents: studentsWithProgress.length,
    };
  }, [studentsWithProgress]);

  return (
    <section className="min-h-screen bg-white py-10">
      <div className="max-w-5xl mx-auto px-8">
        <BackDashboard />
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-slate-400">
            Teacher Workspace
          </p>

          <h1 className="mt-3 text-4xl md:text-[42px] font-bold tracking-tight text-[#23332e]">
            Class Insight
          </h1>

          <p className="mt-4 max-w-lg text-sm md:text-base text-slate-500">
            Understand classroom performance and learning development. Live data updates instantly when student progress is modified or reset.
          </p>
        </div>

        {/* Class Filter & Manual Refresh */}
        <div className="flex items-center justify-between gap-4 mb-10">
          <div className="flex gap-2.5">
            {["XC", "XD"].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setClassName(c)}
                className={`rounded-full px-5 py-2 text-xs font-extrabold transition-all ${
                  className === c
                    ? "bg-[#24332D] text-white shadow-[0_6px_16px_rgba(36,51,45,0.14)]"
                    : "border border-[#DCE4DF] bg-white text-[#6C7973] hover:bg-[#F4F7F5] hover:text-[#24332D]"
                }`}
              >
                Class {c}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={loadAnalytics}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
            title="Refresh Analytics"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-[#24332D]" : ""} />
            <span>Refresh</span>
          </button>
        </div>

        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="border-t border-slate-100">
          {[
            {
              title: "Average Score",
              value: `${summary.average}%`,
              description: "Average student learning performance across chapters.",
            },
            {
              title: "Completed Activities",
              value: `${summary.completed}`,
              description: "Completed learning chapter activities in Class " + className + ".",
            },
            {
              title: "Students",
              value: `${summary.totalStudents}`,
              description: "Enrolled students included in Class " + className + ".",
            },
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
              Classroom performance overview is calculated directly from live student progress and immediately reflects resets.
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
