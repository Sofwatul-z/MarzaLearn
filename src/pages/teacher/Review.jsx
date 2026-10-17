import { useEffect, useState } from "react";
import {
  ExternalLink,
  CheckCircle2,
  Clock,
  Award,
  MessageSquare,
  FileText,
  X,
  Sparkles,
} from "lucide-react";
import BackDashboard from "../../components/teacher/BackDashboard";
import Button from "../../components/common/Button";
import {
  getAllProjectSubmissions,
  gradeProjectSubmission,
} from "../../services/progress";
import { CHAPTER_CATALOG } from "../../data/chapterCatalog";

export default function Review() {
  const [className, setClassName] = useState("XC");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState(null);
  const [scoreInput, setScoreInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadSubmissions() {
      setLoading(true);
      try {
        const data = await getAllProjectSubmissions(className);
        if (active) setSubmissions(data);
      } catch (err) {
        console.error("Failed to load submissions:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadSubmissions();
    return () => {
      active = false;
    };
  }, [className]);

  function handleOpenReview(sub) {
    setSelectedSub(sub);
    setScoreInput(sub.score ? String(sub.score) : "");
    setFeedbackInput(sub.feedback || "");
    setSaveSuccess(false);
  }

  async function handleSaveGrade(e) {
    e.preventDefault();
    if (!selectedSub) return;
    setSaving(true);
    try {
      await gradeProjectSubmission({
        submissionId: selectedSub.id,
        studentId: selectedSub.student_id,
        chapterId: selectedSub.chapter_id,
        score: Number(scoreInput) || 0,
        feedback: feedbackInput,
      });

      setSaveSuccess(true);
      // Update local state
      setSubmissions((prev) =>
        prev.map((s) =>
          (s.id && s.id === selectedSub.id) ||
          (s.student_id === selectedSub.student_id &&
            Number(s.chapter_id) === Number(selectedSub.chapter_id))
            ? {
                ...s,
                status: "reviewed",
                score: Number(scoreInput),
                feedback: feedbackInput,
                reviewed_at: new Date().toISOString(),
              }
            : s
        )
      );
      setTimeout(() => {
        setSelectedSub(null);
        setSaveSuccess(false);
      }, 1200);
    } catch (err) {
      console.error("Failed to save grade:", err);
      alert("Failed to save review. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="min-h-screen bg-white py-10">
      <div className="max-w-5xl mx-auto px-8">
        <BackDashboard />

        <div className="mb-10">
          <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-slate-400">
            Teacher Workspace
          </p>
          <h1 className="mt-3 text-4xl md:text-[42px] font-bold tracking-tight text-[#23332e]">
            Project & PjBL Review
          </h1>
          <p className="mt-3 max-w-xl text-sm md:text-base text-slate-500">
            Review student video projects, evaluate scripts, verify checklists,
            and provide scores and teacher feedback.
          </p>
        </div>

        {/* Class Filter */}
        <div className="flex gap-3 mb-10">
          {["XC", "XD"].map((c) => (
            <button
              key={c}
              onClick={() => setClassName(c)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                className === c
                  ? "bg-[#23332e] text-white"
                  : "border border-slate-200 bg-white text-[#23332e] hover:bg-slate-50"
              }`}
            >
              Class {c}
            </button>
          ))}
        </div>

        {/* Submissions List */}
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            Loading student project submissions...
          </div>
        ) : submissions.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center bg-slate-50">
            <Clock size={32} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-lg font-bold text-[#23332e]">
              No Submissions Yet
            </h3>
            <p className="mt-1 text-sm text-slate-400 max-w-md mx-auto">
              Students from Class {className} have not submitted their PjBL video
              projects for this term yet.
            </p>
          </div>
        ) : (
          <div className="border-t border-slate-100">
            {submissions.map((sub, index) => {
              const chapterMeta = CHAPTER_CATALOG.find(
                (c) => c.id === Number(sub.chapter_id)
              );
              const isReviewed = sub.status === "reviewed" || sub.score != null;

              return (
                <div
                  key={sub.id || `${sub.student_id}-${sub.chapter_id}`}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-7 border-b border-slate-100 transition hover:bg-slate-50/50 px-3 rounded-2xl"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-sm font-bold ${
                        isReviewed
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-[#edf6f1] text-[#23332e]"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-[#23332e]">
                          {sub.student_name || "Student"}
                        </h3>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                            isReviewed
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {isReviewed
                            ? `Reviewed · Score: ${sub.score}`
                            : "Pending Review"}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-slate-500 font-medium">
                        Chapter {String(sub.chapter_id).padStart(2, "0")} ·{" "}
                        {chapterMeta?.title || "English Project"} · Class{" "}
                        {sub.class_name || className}
                      </p>

                      <a
                        href={sub.video_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:underline"
                      >
                        <ExternalLink size={13} /> Open Project Video Link
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleOpenReview(sub)}
                      className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-[#23332e] shadow-sm transition hover:bg-[#23332e] hover:text-white"
                    >
                      {isReviewed ? "Edit Review →" : "Review & Grade →"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review & Grading Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[32px] bg-white p-7 shadow-2xl sm:p-9">
            <div className="flex items-start justify-between border-b border-slate-100 pb-5">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF4EF] px-3 py-1 text-[11px] font-extrabold text-[#3F6252]">
                  <Sparkles size={12} /> PjBL Assessment
                </span>
                <h2 className="mt-2 text-2xl font-black text-[#23332e]">
                  {selectedSub.student_name}
                </h2>
                <p className="mt-1 text-xs text-slate-500 font-semibold">
                  Chapter {selectedSub.chapter_id} Project · Class{" "}
                  {selectedSub.class_name}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {/* Video Link Box */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Submitted Video Link
                </p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-semibold text-emerald-700">
                    {selectedSub.video_url}
                  </p>
                  <a
                    href={selectedSub.video_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#23332e] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#344b43]"
                  >
                    Open Link <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              {/* Script Draft if available */}
              {selectedSub.script_text && (
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={15} className="text-[#5B7568]" />
                    <p className="text-xs font-bold text-[#23332e]">
                      Student Script Draft
                    </p>
                  </div>
                  <pre className="max-h-48 overflow-y-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-700 font-sans">
                    {selectedSub.script_text}
                  </pre>
                </div>
              )}

              {/* Grading Form */}
              <form onSubmit={handleSaveGrade} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                    Score (0–100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={scoreInput}
                    onChange={(e) => setScoreInput(e.target.value)}
                    placeholder="e.g. 90"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base font-bold outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                    Teacher Feedback & Advice
                  </label>
                  <textarea
                    rows={3}
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    placeholder="Great pronunciation! Next time try adding more descriptive adjectives..."
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {saveSuccess && (
                  <p className="text-xs font-bold text-emerald-700 bg-emerald-50 p-3 rounded-xl flex items-center gap-2">
                    <CheckCircle2 size={16} /> Grade and feedback saved
                    successfully!
                  </p>
                )}

                <div className="flex justify-end gap-3 pt-3">
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => setSelectedSub(null)}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Submit Assessment"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
