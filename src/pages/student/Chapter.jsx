import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
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

function StructureTimeline({ items, theme }) {
  return (
    <div className="mt-8">
      {items.map((item, index) => (
        <div key={item.name} className="grid grid-cols-[46px_minmax(0,1fr)] gap-4 sm:grid-cols-[58px_minmax(0,1fr)]">
          <div className="relative flex justify-center">
            {index < items.length - 1 && (
              <span
                style={{ backgroundColor: theme?.borderSoft || "#DDE5E0" }}
                className="absolute bottom-0 top-10 w-px"
                aria-hidden="true"
              />
            )}
            <span
              style={{
                backgroundColor: theme?.badgeBg || "#EAF4EF",
                borderColor: theme?.borderSoft || "#BFD5CA",
                color: theme?.primaryDark || "#3F6252",
              }}
              className="relative z-10 grid h-9 w-9 place-items-center rounded-full border text-xs font-extrabold shadow-xs"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="pb-7">
            <h3 className="font-extrabold tracking-[-0.02em] text-[#24332D]">{item.name}</h3>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[#69776F]">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function IntroductionSection({ chapter, theme }) {
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
        <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.045em] text-[#24332D] sm:text-4xl">
          What is {chapter.title}?
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[#53635B]">{chapter.overview.definition}</p>

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
      </div>

      <div
        style={{
          borderColor: theme?.borderSoft || "#DDE5E0",
          backgroundColor: theme?.bgSurface || "rgba(255,255,255,0.7)",
        }}
        className="rounded-[28px] border p-6 sm:p-7 shadow-xs"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p
              style={{ color: theme?.primaryMuted }}
              className="text-[10px] font-extrabold uppercase tracking-[0.14em]"
            >
              Text structure
            </p>
            <h3 className="mt-2 text-xl font-extrabold tracking-[-0.03em] text-[#24332D]">Build it in order.</h3>
          </div>
          <Layers3 size={22} style={{ color: theme?.primaryDark }} />
        </div>
        <StructureTimeline items={chapter.overview.structure} theme={theme} />
      </div>
      
      <div className="lg:col-span-2">
        <SourceNote source={chapter.overview.source} className="!mt-0" />
      </div>
    </div>
  );
}

function ListenSection({ chapter, theme }) {
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
          <Headphones size={14} /> Listen & read
        </span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-[#24332D] sm:text-4xl">
          Hear the rhythm, then follow the text.
        </h2>
        <p className="mt-4 text-sm leading-7 text-[#65736D] sm:text-base">
          Play the narration and read along. You can pause, replay, seek, or change the playback speed whenever you need.
        </p>
      </div>

      <div className="mt-8 grid gap-7 lg:grid-cols-[minmax(300px,0.74fr)_minmax(0,1.26fr)] lg:items-start">
        <div className="lg:sticky lg:top-[164px]">
          <AudioPlayer src={chapter.listening.audioSrc} title={chapter.listening.title} theme={theme} />
          <div className="mt-4 flex items-center gap-2 px-1 text-xs font-semibold text-[#78857F]">
            <Sparkles size={14} style={{ color: theme?.primaryDark }} />
            Listen once for meaning, then replay while reading.
          </div>
        </div>

        <article
          style={{ borderColor: theme?.borderSoft || "#DDE5E0" }}
          className="overflow-hidden rounded-[30px] border bg-white/[0.9] shadow-[0_16px_45px_rgba(36,51,45,0.05)]"
        >
          <header
            style={{
              backgroundColor: theme?.badgeBg || "#F7FAF8",
              borderColor: theme?.borderSoft || "#E5EBE7",
              borderLeftWidth: "5px",
              borderLeftColor: theme?.primary,
            }}
            className="border-b px-6 py-5 sm:px-8"
          >
            <p
              style={{ color: theme?.primaryDark }}
              className="text-[10px] font-extrabold uppercase tracking-[0.15em]"
            >
              Reading text
            </p>
            <h3 style={{ color: theme?.primaryDark }} className="mt-2 text-xl font-extrabold tracking-[-0.03em] sm:text-2xl">
              {chapter.listening.title}
            </h3>
          </header>
          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <div className="ml-reading-width space-y-5">
              {chapter.listening.paragraphs.map((paragraph, index) => (
                <div key={index} className="grid grid-cols-[28px_minmax(0,1fr)] gap-3">
                  <span
                    style={{ color: theme?.primaryMuted }}
                    className="pt-1 text-[10px] font-extrabold tabular-nums"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[15px] leading-8 text-[#4F5F57] sm:text-base">{paragraph}</p>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>

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
      className="overflow-hidden rounded-[34px] text-white shadow-[0_28px_75px_rgba(36,51,45,0.15)] relative"
    >
      <div
        style={{ backgroundColor: theme?.primary }}
        className="pointer-events-none absolute -right-10 -bottom-10 h-56 w-56 rounded-full opacity-30 blur-2xl"
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
          <h3 className="mt-3 max-w-2xl text-2xl font-extrabold tracking-[-0.04em] text-white sm:text-3xl">
            Ready for the 6-Step Learning Mission?
          </h3>
          <p className="mt-2 text-sm font-bold text-white/90">
            One session. Six connected ways to learn.
          </p>
          <p className="mt-1.5 max-w-2xl text-sm leading-7 text-white/75">
            Provide → Restate → Visualize → Engage → Discuss → Games. Once you start the mission, plan to finish all six steps in the same learning session.
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-xs font-bold text-white/60">
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
          ? "border-[#CDE1D6] bg-gradient-to-br from-[#EAF4EF] via-white to-[#F4F8F6]"
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
        const rows = await getStudentProgressRows(user.id);
        const row = rows.find(
          (r) => Number(r.chapter_id) === Number(id) || Number(r.chapter_id) === 15 + Number(id)
        );
        if (mounted) {
          const done =
            row &&
            (Number(row.percentage) >= 100 ||
              (row.provide && row.restate && row.visualize && row.engage && row.discuss && row.play));
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

  return (
    <div className="relative">
      {/* Dynamic ambient page glow matching chapter theme */}
      <div
        style={{ backgroundColor: theme?.primary }}
        className="pointer-events-none fixed inset-0 opacity-[0.05] blur-3xl -z-10"
      />

      <section className="relative overflow-hidden border-b border-[#E3E9E5] pb-8 pt-2 sm:pb-10 sm:pt-5">
        <button
          type="button"
          onClick={() => navigate("/student/chapters")}
          className="mb-7 inline-flex items-center gap-2 text-xs font-extrabold text-[#6B7972] transition-colors hover:text-[#24332D]"
        >
          <ArrowLeft size={15} /> All chapters
        </button>

        <div className="grid items-center gap-5 lg:grid-cols-[minmax(0,1.04fr)_minmax(360px,0.8fr)] lg:gap-10">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="ml-eyebrow">Semester {chapter.semester} · Chapter {String(chapter.id).padStart(2, "0")}</span>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-[-0.055em] text-[#24332D] sm:text-5xl lg:text-6xl">
              {chapter.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#5D6D65] sm:text-lg">{chapter.heroLine}</p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-[#738079]">
              <span>{chapter.focus}</span>
              <span>•</span>
              <span>{chapter.duration}</span>
              <span>•</span>
              <span>Listening included</span>
            </div>
          </motion.div>
          <ChapterArtwork chapterId={chapter.id} title={chapter.title} />
        </div>
      </section>

      <LearnProgress active={activeStage} completed={completed} theme={theme} onSelect={goToStage} />

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

      <div className="mb-9 flex items-center justify-between border-t border-[#E2E8E4] pt-6">
        <Button variant="ghost" onClick={previous} disabled={activeStage === stageOrder[0]}>
          <ArrowLeft size={16} /> Previous
        </Button>
        {!isGrammar && (
          <Button theme={theme} variant="primary" onClick={next}>
            Next: {activeStage === "introduction" ? "Listen & Read" : "Grammar Corner"} <ArrowRight size={16} />
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
