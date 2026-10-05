import { useEffect, useState } from "react";
import { ArrowLeft, ClipboardCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import { getStudentsByClass, getStudentProgress } from "../../services/teacher";

export default function Review() {
  const navigate = useNavigate();
  const [className, setClassName] = useState("XC");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadReview() {
      setLoading(true);
      setError("");
      try {
        const rows = await getStudentsByClass(className);
        const enriched = await Promise.all((rows ?? []).map(async (student) => ({ student, progress: await getStudentProgress(student.id) })));
        if (active) setStudents(enriched);
      } catch (loadError) {
        console.error("Failed to load student review:", loadError);
        if (active) { setStudents([]); setError("Review belum dapat dimuat. Pastikan data siswa dan progress tersedia."); }
      } finally {
        if (active) setLoading(false);
      }
    }
    loadReview();
    return () => { active = false; };
  }, [className]);

  return (
  <section className="min-h-screen bg-white py-10">
    <div className="max-w-5xl mx-auto px-8">

      <div className="mb-14">
        <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-slate-400">
          Teacher Workspace
        </p>

        <h1 className="mt-3 text-4xl md:text-[42px] font-bold tracking-tight text-[#23332e]">
          Review Workspace
        </h1>

        <p className="mt-4 max-w-lg text-sm md:text-base text-slate-500">
          Review student submissions, evaluate learning activities, and provide feedback.
        </p>
      </div>


      <div className="border-t border-slate-100">

        {reviews.map((review, index) => (
          <div
            key={review.id}
            className="group flex items-center gap-6 py-8 border-b border-slate-100"
          >

            <div className="w-12 h-12 shrink-0 rounded-full bg-[#edf6f1] flex items-center justify-center text-sm font-semibold text-[#23332e] group-hover:bg-[#dceee7] transition">
              {String(index + 1).padStart(2, "0")}
            </div>


            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-semibold text-[#23332e]">
                {review.title || "Student Submission"}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {review.student_name || "Student"} submitted a learning activity.
              </p>

              <p className="mt-1 text-sm text-slate-400">
                {review.chapter_name || "Chapter activity"}
              </p>
            </div>


            <button
              type="button"
              onClick={() => handleReview(review)}
              className="rounded-full border border-slate-200 px-5 py-2.5 text-sm text-[#23332e] hover:bg-slate-50 transition"
            >
              Review →
            </button>

          </div>
        ))}

      </div>

    </div>
  </section>
);
}
