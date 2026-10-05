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
import { getChapterContent } from "../../data/chapters";
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

        <div className="relative grid gap-9 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
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

function MissionComplete({ chapter, session, saveState, onBackToChapter, onDashboard }) {
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
          <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.055em] text-[#24332D] sm:text-5xl">Mission complete.</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#64736C] sm:text-base">
            Your {chapter.title} learning mission is finished. Open responses and visuals are ready for teacher review; objective activities already have a score.
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
            <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#849089]">Teacher review</p>
            <p className="mt-2 text-base font-extrabold text-[#24332D]">Pending</p>
            <p className="mt-1 text-xs text-[#7A8780]">Restate · Visualize · Discuss</p>
          </div>
        </div>

        {pendingVisuals > 0 && (
          <div className="mx-auto mt-5 max-w-4xl rounded-[18px] border border-[#E5C8B8] bg-[#FBEDE4] px-4 py-3 text-xs font-semibold leading-5 text-[#76594C]">
            {pendingVisuals} visual {pendingVisuals === 1 ? "file is" : "files are"} stored for recovery on this device but not yet uploaded to Supabase Storage. Run the included Phase 5 Supabase setup before production use.
          </div>
        )}

        <div className="mt-7 flex justify-center"><SaveIndicator state={saveState} /></div>
        <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="secondary" onClick={onBackToChapter} disabled={saveState === "saving"}>
            <ArrowLeft size={16} /> Back to chapter
          </Button>
          <Button variant="primary" onClick={onDashboard} disabled={saveState === "saving"}>
            Student Dashboard <ArrowRight size={16} />
          </Button>
        </div>
      </motion.section>

      <div className="mt-7 border-l-2 border-[#E7C9B9] pl-5">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8C7467]">Next in the chapter</p>
        <p className="mt-1 font-extrabold text-[#24332D]">Ultimate Project will remain a separate activity.</p>
        <p className="mt-1 max-w-2xl text-xs leading-5 text-[#7B8781]">You will be able to return later to submit the project link without reopening this one-session mission.</p>
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
      />
    );
  }

  const currentStep = session.currentStep;
  const step = steps[currentStep - 1];
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
    <div className="pb-8">
      <section className="border-b border-[#E2E8E4] pb-3">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="ml-eyebrow">Chapter {String(chapter.id).padStart(2, "0")} · Focus session</span>
            <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[#24332D] sm:text-3xl">
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

      {recovered && (
        <div className="mt-5 flex items-start gap-3 rounded-[18px] border border-[#D2E0D8] bg-[#EAF4EF]/75 px-4 py-3 text-xs leading-5 text-[#597065]">
          <RefreshCw size={15} className="mt-0.5 shrink-0" />
          <span><strong>Session recovered.</strong> We restored your latest autosaved work so an accidental refresh does not erase your answers.</span>
        </div>
      )}

      <section className="min-h-[560px] py-8 sm:py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
          >
            {step.key === "provide" && (
              <ProvideStep
                content={chapter.marzano.provide}
                value={session.data.provide}
                onChange={(value) => updateStepData("provide", value)}
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

      <footer className="sticky bottom-3 z-30 rounded-[22px] border border-[#DDE5E0] bg-[#FBFCF8]/90 p-3 shadow-[0_16px_45px_rgba(36,51,45,0.1)] backdrop-blur-xl sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={previousStep} disabled={currentStep === 1}>
            <ArrowLeft size={16} /> <span className="hidden sm:inline">Previous</span>
          </Button>

          <div className="hidden text-center sm:block">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#8A9690]">{step.label}</p>
            <p className={`mt-0.5 text-xs font-bold ${ready ? "text-[#52715F]" : "text-[#8A9690]"}`}>
              {ready ? "Step complete — ready to continue" : "Complete this activity to unlock the next step"}
            </p>
          </div>

          <Button variant={ready ? "primary" : "secondary"} onClick={nextStep} disabled={!ready}>
            {currentStep === 6 ? (
              <><Check size={16} /> Complete Mission</>
            ) : (
              <>Next Step <ArrowRight size={16} /></>
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
}
