import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BookOpenText,
  CheckCircle2,
  Clock3,
  Headphones,
  Layers3,
  Lock,
  Sparkles,
} from "lucide-react";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import AudioPlayer from "../../components/learning/AudioPlayer";
import ChapterArtwork from "../../components/learning/ChapterArtwork";
import GrammarExplorer from "../../components/learning/GrammarExplorer";
import LearnProgress from "../../components/learning/LearnProgress";
import { getChapterContent } from "../../data/chapters";
import { getChapterTheme } from "../../data/chapterThemes";
import { getStepAssets } from "../../data/stepAssets";
import { getChapterById } from "../../services/chapter";
import { getStudentProgressRows } from "../../services/progress";
import { useAuth } from "../../hooks/useAuth";
import SourceNote from "../../components/common/SourceNote";

import pjblMedal from "../../assets/chapter 1/step 6/assets/card-medalist.png";

const stageOrder = ["introduction", "listen", "grammar"];

function StructureTimeline({ items, theme, night = false }) {
  return (
    <div className={night ? "mt-6" : "mt-8"}>
      {items.map((item, index) => (
        <div key={item.name} className="grid grid-cols-[46px_minmax(0,1fr)] gap-4 sm:grid-cols-[58px_minmax(0,1fr)]">
          <div className="relative flex justify-center">
            {index < items.length - 1 && (
              <span
                style={{ backgroundColor: night ? "rgba(196,181,253,0.7)" : theme?.borderSoft || "#DDE5E0" }}
                className="absolute bottom-0 top-10 w-px"
                aria-hidden="true"
              />
            )}
            <span
              style={{
                backgroundColor: night ? "#5B21B6" : theme?.badgeBg || "#EAF4EF",
                borderColor: night ? "#5B21B6" : theme?.borderSoft || "#BFD5CA",
                color: night ? "#FFFFFF" : theme?.primaryDark || "#3F6252",
              }}
              className="relative z-10 grid h-9 w-9 place-items-center rounded-full border text-xs font-extrabold shadow-xs"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="pb-7">
            <h3
              style={night ? { color: theme?.primaryDark } : undefined}
              className="font-extrabold tracking-[-0.02em] text-[#24332D]"
            >
              {item.name}
            </h3>
            <p className={`mt-1.5 max-w-2xl text-sm leading-6 ${night ? "text-[#6B5A86]" : "text-[#69776F]"}`}>
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function IntroductionSection({ chapter, theme }) {
  const night = Number(chapter.id) === 4;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)] lg:gap-16">
      <div>
        <span
          style={{
            backgroundColor: theme?.badgeBg,
            borderColor: theme?.borderSoft,
            color: theme?.primaryDark,
          }}
          className="ml-eyebrow"
        >
          <BookOpenText size={14} /> Introduction
        </span>
        <h2
          style={night ? { color: theme?.primaryDark } : undefined}
          className="mt-4 text-3xl font-extrabold tracking-[-0.045em] text-[#24332D] sm:text-4xl"
        >
          What is {chapter.title}?
        </h2>
        <p className={`mt-5 max-w-3xl text-lg leading-8 ${night ? "text-[#5B4B73]" : "text-[#53635B]"}`}>
          {chapter.overview.definition}
        </p>

        {night ? (
          <div className="mt-9 max-w-2xl">
            <span
              style={{ backgroundColor: theme.primaryDark, color: "#fff" }}
              className="inline-flex items-center rounded-full px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] shadow-[0_8px_18px_rgba(91,33,182,0.22)]"
            >
              Purpose
            </span>
            <p className="mt-3 text-sm leading-7 text-[#5B4B73] sm:text-base">{chapter.overview.purpose}</p>
          </div>
        ) : (
          <div
            style={{ borderColor: theme?.primary || "#B8D7C8" }}
            className="mt-9 border-l-4 pl-5 sm:pl-7"
          >
            <p
              style={{ color: theme?.primaryMuted }}
              className="text-[10px] font-extrabold uppercase tracking-[0.15em]"
            >
              Purpose
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[#64736C] sm:text-base">{chapter.overview.purpose}</p>
          </div>
        )}
      </div>

      <div
        style={{
          borderColor: night ? "rgba(167,139,250,0.55)" : theme?.borderSoft || "#DDE5E0",
          backgroundColor: night ? "#FFFFFF" : theme?.bgSurface || "rgba(255,255,255,0.7)",
        }}
        className={`overflow-hidden rounded-[28px] border shadow-xs ${
          night ? "shadow-[0_18px_40px_rgba(91,33,182,0.12)]" : ""
        }`}
      >
        <div
          className={`flex items-center justify-between gap-4 ${night ? "px-6 py-5 sm:px-7" : "p-6 sm:p-7 pb-0"}`}
          style={
            night
              ? {
                  background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 58%, #5B21B6 100%)",
                  color: "#fff",
                }
              : undefined
          }
        >
          <div>
            <p
              style={night ? { color: "rgba(255,255,255,0.82)" } : { color: theme?.primaryMuted }}
              className="text-[10px] font-extrabold uppercase tracking-[0.14em]"
            >
              Text structure
            </p>
            <h3
              className={`mt-2 text-xl font-extrabold tracking-[-0.03em] ${night ? "text-white" : "text-[#24332D]"}`}
            >
              Build it in order.
            </h3>
          </div>
          <Layers3 size={22} style={{ color: night ? "#FDE68A" : theme?.primaryDark }} />
        </div>
        <div className={night ? "px-6 pt-2 sm:px-7" : "px-6 sm:px-7 pb-6 sm:pb-7"}>
          <StructureTimeline items={chapter.overview.structure} theme={theme} night={night} />
        </div>
      </div>
      
      <div className="lg:col-span-2">
        <SourceNote source={chapter.overview.source} className="!mt-0" />
      </div>
    </div>
  );
}

function ListenSection({ chapter, theme }) {
  const isAudioOnly = chapter.id === 2 || chapter.id === 4;
  const isReadingOnly = chapter.id === 1 || chapter.id === 3 || chapter.id === 5;
  const night = Number(chapter.id) === 4;

  return (
    <div>
      <div className="max-w-3xl">
        <span
          style={{
            backgroundColor: theme?.badgeBg,
            borderColor: theme?.borderSoft,
            color: theme?.primaryDark,
          }}
          className="ml-eyebrow"
        >
          {isAudioOnly ? (
            <>
              <Headphones size={14} /> 02 · Listening
            </>
          ) : (
            <>
              <BookOpen size={14} /> 02 · Reading
            </>
          )}
        </span>
        <h2
          style={night ? { color: theme?.primaryDark } : undefined}
          className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-[#24332D] sm:text-4xl"
        >
          {isAudioOnly ? "Listen to the Audio Recording" : "Read and Understand the Text"}
        </h2>
        <p className={`mt-3.5 text-sm leading-7 sm:text-base ${night ? "text-[#5B4B73]" : "text-[#65736D]"}`}>
          {isAudioOnly
            ? "Play the narration carefully to catch pronunciation, rhythm, and key information. Listen actively before moving on."
            : "Read the story carefully to understand the context, main ideas, and vocabulary. Take your time to absorb the meaning."}
        </p>
      </div>

      {/* Case 1: Chapter 2 & 4 -> ONLY AUDIO */}
      {isAudioOnly && (
        <div className="mt-8 max-w-2xl">
          <AudioPlayer src={chapter.listening.audioSrc} title={chapter.listening.title} theme={theme} />
          <div className="mt-4 flex items-center gap-2 px-1 text-xs font-semibold text-[#78857F]">
            <Sparkles size={14} style={{ color: theme?.primaryDark }} />
            Listen once for overall understanding, then replay to focus on key vocabulary and details.
          </div>
        </div>
      )}

      {/* Case 2: Chapter 1, 3, 5 -> ONLY READING TEXT in ONE card without numbers */}
      {isReadingOnly && (
        <div className="mt-8 max-w-4xl">
          <article
            style={{ borderColor: theme?.borderSoft || "#DDE5E0" }}
            className="overflow-hidden rounded-[30px] border bg-white/[0.94] shadow-[0_16px_45px_rgba(36,51,45,0.06)]"
          >
            <header
              style={{
                backgroundColor: theme?.badgeBg || "#F7FAF8",
                borderColor: theme?.borderSoft || "#E5EBE7",
                borderLeftWidth: "5px",
                borderLeftColor: theme?.primaryDark || theme?.primary,
              }}
              className="border-b px-6 py-5 sm:px-8"
            >
              <p
                style={{ color: theme?.primaryDark }}
                className="text-[10px] font-extrabold uppercase tracking-[0.15em]"
              >
                Reading Passage
              </p>
              <h3 style={{ color: theme?.primaryDark }} className="mt-1.5 text-xl font-extrabold tracking-[-0.03em] sm:text-2xl">
                {chapter.listening.title}
              </h3>
            </header>
            <div className="px-6 py-6 sm:px-8 sm:py-8">
              <div className="space-y-4">
                {chapter.listening.paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-[15px] sm:text-base leading-relaxed text-[#35483F]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </article>
        </div>
      )}

      <SourceNote source={chapter.listening.source} />
    </div>
  );
}

function MissionHandoff({ chapter, onStart, theme }) {
  const assets = getStepAssets(chapter.id, 1);
  return (
    <div
      style={{
        borderColor: theme?.borderSoft,
        backgroundColor: theme?.primaryDark || "#24332D",
      }}
      className="overflow-hidden rounded-[34px] text-white shadow-[0_28px_75px_rgba(36,51,45,0.18)] relative"
    >
      <div
        style={{ backgroundColor: theme?.primary }}
        className="pointer-events-none absolute -right-10 -bottom-10 h-64 w-64 rounded-full opacity-35 blur-3xl"
      />
      <div className="grid gap-8 p-7 sm:p-9 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center lg:p-10 relative z-10">
        <div>
          <span
            style={{
              backgroundColor: theme?.badgeBg,
              borderColor: theme?.borderSoft || theme?.border,
              color: theme?.primaryDark,
            }}
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em]"
          >
            <CheckCircle2 size={14} /> Learn section complete
          </span>
          <h3 className="mt-3.5 max-w-3xl text-2xl font-extrabold tracking-[-0.04em] text-white sm:text-3xl lg:text-4xl">
            Ready for the 6-Step Learning Mission?
          </h3>
          <p className="mt-2 text-sm font-bold text-white/95">
            One session. Six connected ways to learn.
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-white/85">
            Provide → Restate → Visualize → Engage → Discuss → Games. Once you start the mission, plan to finish all six steps in the same learning session.
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-xs font-bold text-white/70">
            <span className="inline-flex items-center gap-2"><Clock3 size={14} /> {chapter.duration}</span>
            <span>6 connected activities</span>
            <span>Autosave-ready flow</span>
          </div>
        </div>

        {assets?.leftTop && (
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="hidden lg:flex justify-center shrink-0 select-none pointer-events-none"
          >
            <img
              src={assets.leftTop}
              alt=""
              className="h-36 w-auto object-contain drop-shadow-[0_16px_30px_rgba(0,0,0,0.35)]"
            />
          </motion.div>
        )}

        <Button theme={theme} variant="pastel" size="lg" onClick={onStart} className="w-full lg:w-auto shrink-0 font-extrabold">
          Start Mission <ArrowRight size={17} />
        </Button>
      </div>
    </div>
  );
}

function PjblHandoff({ chapter, onStartProject, isComplete, theme }) {
  return (
    <div
      style={isComplete ? { borderColor: theme?.borderSoft, backgroundColor: theme?.bgSurface || "rgba(234,244,239,0.5)" } : {}}
      className={`mt-8 overflow-hidden rounded-[34px] border p-7 sm:p-9 shadow-[0_16px_40px_rgba(36,51,45,0.06)] transition-all ${
        isComplete
          ? Number(chapter.id) === 4
            ? "border-violet-200 bg-gradient-to-br from-[#F5F3FF] via-white to-[#FCE7F3]"
            : "border-[#CDE1D6] bg-gradient-to-br from-[#EAF4EF] via-white to-[#F4F8F6]"
          : Number(chapter.id) === 4
            ? "border-violet-100 bg-[#F8F5FF] opacity-85"
            : "border-[#E2E8E4] bg-[#F7F9F8] opacity-85"
      }`}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center">
        <div>
          <span
            style={isComplete ? { backgroundColor: theme?.badgeBg, borderColor: theme?.border, color: theme?.badgeText } : {}}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] ${
              isComplete
                ? "border-[#9FC5B4] bg-[#DCEFE6] text-[#24533C]"
                : "border-[#DCE4DF] bg-white text-[#73837B]"
            }`}
          >
            {isComplete ? (
              <>
                <Sparkles size={13} className="text-amber-500" /> Real-World Project (Unlocked)
              </>
            ) : (
              <>
                <Lock size={12} className="text-[#73837B]" /> Project (Locked)
              </>
            )}
          </span>
          <h3 className="mt-3 text-2xl font-extrabold tracking-[-0.035em] text-[#24332D] sm:text-3xl">
            Ultimate Project: {chapter.project?.title || `${chapter.title} Project`}
          </h3>
          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-[#596B63]">
            {isComplete
              ? "Apply your English skills in an authentic video project! Watch modeling examples, draft your script, review production guidelines, and submit your video link for teacher evaluation."
              : "This video project is locked. You must complete all 6 steps of the Marzano Learning Mission (Provide, Restate, Visualize, Engage, Discuss, Games) to unlock this project."}
          </p>
        </div>

        {isComplete && (
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
            className="hidden lg:flex justify-center shrink-0 select-none pointer-events-none"
          >
            <img
              src={pjblMedal}
              alt=""
              className="h-32 w-auto object-contain drop-shadow-md"
            />
          </motion.div>
        )}

        {isComplete ? (
          <Button variant="primary" size="lg" onClick={onStartProject} className="w-full whitespace-nowrap lg:w-auto shrink-0">
            Open Project <ArrowRight size={17} />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="lg"
            disabled
            className="w-full whitespace-nowrap border border-[#DDE4DF] bg-white/70 text-[#7A8881] cursor-not-allowed opacity-75 lg:w-auto shrink-0"
          >
            <Lock size={15} /> Locked (Finish 6 Steps First)
          </Button>
        )}
      </div>
    </div>
  );
}

export default function Chapter() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const bundled = useMemo(() => getChapterContent(id), [id]);
  const [chapterMeta, setChapterMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState("introduction");
  const [completed, setCompleted] = useState([]);
  const [missionComplete, setMissionComplete] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await getChapterById(id);
        if (mounted) setChapterMeta(data);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  useEffect(() => {
    let mounted = true;
    async function checkMission() {
      if (!user?.id || !id) return;
      try {
        const cNum = Number(id);
        const rows = await getStudentProgressRows(user.id);
        const row = rows.find(
          (r) =>
            Number(r.chapter_id) === cNum ||
            Number(r.chapter_id) === 15 + cNum ||
            Number(r.chapter_id) === cNum - 15
        );
        if (mounted) {
          let done =
            row &&
            (Number(row.percentage) >= 100 ||
              Number(row.steps_completed) >= 6 ||
              (row.provide && row.restate && row.visualize && row.engage && row.discuss && row.play));

          if (!done) {
            const keys = [
              `marzalearn-session-v1:${user.id}:${cNum}`,
              `marzalearn-session:${user.id}:${cNum}`,
              `marzalearn-session-v1:${user.id}:${cNum + 15}`,
              `marzalearn-session:${user.id}:${cNum + 15}`,
            ];
            for (const k of keys) {
              const raw = localStorage.getItem(k);
              if (raw) {
                try {
                  const s = JSON.parse(raw);
                  if (
                    s?.status === "completed" ||
                    (Array.isArray(s?.completedSteps) && s.completedSteps.length >= 6)
                  ) {
                    done = true;
                    break;
                  }
                } catch (err) {}
              }
            }
          }

          setMissionComplete(Boolean(done));
        }
      } catch (e) {}
    }
    checkMission();

    function handleReset() {
      checkMission();
    }
    window.addEventListener("marzalearn:session-reset", handleReset);
    window.addEventListener("storage", handleReset);

    let bc = null;
    try {
      if (typeof BroadcastChannel !== "undefined") {
        bc = new BroadcastChannel("marzalearn_sync");
        bc.onmessage = () => {
          checkMission();
        };
      }
    } catch (e) {}

    return () => {
      mounted = false;
      window.removeEventListener("marzalearn:session-reset", handleReset);
      window.removeEventListener("storage", handleReset);
      if (bc) bc.close();
    };
  }, [user?.id, id]);

  const chapter = bundled ? { ...chapterMeta, ...bundled } : null;
  const theme = useMemo(() => getChapterTheme(chapter?.id), [chapter?.id]);

  if (loading) return <Loader label="Opening your chapter..." />;

  if (!chapter) {
    return (
      <div className="py-20 text-center">
        <p className="ml-eyebrow">Chapter not found</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-[#24332D]">This chapter is not available.</h1>
        <Button variant="secondary" className="mt-7" onClick={() => navigate("/student/chapters")}>
          <ArrowLeft size={16} /> Back to chapters
        </Button>
      </div>
    );
  }

  function goToStage(nextStage) {
    const currentIndex = stageOrder.indexOf(activeStage);
    const nextIndex = stageOrder.indexOf(nextStage);
    if (nextIndex > currentIndex) {
      setCompleted((items) =>
        Array.from(new Set([...items, ...stageOrder.slice(0, nextIndex)]))
      );
    }
    setActiveStage(nextStage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function next() {
    const index = stageOrder.indexOf(activeStage);
    if (index < stageOrder.length - 1) goToStage(stageOrder[index + 1]);
  }

  function previous() {
    const index = stageOrder.indexOf(activeStage);
    if (index > 0) goToStage(stageOrder[index - 1]);
  }

  const isGrammar = activeStage === "grammar";
  const night = Number(chapter.id) === 4;

  return (
    <div className="relative">
      {/* Dynamic ambient page glow matching chapter theme */}
      <div
        style={{ backgroundColor: theme?.primary }}
        className={`pointer-events-none fixed inset-0 blur-3xl -z-10 ${night ? "opacity-[0.18]" : "opacity-[0.05]"}`}
      />

      <section className={`relative overflow-hidden pb-8 pt-2 sm:pb-10 sm:pt-5 ${night ? "border-b border-violet-200/70" : "border-b border-[#E3E9E5]"}`}>
        <button
          type="button"
          onClick={() => navigate("/student/chapters")}
          className={`mb-7 inline-flex items-center gap-2 text-xs font-extrabold transition-colors ${
            night ? "text-violet-400 hover:text-[#5B21B6]" : "text-[#6B7972] hover:text-[#24332D]"
          }`}
        >
          <ArrowLeft size={15} /> All chapters
        </button>

        <div className="grid items-center gap-5 lg:grid-cols-[minmax(0,1.04fr)_minmax(360px,0.8fr)] lg:gap-10">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span
              className={night ? "ml-eyebrow rounded-full border border-violet-200 bg-white/80 px-3 py-1 text-[#7C3AED]" : "ml-eyebrow"}
            >
              Semester {chapter.semester} · Chapter {String(chapter.id).padStart(2, "0")}
            </span>
            <h1
              style={night ? { color: theme?.primaryDark } : undefined}
              className="mt-4 max-w-3xl text-4xl font-extrabold tracking-[-0.055em] text-[#24332D] sm:text-5xl lg:text-6xl"
            >
              {chapter.title}
            </h1>
            <p className={`mt-5 max-w-2xl text-base leading-8 sm:text-lg ${night ? "text-[#5B4B73]" : "text-[#5D6D65]"}`}>
              {chapter.heroLine}
            </p>
            <div className={`mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold ${night ? "text-[#7C6A99]" : "text-[#738079]"}`}>
              <span>{chapter.focus}</span>
              <span>•</span>
              <span>{chapter.duration}</span>
              <span>•</span>
              <span>{chapter.id === 2 || chapter.id === 4 ? "Listening Audio" : "Reading Text"}</span>
            </div>
          </motion.div>
          <ChapterArtwork chapterId={chapter.id} title={chapter.title} />
        </div>
      </section>

      <LearnProgress active={activeStage} completed={completed} theme={theme} onSelect={goToStage} chapterId={chapter.id} />

      <section className="min-h-[540px] pb-8 pt-2 sm:pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
          >
            {activeStage === "introduction" && <IntroductionSection chapter={chapter} theme={theme} />}
            {activeStage === "listen" && <ListenSection chapter={chapter} theme={theme} />}
            {activeStage === "grammar" && <GrammarExplorer grammar={chapter.grammar} theme={theme} />}
          </motion.div>
        </AnimatePresence>
      </section>

      <div className={`mb-9 flex items-center justify-between pt-6 ${night ? "border-t border-violet-200/70" : "border-t border-[#E2E8E4]"}`}>
        <Button
          variant="ghost"
          onClick={previous}
          disabled={activeStage === stageOrder[0]}
          className={night ? "rounded-full text-violet-500 hover:bg-violet-50 hover:text-[#5B21B6]" : ""}
        >
          <ArrowLeft size={16} /> Previous
        </Button>
        {!isGrammar && (
          <Button theme={theme} variant="primary" onClick={next} className={night ? "rounded-full px-6 shadow-[0_12px_28px_rgba(91,33,182,0.28)]" : ""}>
            Next: {activeStage === "introduction" ? (chapter.id === 2 || chapter.id === 4 ? "Listening Audio" : "Reading Text") : "Grammar Corner"} <ArrowRight size={16} />
          </Button>
        )}
      </div>

      {isGrammar && (
        <div className="space-y-6">
          <MissionHandoff
            chapter={chapter}
            theme={theme}
            onStart={() => navigate(`/student/chapter/${chapter.id}/session`)}
          />
          <PjblHandoff
            chapter={chapter}
            theme={theme}
            isComplete={missionComplete}
            onStartProject={() => navigate(`/student/chapter/${chapter.id}/project`)}
          />
        </div>
      )}
    </div>
  );
}
