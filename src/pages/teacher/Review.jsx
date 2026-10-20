import { useEffect, useState, useCallback } from "react";
import {
  ExternalLink,
  CheckCircle2,
  Clock,
  Award,
  MessageSquare,
  FileText,
  X,
  Sparkles,
  BookOpen,
  PenLine,
  Brush,
  Link2,
  MessageSquareText,
  Gamepad2,
  Layers,
} from "lucide-react";
import Button from "../../components/common/Button";
import {
  getAllProjectSubmissions,
  gradeProjectSubmission,
  getAllStepMissionSubmissions,
  gradeStepMissionSubmission,
} from "../../services/progress";
import { CHAPTER_CATALOG } from "../../data/chapterCatalog";
import { getChapterTheme } from "../../data/chapterThemes";

export default function Review() {
  const [activeTab, setActiveTab] = useState("mission"); // "mission" | "project"
  const [className, setClassName] = useState("XC");
  const [projectSubmissions, setProjectSubmissions] = useState([]);
  const [missionSubmissions, setMissionSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [selectedItem, setSelectedItem] = useState(null);
  const [scoreInput, setScoreInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === "mission") {
        const data = await getAllStepMissionSubmissions(className);
        setMissionSubmissions(data);
      } else {
        const data = await getAllProjectSubmissions(className);
        setProjectSubmissions(data);
      }
    } catch (err) {
      console.error("Failed to load review data:", err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, className]);

  useEffect(() => {
    loadData();

    const handleSync = () => {
      loadData();
    };

    window.addEventListener("marzalearn:session-reset", handleSync);
    window.addEventListener("marzalearn:mission-graded", handleSync);
    window.addEventListener("marzalearn:grade-updated", handleSync);
    window.addEventListener("storage", handleSync);

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
            loadData();
          }
        };
      }
    } catch (e) {}

    return () => {
      window.removeEventListener("marzalearn:session-reset", handleSync);
      window.removeEventListener("marzalearn:mission-graded", handleSync);
      window.removeEventListener("marzalearn:grade-updated", handleSync);
      window.removeEventListener("storage", handleSync);
      if (bc) bc.close();
    };
  }, [loadData]);

  function handleOpenReview(item) {
    setSelectedItem(item);
    setScoreInput(item.score != null ? String(item.score) : "");
    setFeedbackInput(item.feedback || "");
    setSaveSuccess(false);
  }

  async function handleSaveGrade(e) {
    e.preventDefault();
    if (!selectedItem) return;
    setSaving(true);
    try {
      if (activeTab === "mission") {
        await gradeStepMissionSubmission({
          studentId: selectedItem.student_id,
          chapterId: selectedItem.chapter_id,
          score: Number(scoreInput) || 0,
          feedback: feedbackInput,
        });

        setMissionSubmissions((prev) =>
          prev.map((m) =>
            m.student_id === selectedItem.student_id &&
            Number(m.chapter_id) === Number(selectedItem.chapter_id)
              ? {
                  ...m,
                  status: "reviewed",
                  score: Number(scoreInput),
                  feedback: feedbackInput,
                  reviewed_at: new Date().toISOString(),
                }
              : m
          )
        );
      } else {
        await gradeProjectSubmission({
          submissionId: selectedItem.id,
          studentId: selectedItem.student_id,
          chapterId: selectedItem.chapter_id,
          score: Number(scoreInput) || 0,
          feedback: feedbackInput,
        });

        setProjectSubmissions((prev) =>
          prev.map((s) =>
            (s.id && s.id === selectedItem.id) ||
            (s.student_id === selectedItem.student_id &&
              Number(s.chapter_id) === Number(selectedItem.chapter_id))
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
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setSelectedItem(null);
        setSaveSuccess(false);
      }, 1200);
    } catch (err) {
      console.error("Failed to save grade:", err);
      alert("Failed to save review. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const currentList = activeTab === "mission" ? missionSubmissions : projectSubmissions;

  return (
    <div>
      <div className="mb-8">
        <span className="ml-eyebrow">Evaluation & Assessment</span>
        <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-[-0.055em] text-[#24332D]">
          Student Assessment & Review
        </h1>
        <p className="mt-3 max-w-xl text-sm sm:text-base leading-7 text-[#67776F]">
          Review and grade student work across both the 6-Step Marzano Learning Missions and the final Project video submissions.
        </p>
      </div>

      {/* Tabs: 6-Step Mission vs Project */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E3E9E5] pb-5 mb-7">
        <div className="inline-flex rounded-full border border-[#DCE4DF] bg-white p-1 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab("mission")}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-extrabold transition-all ${
              activeTab === "mission"
                ? "bg-[#24332D] text-white shadow-sm"
                : "text-[#67776F] hover:text-[#24332D]"
            }`}
          >
            <Layers size={14} /> 6-Step Marzano Missions
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("project")}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-extrabold transition-all ${
              activeTab === "project"
                ? "bg-[#24332D] text-white shadow-sm"
                : "text-[#67776F] hover:text-[#24332D]"
            }`}
          >
            <Sparkles size={14} /> Video Projects
          </button>
        </div>

        {/* Class Filter */}
        <div className="flex gap-2">
          {["XC", "XD"].map((c) => (
            <button
              key={c}
              onClick={() => setClassName(c)}
              className={`rounded-full px-4 py-2 text-xs font-extrabold transition-all ${
                className === c
                  ? "bg-[#24332D] text-white shadow-xs"
                  : "border border-[#DCE4DF] bg-white/80 text-[#6C7973] hover:bg-[#F4F7F5] hover:text-[#24332D]"
              }`}
            >
              Class {c}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-16 text-center text-sm font-semibold text-[#83928B]">
          Loading {activeTab === "mission" ? "learning missions" : "project submissions"}...
        </div>
      ) : currentList.length === 0 ? (
        <div className="rounded-[30px] border border-dashed border-[#DDE5E0] bg-white/60 p-12 text-center">
          <Clock size={32} className="mx-auto text-[#A0AAA5] mb-3" />
          <h3 className="text-lg font-extrabold text-[#24332D]">
            No Submissions Found
          </h3>
          <p className="mt-1.5 text-xs text-[#7B8881] max-w-md mx-auto">
            {activeTab === "mission"
              ? `No student progress recorded for the 6-Step Mission in Class ${className} yet.`
              : `Students from Class ${className} have not submitted their video projects yet.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {currentList.map((item, index) => {
            const chapterMeta = CHAPTER_CATALOG.find(
              (c) => c.id === Number(item.chapter_id)
            );
            const theme = getChapterTheme(item.chapter_id);
            const isReviewed = item.status === "reviewed" || item.score != null;

            return (
              <div
                key={item.id || `${item.student_id}-${item.chapter_id}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-[26px] border border-[#DCE4DF] bg-white/85 p-5 shadow-[0_8px_20px_rgba(36,51,45,0.03)] transition-all hover:border-[#9FB9AC] hover:shadow-md sm:p-6"
              >
                <div className="flex items-start gap-4">
                  <div
                    style={{
                      backgroundColor: isReviewed ? theme?.badgeBg : "#EAF4EF",
                      color: isReviewed ? theme?.primaryDark : "#4B6B5B",
                    }}
                    className="w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-sm font-extrabold shadow-xs"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#EAF4EF] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#486B5C]">
                        Class {item.class_name} · No. {item.attendance_number || "01"}
                      </span>
                      <span
                        style={{ backgroundColor: theme?.badgeBg, color: theme?.primaryDark }}
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider"
                      >
                        Chapter {item.chapter_id}
                      </span>
                      {activeTab === "mission" && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-extrabold text-[#6F7D76]">
                          {item.completed_steps?.length ?? 0}/6 Steps Finished
                        </span>
                      )}
                      {isReviewed ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800">
                          <CheckCircle2 size={11} /> Score: {item.score}/100
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-100/70 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-800">
                          Pending Review
                        </span>
                      )}
                    </div>

                    <h3 className="mt-2 text-lg font-extrabold text-[#24332D]">
                      {item.student_name}
                    </h3>
                    <p className="text-xs text-[#7B8881]">
                      {chapterMeta?.title || `Chapter ${item.chapter_id}`} {activeTab === "mission" ? "· 6-Step Mission" : "· Project"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0">
                  <Button
                    variant={isReviewed ? "secondary" : "primary"}
                    size="sm"
                    onClick={() => handleOpenReview(item)}
                  >
                    {isReviewed ? "Update Grade" : "Review & Grade"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[32px] border border-[#DCE4DF] bg-white p-7 shadow-2xl sm:p-9">
            <div className="flex items-start justify-between border-b border-[#EAEFEA] pb-5">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF4EF] px-3 py-1 text-[11px] font-extrabold text-[#3F6252]">
                  <Sparkles size={12} className="text-yellow-600" />
                  {activeTab === "mission" ? "6-Step Mission Evaluation" : "Project Assessment"}
                </span>
                <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[#24332D]">
                  {selectedItem.student_name}
                </h2>
                <p className="mt-1 text-xs text-[#718078] font-bold">
                  Chapter {selectedItem.chapter_id} · Class {selectedItem.class_name} · No. {selectedItem.attendance_number || "01"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="rounded-full p-2 text-[#8E9B95] hover:bg-[#F0F4F2] hover:text-[#24332D] transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {/* Mission Review Content */}
              {activeTab === "mission" && (
                <div className="space-y-4">
                  {/* Step Completion Strip */}
                  <div className="rounded-2xl border border-[#DCE4DF] bg-[#F4F8F6] p-4">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#576B61] mb-2.5">
                      6-Step Marzano Progress Checklist
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Provide", "Restate", "Visualize", "Engage", "Discuss", "Games"].map((st) => {
                        const isDone = selectedItem.completed_steps?.includes(st);
                        return (
                          <span
                            key={st}
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold transition ${
                              isDone
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "bg-white border border-slate-200 text-slate-500"
                            }`}
                          >
                            {isDone ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                            {st}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  {/* Step 1: Provide */}
                  <div className="rounded-2xl border border-[#DCE4DF] p-4 bg-[#F8FAF9]">
                    <div className="flex items-center gap-2 mb-1.5 text-xs font-extrabold text-[#24332D]">
                      <BookOpen size={15} className="text-emerald-700" /> Step 1: Provide (Vocabulary Discovery)
                    </div>
                    <p className="text-xs text-[#52645B]">
                      Words explored: <strong>{selectedItem.session_data.provide?.seen?.length ?? 0} words</strong>
                    </p>
                  </div>

                  {/* Step 2: Restate */}
                  <div className="rounded-2xl border border-[#DCE4DF] p-4">
                    <div className="flex items-center gap-2 mb-2 text-xs font-extrabold text-[#24332D]">
                      <PenLine size={15} className="text-emerald-700" /> Step 2: Restate (Student Sentences)
                    </div>
                    <div className="space-y-2">
                      {Object.entries(selectedItem.session_data.restate?.responses ?? {}).map(
                        ([idx, text]) => (
                          <div key={idx} className="rounded-xl bg-[#F8FAF9] p-2.5 text-xs">
                            <span className="font-extrabold text-[#24332D] block mb-1">
                              Prompt #{Number(idx) + 1}:
                            </span>
                            <p className="text-[#4F5F57]">{text || <span className="italic text-slate-400">No response</span>}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Step 3: Visualize */}
                  <div className="rounded-2xl border border-[#DCE4DF] p-4">
                    <div className="flex items-center gap-2 mb-2 text-xs font-extrabold text-[#24332D]">
                      <Brush size={15} className="text-emerald-700" /> Step 3: Visualize (Visual Drawings & Uploads)
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(selectedItem.session_data.visualize?.items ?? {}).map(
                        ([idx, item]) => (
                          <div key={idx} className="rounded-xl border border-slate-200 bg-[#F8FAF9] p-2 text-center">
                            <p className="text-[10px] font-bold text-slate-500 mb-1">Visual #{Number(idx) + 1} ({item?.mode})</p>
                            {item?.preview ? (
                              <img src={item.preview} alt="Visual artwork" className="h-28 w-full object-contain rounded-lg bg-white" />
                            ) : (
                              <div className="h-28 grid place-items-center text-[11px] text-slate-400 italic bg-white rounded-lg">Artwork saved</div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Step 4: Engage */}
                  <div className="rounded-2xl border border-[#DCE4DF] p-4 bg-[#F8FAF9]">
                    <div className="flex items-center gap-2 mb-1.5 text-xs font-extrabold text-[#24332D]">
                      <Link2 size={15} className="text-emerald-700" /> Step 4: Engage (Word Match Challenge)
                    </div>
                    <p className="text-xs text-[#52645B]">
                      Correct matches: <strong>{selectedItem.session_data.engage?.matched?.length ?? 0}</strong> · Missed: <strong>{selectedItem.session_data.engage?.failed?.length ?? 0}</strong>
                    </p>
                  </div>

                  {/* Step 5: Discuss */}
                  <div className="rounded-2xl border border-[#DCE4DF] p-4">
                    <div className="flex items-center gap-2 mb-2 text-xs font-extrabold text-[#24332D]">
                      <MessageSquareText size={15} className="text-emerald-700" /> Step 5: Discuss (Student Reflection Paragraph)
                    </div>
                    <p className="whitespace-pre-wrap rounded-xl bg-[#F8FAF9] p-3 text-xs leading-relaxed text-[#4A5D54]">
                      {selectedItem.session_data.discuss?.response || <span className="italic text-slate-400">No discussion response entered yet.</span>}
                    </p>
                  </div>

                  {/* Step 6: Games */}
                  <div className="rounded-2xl border border-[#DCE4DF] p-4 bg-[#F8FAF9]">
                    <div className="flex items-center gap-2 mb-1.5 text-xs font-extrabold text-[#24332D]">
                      <Gamepad2 size={15} className="text-emerald-700" /> Step 6: Games (Quiz Challenge)
                    </div>
                    <p className="text-xs text-[#52645B]">
                      Correct Answers: <strong>{Object.values(selectedItem.session_data.games?.answers ?? {}).filter((a) => a?.correct).length}</strong> / {Object.keys(selectedItem.session_data.games?.answers ?? {}).length} answered
                    </p>
                  </div>
                </div>
              )}

              {/* Project Review Content */}
              {activeTab === "project" && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-[#DCE4DF] bg-[#F7FAF8] p-4">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#73827B]">
                      Submitted Video Link
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-extrabold text-emerald-800">
                        {selectedItem.video_url}
                      </p>
                      <a
                        href={selectedItem.video_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#24332D] px-4 py-2 text-xs font-extrabold text-white transition hover:bg-[#344b43]"
                      >
                        Open Video <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>

                  {selectedItem.script_text && (
                    <div className="rounded-2xl border border-[#DCE4DF] p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText size={15} className="text-[#5B7568]" />
                        <p className="text-xs font-bold text-[#24332D]">
                          Student Script Draft
                        </p>
                      </div>
                      <pre className="max-h-48 overflow-y-auto whitespace-pre-wrap rounded-xl bg-[#F8FAF9] p-3 text-xs leading-relaxed text-[#4A5D54] font-sans">
                        {selectedItem.script_text}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Grading Form (Used for both 6-Step and Project) */}
              <form onSubmit={handleSaveGrade} className="space-y-4 pt-4 border-t border-slate-100">
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
                    placeholder="Excellent work! Your vocabulary and sentences demonstrate great understanding..."
                    className="ml-input text-sm leading-6"
                  />
                </div>

                {saveSuccess && (
                  <p className="text-xs font-bold text-emerald-800 bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 flex items-center gap-2">
                    <CheckCircle2 size={16} /> Assessment & grade saved successfully!
                  </p>
                )}

                <div className="flex justify-end gap-3 pt-3">
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => setSelectedItem(null)}
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
