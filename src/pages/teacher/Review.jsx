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
    <div>
      <div className="mb-10">
        <span className="ml-eyebrow">Evaluation & Assessment</span>
        <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-[-0.055em] text-[#24332D]">
          Project & PjBL Review
        </h1>
        <p className="mt-3 max-w-xl text-sm sm:text-base leading-7 text-[#67776F]">
          Review student video projects, evaluate scripts, verify checklists, and provide scores and constructive teacher feedback.
        </p>
      </div>

      {/* Class Filter (Matching Student Pill Switcher) */}
      <div className="flex gap-2.5 mb-8">
        {["XC", "XD"].map((c) => (
          <button
            key={c}
            onClick={() => setClassName(c)}
            className={`rounded-full px-5 py-2 text-xs font-extrabold transition-all ${
              className === c
                ? "bg-[#24332D] text-white shadow-[0_6px_16px_rgba(36,51,45,0.14)]"
                : "border border-[#DCE4DF] bg-white/80 text-[#6C7973] hover:bg-[#F4F7F5] hover:text-[#24332D]"
            }`}
          >
            Class {c}
          </button>
        ))}
      </div>

      {/* Submissions List */}
      {loading ? (
        <div className="py-16 text-center text-sm font-semibold text-[#83928B]">
          Loading student project submissions...
        </div>
      ) : submissions.length === 0 ? (
        <div className="rounded-[30px] border border-dashed border-[#DDE5E0] bg-white/60 p-12 text-center">
          <Clock size={32} className="mx-auto text-[#A0AAA5] mb-3" />
          <h3 className="text-lg font-extrabold text-[#24332D]">
            No Submissions Yet
          </h3>
          <p className="mt-1.5 text-xs text-[#7B8881] max-w-md mx-auto">
            Students from Class {className} have not submitted their PjBL video projects for this term yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {submissions.map((sub, index) => {
            const chapterMeta = CHAPTER_CATALOG.find(
              (c) => c.id === Number(sub.chapter_id)
            );
            const isReviewed = sub.status === "reviewed" || sub.score != null;

            return (
              <div
                key={sub.id || `${sub.student_id}-${sub.chapter_id}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-[26px] border border-[#DCE4DF] bg-white/85 p-5 shadow-[0_8px_20px_rgba(36,51,45,0.03)] transition-all hover:border-[#9FB9AC] hover:shadow-md sm:p-6"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-sm font-extrabold shadow-xs ${
                      isReviewed
                        ? "bg-[#CFE8DD] text-[#24332D]"
                        : "bg-[#EAF4EF] text-[#4B6B5B]"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#EAF4EF] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#486B5C]">
                        Class {sub.class_name} · No. {sub.attendance_number || "01"}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#6F7D76]">
                        Chapter {sub.chapter_id}
                      </span>
                      {isReviewed ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800">
                          <CheckCircle2 size={11} /> Score: {sub.score}/100
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-100/70 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-800">
                          Pending Review
                        </span>
                      )}
                    </div>

                    <h3 className="mt-2 text-lg font-extrabold text-[#24332D]">
                      {sub.student_name}
                    </h3>
                    <p className="text-xs text-[#7B8881]">
                      {chapterMeta?.title || `Chapter ${sub.chapter_id} Project`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0">
                  <Button
                    variant={isReviewed ? "secondary" : "primary"}
                    size="sm"
                    onClick={() => handleOpenReview(sub)}
                  >
                    {isReviewed ? "Update Grade" : "Review & Grade"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review & Grading Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[32px] border border-[#DCE4DF] bg-white p-7 shadow-2xl sm:p-9">
            <div className="flex items-start justify-between border-b border-[#EAEFEA] pb-5">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF4EF] px-3 py-1 text-[11px] font-extrabold text-[#3F6252]">
                  <Sparkles size={12} className="text-yellow-600" /> PjBL Assessment
                </span>
                <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[#24332D]">
                  {selectedSub.student_name}
                </h2>
                <p className="mt-1 text-xs text-[#718078] font-bold">
                  Chapter {selectedSub.chapter_id} Project · Class {selectedSub.class_name} · No. {selectedSub.attendance_number || "01"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="rounded-full p-2 text-[#8E9B95] hover:bg-[#F0F4F2] hover:text-[#24332D] transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {/* Video Link Box */}
              <div className="rounded-2xl border border-[#DCE4DF] bg-[#F7FAF8] p-4">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#73827B]">
                  Submitted Video Link
                </p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-extrabold text-emerald-800">
                    {selectedSub.video_url}
                  </p>
                  <a
                    href={selectedSub.video_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#24332D] px-4 py-2 text-xs font-extrabold text-white transition hover:bg-[#344b43]"
                  >
                    Open Video <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              {/* Script Draft if available */}
              {selectedSub.script_text && (
                <div className="rounded-2xl border border-[#DCE4DF] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={15} className="text-[#5B7568]" />
                    <p className="text-xs font-bold text-[#24332D]">
                      Student Script Draft
                    </p>
                  </div>
                  <pre className="max-h-48 overflow-y-auto whitespace-pre-wrap rounded-xl bg-[#F8FAF9] p-3 text-xs leading-relaxed text-[#4A5D54] font-sans">
                    {selectedSub.script_text}
                  </pre>
                </div>
              )}

              {/* Grading Form */}
              <form onSubmit={handleSaveGrade} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#54675F] mb-1.5">
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
                    className="ml-input text-base font-extrabold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#54675F] mb-1.5">
                    Teacher Feedback & Advice
                  </label>
                  <textarea
                    rows={3}
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    placeholder="Great pronunciation! Next time try adding more descriptive adjectives..."
                    className="ml-input text-sm leading-6"
                  />
                </div>

                {saveSuccess && (
                  <p className="text-xs font-bold text-emerald-800 bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 flex items-center gap-2">
                    <CheckCircle2 size={16} /> Grade and feedback saved successfully!
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
    </div>
  );
}
