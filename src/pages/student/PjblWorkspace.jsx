import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckSquare,
  ExternalLink,
  Film,
  Lightbulb,
  Lock,
  Play,
  Send,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  FileText,
} from "lucide-react";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import { getPjblChapter } from "../../data/pjblData";
import { useAuth } from "../../hooks/useAuth";
import {
  getProjectSubmission,
  getStudentProgressRows,
  submitStudentProject,
} from "../../services/progress";

export default function PjblWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const chapterId = Number(id) || 1;
  const pjbl = getPjblChapter(chapterId);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("modeling"); // 'modeling' | 'script' | 'create' | 'submit'
  const [videoUrl, setVideoUrl] = useState("");
  const [attendanceNo, setAttendanceNo] = useState("01");
  const [scriptData, setScriptData] = useState({});
  const [checkedItems, setCheckedItems] = useState({});
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [missionComplete, setMissionComplete] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadData() {
      if (!user?.id) return;
      try {
        const [sub, progressRows] = await Promise.all([
          getProjectSubmission(user.id, chapterId),
          getStudentProgressRows(user.id),
        ]);

        if (active && sub) {
          setExistingSubmission(sub);
          setVideoUrl(sub.video_url || "");
          setAttendanceNo(sub.attendance_number || "01");
          if (sub.checklist && typeof sub.checklist === "object") {
            setCheckedItems(sub.checklist);
          }
        }

        if (active && progressRows) {
          const row = progressRows.find(
            (r) => Number(r.chapter_id) === Number(chapterId) || Number(r.chapter_id) === 15 + Number(chapterId)
          );
          if (row) {
            const done =
              row.percentage >= 100 ||
              (row.provide && row.restate && row.visualize && row.engage && row.discuss && row.play);
            setMissionComplete(Boolean(done));
          }
        }
      } catch (e) {
        console.warn("Could not load PjBL prerequisites or submission:", e);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadData();
    return () => {
      active = false;
    };
  }, [user?.id, chapterId]);

  const studentName = profile?.full_name || "Student";
  const studentClass = profile?.class_name || "XC";

  function toggleChecklist(itemIndex) {
    setCheckedItems((prev) => ({
      ...prev,
      [itemIndex]: !prev[itemIndex],
    }));
  }

  function handleScriptChange(key, value) {
    setScriptData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!videoUrl.trim()) {
      alert("Please enter a valid video project link.");
      return;
    }

    setSubmitting(true);
    const combinedScript = Object.entries(scriptData)
      .map(([k, v]) => `[${k.toUpperCase()}]:\n${v}`)
      .join("\n\n");

    try {
      const res = await submitStudentProject({
        studentId: user?.id,
        chapterId,
        studentName,
        className: studentClass,
        attendanceNumber: attendanceNo,
        scriptText: combinedScript,
        videoUrl: videoUrl.trim(),
        checklist: checkedItems,
      });

      if (res.ok) {
        setSubmittedSuccess(true);
        setExistingSubmission(res.data);
      }
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Submission failed. Please check your network connection.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loader label="Opening PjBL Project Workspace..." />;

  if (!missionComplete) {
    return (
      <div className="py-20 text-center max-w-xl mx-auto px-4">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-amber-100 text-amber-700 shadow-inner">
          <Lock size={36} />
        </div>
        <span className="ml-eyebrow">Project Locked</span>
        <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-[#24332D]">
          Complete the 6-Step Mission First
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[#617269]">
          The Ultimate PjBL Video Project for Chapter {chapterId} ({pjbl?.title}) requires concepts, vocabulary, and speaking practice from all 6 Marzano steps. Finish your 6-step mission to unlock this workspace!
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="primary" size="lg" onClick={() => navigate(`/student/chapter/${chapterId}/session`)}>
            Go to 6-Step Mission <ArrowRight size={16} />
          </Button>
          <Button variant="secondary" size="lg" onClick={() => navigate(`/student/chapter/${chapterId}`)}>
            Back to Chapter
          </Button>
        </div>
      </div>
    );
  }

  const isReviewed = existingSubmission?.status === "reviewed";

  return (
    <div className="pb-16 pt-3">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate(`/student/chapter/${chapterId}`)}
        className="mb-6 inline-flex items-center gap-2 text-xs font-extrabold text-[#6B7972] transition-colors hover:text-[#24332D]"
      >
        <ArrowLeft size={15} /> Back to Chapter {String(chapterId).padStart(2, "0")}
      </button>

      {/* Hero Banner with joyful vibes */}
      <section className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[#24332D] via-[#2F443B] to-[#1E2B25] px-6 py-9 text-white shadow-[0_24px_60px_rgba(36,51,45,0.14)] sm:px-10 sm:py-11">
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/4 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-emerald-300 backdrop-blur-md">
            <Sparkles size={12} className="text-yellow-300" /> Chapter {String(chapterId).padStart(2, "0")} · Ultimate PjBL
          </span>
          <h1 className="mt-3.5 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
            {pjbl.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
            {pjbl.mission}
          </p>

          <div className="mt-6 flex flex-wrap gap-4 text-xs font-bold text-white/70">
            <span className="rounded-full bg-white/10 px-3 py-1">⏱ Duration: {pjbl.duration}</span>
            <span className="rounded-full bg-white/10 px-3 py-1">🎬 Tools: Canva, CapCut, YouTube</span>
            <span className="rounded-full bg-white/10 px-3 py-1">🏷 Class: {studentClass}</span>
          </div>
        </div>
      </section>

      {/* Submission Status Alert */}
      {existingSubmission && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 text-emerald-900 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-black">
                  {isReviewed
                    ? `Project Reviewed · Teacher Score: ${existingSubmission.score}/100 🏆`
                    : "Project Submitted! Waiting for Teacher Review ⏳"}
                </p>
                {existingSubmission.feedback && (
                  <p className="mt-1 text-xs text-emerald-800">
                    <strong>Teacher Feedback:</strong> "{existingSubmission.feedback}"
                  </p>
                )}
              </div>
            </div>

            <a
              href={existingSubmission.video_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 self-start sm:self-center text-xs font-extrabold text-emerald-700 underline"
            >
              <ExternalLink size={13} /> View Submitted Video
            </a>
          </div>
        </motion.div>
      )}

      {/* Navigation Tabs */}
      <div className="mt-10 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { key: "modeling", label: "Task Modeling & Example", icon: Film },
          { key: "script", label: "Step 1: Write Script", icon: FileText },
          { key: "create", label: "Step 2: Create Video", icon: Play },
          { key: "submit", label: "Step 3: Checklist & Submit", icon: CheckSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-black transition-all ${
                isActive
                  ? "bg-[#24332D] text-white shadow-md shadow-[#24332D]/15"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="mt-8">
        {/* TAB 1: Task Modeling */}
        {activeTab === "modeling" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-emerald-700">
                <Film size={14} /> Video Demonstration
              </span>
              <h2 className="mt-2 text-2xl font-black text-[#24332D]">
                {pjbl.taskModeling.title}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Watch the video below to understand how an effective English digital video is organized and delivered.
              </p>

              {/* YouTube Embed */}
              <div className="mt-6 aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-md">
                <iframe
                  src={`https://www.youtube.com/embed/${pjbl.taskModeling.embedId}`}
                  title={pjbl.taskModeling.title}
                  className="h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="mt-3 text-right">
                <a
                  href={pjbl.taskModeling.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
                >
                  <ExternalLink size={13} /> Open Video on YouTube ↗
                </a>
              </div>
            </div>

            {/* Key Observations */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[28px] border border-slate-200 bg-[#FBFCF8] p-6 shadow-sm sm:p-7">
                <div className="flex items-center gap-2 text-emerald-800">
                  <Lightbulb size={18} />
                  <h3 className="font-black text-base">Key Things to Observe</h3>
                </div>
                <ul className="mt-4 space-y-2.5 text-xs font-medium leading-relaxed text-slate-600">
                  {pjbl.taskModeling.observations.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[28px] border border-amber-200 bg-amber-50/50 p-6 shadow-sm sm:p-7">
                <div className="flex items-center gap-2 text-amber-900">
                  <HelpCircle size={18} />
                  <h3 className="font-black text-base">Notice! Reflection Questions</h3>
                </div>
                <ul className="mt-4 space-y-2.5 text-xs font-semibold leading-relaxed text-amber-900">
                  {pjbl.taskModeling.noticeQuestions.map((q, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-1 text-amber-600 font-black">{idx + 1}.</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button variant="primary" onClick={() => setActiveTab("script")}>
                Next: Step 1 (Write Script) →
              </Button>
            </div>
          </motion.div>
        )}

        {/* TAB 2: Script Writing */}
        {activeTab === "script" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">
                {pjbl.steps.step1.title}
              </span>
              <h2 className="mt-2 text-2xl font-black text-[#24332D]">Draft Your Video Script</h2>
              <p className="mt-2 text-sm text-slate-500">{pjbl.steps.step1.instructions}</p>

              <div className="mt-8 space-y-6">
                {pjbl.steps.step1.sections.map((section) => (
                  <div key={section.key} className="rounded-2xl border border-slate-200 p-5 bg-slate-50/50">
                    <label className="block text-sm font-black text-[#24332D] mb-1">
                      {section.label}
                    </label>
                    {section.helper && (
                      <p className="text-xs text-slate-400 mb-3">{section.helper}</p>
                    )}

                    {section.placeholder ? (
                      <textarea
                        rows={4}
                        value={scriptData[section.key] || ""}
                        onChange={(e) => handleScriptChange(section.key, e.target.value)}
                        placeholder={section.placeholder}
                        className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                      />
                    ) : (
                      <div className="rounded-xl bg-white p-4 border border-slate-200">
                        <ul className="space-y-2 text-xs font-semibold text-slate-600">
                          {section.items?.map((item, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-between pt-4 border-t border-slate-100">
                <Button variant="ghost" onClick={() => setActiveTab("modeling")}>
                  ← Back to Modeling
                </Button>
                <Button variant="primary" onClick={() => setActiveTab("create")}>
                  Next: Step 2 (Create Video) →
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: Video Creation Guide */}
        {activeTab === "create" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">
                {pjbl.steps.step2.title}
              </span>
              <h2 className="mt-2 text-2xl font-black text-[#24332D]">Production Guidelines</h2>
              <p className="mt-2 text-sm text-slate-500">{pjbl.steps.step2.instructions}</p>

              <div className="mt-6 rounded-2xl border border-emerald-200 bg-[#EAF4EF]/50 p-6">
                <h3 className="font-black text-sm text-emerald-900 mb-3">
                  Check What Your Video Must Include:
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {pjbl.steps.step2.requirements.map((req, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-emerald-950">
                      <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-emerald-600 text-[10px] text-white">
                        ✓
                      </span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-between pt-4 border-t border-slate-100">
                <Button variant="ghost" onClick={() => setActiveTab("script")}>
                  ← Back to Script
                </Button>
                <Button variant="primary" onClick={() => setActiveTab("submit")}>
                  Next: Step 3 (Checklist & Submit) →
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: Checklist & Submission */}
        {activeTab === "submit" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">
                {pjbl.steps.step3.title}
              </span>
              <h2 className="mt-2 text-2xl font-black text-[#24332D]">
                Project Checklist & Link Submission
              </h2>
              <p className="mt-2 text-sm text-slate-500">{pjbl.steps.step3.instructions}</p>

              {/* Interactive Checklist */}
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
                <h3 className="font-black text-sm text-[#24332D] mb-4">
                  Before Submitting, Verify Your Video:
                </h3>
                <div className="space-y-3">
                  {pjbl.steps.step3.checklist.map((item, idx) => {
                    const checked = Boolean(checkedItems[idx]);
                    return (
                      <label
                        key={idx}
                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 transition hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleChecklist(idx)}
                          className="h-4 w-4 rounded accent-emerald-600"
                        />
                        <span className={`text-xs font-semibold ${checked ? "line-through text-slate-400" : "text-[#24332D]"}`}>
                          {item}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Submission Form */}
              <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-2xl border border-slate-200 p-6 bg-white">
                <h3 className="font-black text-base text-[#24332D]">
                  Submit Your Project Video
                </h3>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Full Name
                    </label>
                    <input
                      disabled
                      value={studentName}
                      className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Attendance Number
                    </label>
                    <input
                      required
                      value={attendanceNo}
                      onChange={(e) => setAttendanceNo(e.target.value)}
                      placeholder="e.g. 01"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Class
                    </label>
                    <input
                      disabled
                      value={studentClass}
                      className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Video Project URL (Google Drive / YouTube / Canva Link)
                  </label>
                  <input
                    type="url"
                    required
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtu.be/... or https://drive.google.com/..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                  <p className="mt-1.5 text-[11px] font-medium text-slate-400">
                    Submission Format Title:{" "}
                    <code className="text-emerald-700 font-bold">
                      {studentName}_{attendanceNo}_{studentClass}
                    </code>
                  </p>
                </div>

                {submittedSuccess && (
                  <p className="rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 size={16} /> Project submitted successfully! Your teacher will review it soon.
                  </p>
                )}

                <div className="flex justify-end pt-3">
                  <Button variant="primary" size="lg" type="submit" disabled={submitting}>
                    {submitting ? "Submitting..." : (
                      <>
                        <Send size={15} /> Submit Video Project
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
