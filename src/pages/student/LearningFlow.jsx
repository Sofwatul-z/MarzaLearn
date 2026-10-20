import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brush,
  Check,
  CheckCircle2,
  Cloud,
  CloudOff,
  Gamepad2,
  Link2,
  MessageSquareText,
  PenLine,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import StepProgress from "../../components/learning/StepProgress";
import DiscussStep from "../../components/learning/steps/DiscussStep";
import EngageStep from "../../components/learning/steps/EngageStep";
import GamesStep from "../../components/learning/steps/GamesStep";
import ProvideStep from "../../components/learning/steps/ProvideStep";
import RestateStep from "../../components/learning/steps/RestateStep";
import VisualizeStep from "../../components/learning/steps/VisualizeStep";
import BouncingGuideArrow from "../../components/learning/BouncingGuideArrow";
import { getChapterContent } from "../../data/chapters";
import { getStepAssets } from "../../data/stepAssets";
import { useAuth } from "../../hooks/useAuth";
import useMarzanoSession from "../../hooks/useMarzanoSession";

const steps = [
  { key: "provide", label: "Provide", icon: BookOpen, note: "Discover the target words and meanings." },
  { key: "restate", label: "Restate", icon: PenLine, note: "Use the words in your own sentences." },
  { key: "visualize", label: "Visualize", icon: Brush, note: "Turn meaning into a drawing or visual." },
  { key: "engage", label: "Engage", icon: Link2, note: "Match, connect, and refine your understanding." },
  { key: "discuss", label: "Discuss", icon: MessageSquareText, note: "Express your idea with the language you learned." },
  { key: "games", label: "Games", icon: Gamepad2, note: "Finish with a short challenge and score." },
];

function isStepReady(chapter, session, stepNumber) {
  const data = session.data;

  if (stepNumber === 1) {
    return (data.provide?.seen?.length ?? 0) >= chapter.marzano.provide.vocabulary.length;
  }

  if (stepNumber === 2) {
    return chapter.marzano.restate.prompts.every((_, index) =>
      data.restate?.responses?.[index]?.trim()
    );
  }

  if (stepNumber === 3) {
    return chapter.marzano.visualize.prompts.every(
      (_, index) => Boolean(data.visualize?.items?.[index]?.savedAt)
    );
  }

  if (stepNumber === 4) {
    return (data.engage?.matched?.length ?? 0) >= chapter.marzano.engage.pairs.length;
  }

  if (stepNumber === 5) {
    return (data.discuss?.response?.trim().length ?? 0) >= 20;
  }

  if (stepNumber === 6) {
    return Object.keys(data.games?.answers ?? {}).length >= chapter.marzano.games.questions.length;
  }

  return false;
}

function SaveIndicator({ state }) {
  const content = {
    saving: { icon: RefreshCw, text: "Saving", className: "text-[#718078]" },
    saved: { icon: Cloud, text: "Saved", className: "text-[#557466]" },
    local: { icon: CloudOff, text: "Saved on device", className: "text-[#8C6D5D]" },
    idle: { icon: ShieldCheck, text: "Autosave ready", className: "text-[#718078]" },
  }[state] ?? { icon: ShieldCheck, text: "Autosave ready", className: "text-[#718078]" };

  const Icon = content.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold ${content.className}`}>
      <Icon size={13} className={state === "saving" ? "animate-spin" : ""} /> {content.text}
    </span>
  );
}

function MissionIntro({ chapter, recovered, onStart, onBack }) {
  const introAsset = getStepAssets(chapter?.id, 1);

  return (
    <div className="pb-8">
      <button
        type="button"
        onClick={onBack}
        className="mb-7 inline-flex items-center gap-2 text-xs font-extrabold text-[#6B7972] transition-colors hover:text-[#24332D]"
      >
        <ArrowLeft size={15} /> Back to chapter learning
      </button>

      <section className="relative overflow-hidden rounded-[34px] bg-[#24332D] px-6 py-8 text-white shadow-[0_28px_75px_rgba(36,51,45,0.15)] sm:px-9 sm:py-10 lg:px-11">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#CFE8DD]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-[#F4D7C5]/10 blur-3xl" />

        <div className="relative grid gap-9 lg:grid-cols-[minmax(0,1fr)_auto_260px] lg:items-center">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#B9D8CA]">
              Chapter {String(chapter.id).padStart(2, "0")} · 6-Step Mission
            </span>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-[-0.055em] text-white sm:text-5xl">
              One session. Six connected ways to learn.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              Move from vocabulary discovery to your own sentences, visuals, matching, discussion, and a final game. Each next step opens only after the current activity is complete.
            </p>
          </div>

          {introAsset?.leftTop && (
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
              className="hidden lg:flex justify-center shrink-0"
            >
              <img
                src={introAsset.leftTop}
                alt=""
                className="h-44 w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
              />
            </motion.div>
          )}

          <div className="rounded-[24px] border border-white/10 bg-white/[0.07] p-5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/45">Session rule</p>
            <p className="mt-2 text-sm font-bold leading-6 text-white/85">
              Plan to finish all six steps in this sitting. Autosave exists for refresh or connection recovery, not as a multi-day workflow.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-12">
        <div className="mb-7 max-w-2xl">
          <span className="ml-eyebrow">Mission roadmap</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-[#24332D]">Six steps, one learning flow.</h2>
        </div>

        <div className="relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const content = chapter.marzano?.[step.key];
            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.26 }}
                className="grid grid-cols-[52px_minmax(0,1fr)] gap-4 sm:grid-cols-[68px_minmax(0,1fr)] sm:gap-6"
              >
                <div className="relative flex justify-center">
                  {index < steps.length - 1 && <span className="absolute bottom-0 top-12 w-px bg-[#DDE5E0]" />}
                  <span className={`relative z-10 grid h-11 w-11 place-items-center rounded-full border ${index === 0 ? "border-[#24332D] bg-[#24332D] text-white" : "border-[#D7E1DC] bg-[#FBFCF8] text-[#6F7D76]"}`}>
                    <Icon size={17} />
                  </span>
                </div>
                <div className="border-b border-[#E3E9E5] pb-7 pt-0.5 last:border-b-0 sm:pb-8">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8A9690]">Step {String(index + 1).padStart(2, "0")}</span>
                    <h3 className="text-xl font-extrabold tracking-[-0.03em] text-[#24332D]">{step.label}</h3>
                  </div>
                  <p className="mt-2 text-sm font-bold leading-6 text-[#53645B]">{content?.title}</p>
                  <p className="mt-1 text-xs leading-5 text-[#8A9690]">{step.note}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-[26px] border border-[#D7E3DC] bg-[#EAF4EF]/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#688075]">Ready when you are</p>
            <p className="mt-1 font-extrabold tracking-[-0.02em] text-[#24332D]">
              {recovered ? "A previous in-progress session was recovered." : `Provide begins with ${chapter.marzano.provide.vocabulary.length} target words.`}
            </p>
            <p className="mt-1 text-xs leading-5 text-[#75827C]">
              {recovered ? "Continue from the last autosaved step." : "Starting creates your learning session and enables recovery autosave."}
            </p>
          </div>
          <Button variant="primary" size="lg" onClick={onStart} className="w-full sm:w-auto">
            {recovered ? "Resume Mission" : "Start Mission"} <ArrowRight size={17} />
          </Button>
        </div>
      </section>
    </div>
  );
}

function MissionComplete({ chapter, session, saveState, onBackToChapter, onDashboard, onPjbl }) {
  const engagePairs = chapter.marzano.engage.pairs;
  const matched = session.data.engage?.matched ?? [];
  const mistakes = session.data.engage?.mistakeTerms ?? {};
  const engageScore = engagePairs.filter(([term]) => matched.includes(term) && !mistakes[term]).length;
  const gameAnswers = session.data.games?.answers ?? {};
  const gameScore = Object.values(gameAnswers).filter((answer) => answer?.correct).length;
  const pendingVisuals = Object.values(session.data.visualize?.items ?? {}).filter((item) => item?.pendingUpload).length;

  return (
    <div className="pb-10 pt-4">
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[36px] border border-[#C9DDD2] bg-[#EAF4EF]/80 px-6 py-9 sm:px-10 sm:py-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#24332D] text-white shadow-[0_12px_28px_rgba(36,51,45,0.18)]">
            <CheckCircle2 size={24} />
          </div>
          <span className="mt-6 inline-block text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#5E786B]">6 / 6 steps completed</span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.055em] text-[#24332D] sm:text-5xl">Mission Complete! 🏆</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#64736C] sm:text-base">
            Your {chapter.title} learning mission is completed. Now you are ready to unleash your creativity in the Ultimate Project-Based Learning (PjBL) video project!
          </p>
        </div>

        <div className="mx-auto mt-9 grid max-w-4xl gap-px overflow-hidden rounded-[24px] border border-[#D4E1DA] bg-[#D4E1DA] sm:grid-cols-3">
          <div className="bg-white/85 p-5 text-center">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#849089]">Engage</p>
            <p className="mt-2 text-2xl font-extrabold text-[#24332D]">{engageScore}/{engagePairs.length}</p>
            <p className="mt-1 text-xs text-[#7A8780]">first-try matches</p>
          </div>
          <div className="bg-white/85 p-5 text-center">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#849089]">Games</p>
            <p className="mt-2 text-2xl font-extrabold text-[#24332D]">{gameScore}/{chapter.marzano.games.questions.length}</p>
            <p className="mt-1 text-xs text-[#7A8780]">correct answers</p>
          </div>
          <div className="bg-white/85 p-5 text-center">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#849089]">Teacher Review</p>
            <p className="mt-2 text-base font-extrabold text-[#24332D]">Saved & Ready</p>
            <p className="mt-1 text-xs text-[#7A8780]">Restate · Visualize · Discuss</p>
          </div>
        </div>

        {pendingVisuals > 0 && (
          <div className="mx-auto mt-5 max-w-4xl rounded-[18px] border border-[#E5C8B8] bg-[#FBEDE4] px-4 py-3 text-xs font-semibold leading-5 text-[#76594C]">
            {pendingVisuals} visual {pendingVisuals === 1 ? "file is" : "files are"} saved for recovery on this device.
          </div>
        )}

        <div className="mt-7 flex justify-center"><SaveIndicator state={saveState} /></div>

        {/* Prominent PjBL Action */}
        <div className="mt-6 flex flex-col items-center justify-center gap-4">
          <Button
            size="lg"
            variant="primary"
            onClick={onPjbl}
            className="w-full sm:w-auto bg-[#1C2C25] hover:bg-[#283E34] text-white font-black py-4 px-9 rounded-full ring-4 ring-emerald-400/30 shadow-xl shadow-[#24332D]/20 text-base"
          >
            <Sparkles size={18} className="text-yellow-300" /> Start Ultimate PjBL Video Project <ArrowRight size={18} />
          </Button>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="secondary" onClick={onBackToChapter} disabled={saveState === "saving"}>
              <ArrowLeft size={16} /> Back to Chapter
            </Button>
            <Button variant="ghost" onClick={onDashboard} disabled={saveState === "saving"}>
              Student Dashboard <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </motion.section>

      <div className="mt-7 border-l-2 border-emerald-500/40 pl-5">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-800">Next Step: Project-Based Learning</p>
        <p className="mt-1 font-extrabold text-[#24332D]">Turn your new language skills into a creative digital video.</p>
        <p className="mt-1 max-w-2xl text-xs leading-5 text-[#7B8781]">Plan your script, follow the video production steps, and submit your link directly for teacher review.</p>
      </div>
    </div>
  );
}

export default function LearningFlow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const chapter = useMemo(() => getChapterContent(id), [id]);
  const {
    session,
    loading,
    saveState,
    recovered,
    startSession,
    updateStepData,
    goToStep,
    completeStep,
  } = useMarzanoSession(chapter?.id);

  const currentStep = session.currentStep;
  const stepAssets = useMemo(
    () => getStepAssets(chapter?.id, currentStep),
    [chapter?.id, currentStep]
  );

  if (!chapter) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-[#24332D]">Chapter not found.</h1>
        <Button variant="secondary" className="mt-6" onClick={() => navigate("/student/chapters")}>
          <ArrowLeft size={16} /> Back to chapters
        </Button>
      </div>
    );
  }

  if (loading) return <Loader label="Preparing your 6-Step Mission..." />;

  if (session.status === "not_started") {
    return (
      <MissionIntro
        chapter={chapter}
        recovered={recovered}
        onStart={() => {
          startSession();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onBack={() => navigate(`/student/chapter/${chapter.id}`)}
      />
    );
  }

  if (session.status === "completed") {
    return (
      <MissionComplete
        chapter={chapter}
        session={session}
        saveState={saveState}
        onBackToChapter={() => navigate(`/student/chapter/${chapter.id}`)}
        onDashboard={() => navigate("/student/dashboard")}
        onPjbl={() => navigate(`/student/chapter/${chapter.id}/project`)}
      />
    );
  }

  const stepIndex = Math.max(0, Math.min(steps.length - 1, (currentStep || 1) - 1));
  const step = steps[stepIndex] || steps[0];
  const ready = isStepReady(chapter, session, currentStep);

  function nextStep() {
    if (!ready) return;
    completeStep(currentStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function previousStep() {
    if (currentStep <= 1) return;
    goToStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="relative max-w-5xl mx-auto pb-8">
      {/* LEFT FLANK (Blue Circles) - Positioned in the outer left gutter (Larger size with gentle floating motion) */}
      {(stepAssets?.leftTop || stepAssets?.leftBottom) && (
        <aside
          className="hidden xl:flex flex-col items-center justify-between absolute right-[calc(100%+1.75rem)] 2xl:right-[calc(100%+3rem)] top-2 bottom-24 w-52 2xl:w-64 pointer-events-none select-none z-10"
          aria-hidden="true"
        >
          {/* Blue Circle 1 (Top Left): Level with Header & Step Progress */}
          {stepAssets.leftTop && (
            <motion.div
              key={`lt-${chapter.id}-${currentStep}`}
              initial={{ opacity: 0, scale: 0.85, x: -16 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: [0, -10, 0] }}
              transition={{
                duration: 0.35,
                y: { duration: 4.6, repeat: Infinity, ease: "easeInOut" },
              }}
              className="flex flex-col items-center"
            >
              <img
                src={stepAssets.leftTop}
                alt=""
                className="w-44 2xl:w-56 max-h-64 2xl:max-h-72 object-contain drop-shadow-[0_18px_36px_rgba(36,51,45,0.18)]"
                loading="lazy"
              />
            </motion.div>
          )}

          {/* Blue Circle 2 (Bottom Left): Level with lower activity cards */}
          {stepAssets.leftBottom && (
            <motion.div
              key={`lb-${chapter.id}-${currentStep}`}
              initial={{ opacity: 0, scale: 0.85, x: -16 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: [0, -8, 0] }}
              transition={{
                duration: 0.35,
                delay: 0.1,
                y: { duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
              }}
              className="flex flex-col items-center mt-auto pt-16"
            >
              <img
                src={stepAssets.leftBottom}
                alt=""
                className="w-38 2xl:w-50 max-h-56 2xl:max-h-64 object-contain drop-shadow-[0_14px_28px_rgba(36,51,45,0.15)]"
                loading="lazy"
              />
            </motion.div>
          )}
        </aside>
      )}

      {/* RIGHT FLANK (Red Circles) - Positioned in the outer right gutter (Larger size with gentle floating motion) */}
      {(stepAssets?.rightTop || stepAssets?.rightBottom) && (
        <aside
          className="hidden xl:flex flex-col items-center justify-between absolute left-[calc(100%+1.75rem)] 2xl:left-[calc(100%+3rem)] top-2 bottom-24 w-52 2xl:w-64 pointer-events-none select-none z-10"
          aria-hidden="true"
        >
          {/* Red Circle 1 (Top Right): Level with Header & Step Progress */}
          {stepAssets.rightTop && (
            <motion.div
              key={`rt-${chapter.id}-${currentStep}`}
              initial={{ opacity: 0, scale: 0.85, x: 16 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: [0, -10, 0] }}
              transition={{
                duration: 0.35,
                y: { duration: 5.0, repeat: Infinity, ease: "easeInOut", delay: 0.2 },
              }}
              className="flex flex-col items-center"
            >
              <img
                src={stepAssets.rightTop}
                alt=""
                className="w-44 2xl:w-56 max-h-64 2xl:max-h-72 object-contain drop-shadow-[0_18px_36px_rgba(36,51,45,0.18)]"
                loading="lazy"
              />
            </motion.div>
          )}

          {/* Red Circle 2 (Bottom Right): Level with lower activity cards */}
          {stepAssets.rightBottom && (
            <motion.div
              key={`rb-${chapter.id}-${currentStep}`}
              initial={{ opacity: 0, scale: 0.85, x: 16 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: [0, -8, 0] }}
              transition={{
                duration: 0.35,
                delay: 0.1,
                y: { duration: 5.4, repeat: Infinity, ease: "easeInOut", delay: 0.7 },
              }}
              className="flex flex-col items-center mt-auto pt-16"
            >
              <img
                src={stepAssets.rightBottom}
                alt=""
                className="w-38 2xl:w-50 max-h-56 2xl:max-h-64 object-contain drop-shadow-[0_14px_28px_rgba(36,51,45,0.15)]"
                loading="lazy"
              />
            </motion.div>
          )}
        </aside>
      )}

      <section className="border-b border-[#E2E8E4] pb-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="ml-eyebrow">Chapter {String(chapter.id).padStart(2, "0")} · Focus session</span>
            <h1 className="mt-1 text-2xl font-extrabold tracking-[-0.04em] text-[#24332D] sm:text-3xl">
              {chapter.title} · 6-Step Mission
            </h1>
          </div>
          <SaveIndicator state={saveState} />
        </div>
        <StepProgress
          currentStep={currentStep}
          highestUnlocked={session.highestUnlocked}
          completedSteps={session.completedSteps}
          onSelect={(number) => {
            goToStep(number);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </section>

      {/* Versi Mobile: Deretan dekorasi step yang ceria di bawah progress bar, rapi dan tidak menutupi tulisan */}
      {stepAssets?.mobile?.length > 0 && (
        <div className="xl:hidden flex items-center justify-center gap-4 py-2.5 px-3 my-4 rounded-2xl bg-[#EAF4EF]/60 border border-[#D7E3DC] select-none pointer-events-none overflow-x-auto">
          {stepAssets.mobile.map((imgSrc, idx) => (
            <img
              key={idx}
              src={imgSrc}
              alt=""
              className="h-12 w-12 sm:h-14 sm:w-14 object-contain drop-shadow-sm shrink-0"
              loading="lazy"
            />
          ))}
        </div>
      )}

      {recovered && (
        <div className="mt-5 flex items-start gap-3 rounded-[18px] border border-[#D2E0D8] bg-[#EAF4EF]/75 px-4 py-3 text-xs leading-5 text-[#597065]">
          <RefreshCw size={15} className="mt-0.5 shrink-0" />
          <span><strong>Session recovered.</strong> We restored your latest autosaved work so an accidental refresh does not erase your answers.</span>
        </div>
      )}

      {/* Main Activity Area: Full width, spacious and clear without inner aside squeezing */}
      <section className="min-h-[560px] py-6 sm:py-8 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {step.key === "provide" && (
              <ProvideStep
                content={chapter.marzano.provide}
                value={session.data.provide}
                onChange={(value) => updateStepData("provide", value)}
                chapterId={chapter.id}
              />
            )}
            {step.key === "restate" && (
              <RestateStep
                content={chapter.marzano.restate}
                value={session.data.restate}
                onChange={(value) => updateStepData("restate", value)}
              />
            )}
            {step.key === "visualize" && (
              <VisualizeStep
                content={chapter.marzano.visualize}
                value={session.data.visualize}
                onChange={(value) => updateStepData("visualize", value)}
                studentId={user?.id}
                chapterId={chapter.id}
              />
            )}
            {step.key === "engage" && (
              <EngageStep
                content={chapter.marzano.engage}
                value={session.data.engage}
                onChange={(value) => updateStepData("engage", value)}
                chapterId={chapter.id}
              />
            )}
            {step.key === "discuss" && (
              <DiscussStep
                content={chapter.marzano.discuss}
                value={session.data.discuss}
                onChange={(value) => updateStepData("discuss", value)}
              />
            )}
            {step.key === "games" && (
              <GamesStep
                content={chapter.marzano.games}
                value={session.data.games}
                onChange={(value) => updateStepData("games", value)}
                chapterId={chapter.id}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      <footer className="sticky bottom-3 z-30 rounded-[24px] border border-[#DDE5E0] bg-[#FBFCF8]/95 p-3.5 shadow-[0_16px_45px_rgba(36,51,45,0.12)] backdrop-blur-xl sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={previousStep} disabled={currentStep === 1}>
            <ArrowLeft size={16} /> <span className="hidden sm:inline">Back</span>
          </Button>

          <div className="hidden text-center sm:block">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8A9690]">{step.label}</p>
            <p className={`mt-0.5 text-xs font-black ${ready ? "text-emerald-700" : "text-[#8A9690]"}`}>
              {ready ? "✨ Activity completed! Ready to advance now!" : "Complete the activity above to unlock the next step"}
            </p>
          </div>

          <div className="relative">
            {/* Animated Bouncing Guidance Pointer pointing to the next action */}
            <div className="pointer-events-none absolute -top-14 right-0 sm:right-2 z-40 whitespace-nowrap">
              <BouncingGuideArrow
                isReady={ready}
                text="CLICK HERE!"
                subtext={currentStep === 6 ? "Finish & Submit Mission! 🏆" : "Click to Advance Step"}
                direction="down"
              />
            </div>

            <motion.div
              animate={ready ? { scale: [1, 1.05, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <Button
                variant={ready ? "primary" : "secondary"}
                onClick={nextStep}
                disabled={!ready}
                className={ready ? "ring-4 ring-emerald-400/40 shadow-xl shadow-emerald-700/25 font-black text-sm px-6" : ""}
              >
                {currentStep === 6 ? (
                  <><Check size={16} /> Complete Mission</>
                ) : (
                  <>Next Step <ArrowRight size={16} /></>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  );
}
