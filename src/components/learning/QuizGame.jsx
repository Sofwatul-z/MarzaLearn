import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ArrowRight, Check, Sparkles, X, CheckCircle2, AlertCircle } from "lucide-react";
import Button from "../common/Button";

const confettiPieces = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  x: ((index * 37) % 160) - 80,
  rotate: (index * 71) % 280,
  delay: (index % 6) * 0.025,
}));

export default function QuizGame({
  questions = [],
  value,
  onChange,
  chapterId,
  theme,
  singleSlide = false,
}) {
  const answers = value?.answers ?? {};
  const firstUnanswered = questions.findIndex((_, index) => !answers[index]);
  const [currentIndex, setCurrentIndex] = useState(
    firstUnanswered === -1 ? Math.max(0, questions.length - 1) : firstUnanswered
  );
  const [showSummary, setShowSummary] = useState(firstUnanswered === -1 && questions.length > 0);
  const [celebrate, setCelebrate] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const score = Object.values(answers).filter((answer) => answer?.correct).length;
  const allAnswered = questions.length > 0 && answeredCount >= questions.length;

  function chooseAnswer(qIndex, option) {
    const question = questions[qIndex];
    if (!question || answers[qIndex]) return;

    const correct = option === question.answer;
    const next = {
      ...value,
      answers: {
        ...answers,
        [qIndex]: { selected: option, correct },
      },
    };
    onChange?.(next);

    if (correct) {
      setCelebrate(true);
      window.setTimeout(() => setCelebrate(false), 900);
    }
  }

  // =========================================================================
  // SINGLE SLIDE MODE (All questions rendered in one unified view/slide)
  // =========================================================================
  if (singleSlide) {
    return (
      <div
        style={{ borderColor: theme?.borderSoft || "#DDE5E0" }}
        className="relative overflow-hidden rounded-[30px] border bg-white/95 p-6 shadow-[0_16px_45px_rgba(36,51,45,0.06)] sm:p-8"
      >
        <AnimatePresence>
          {celebrate && (
            <div className="pointer-events-none fixed inset-x-0 top-20 z-50 flex justify-center" aria-hidden="true">
              {confettiPieces.map((piece) => (
                <motion.span
                  key={piece.id}
                  initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 0.7 }}
                  animate={{ opacity: 0, x: piece.x, y: 140 + (piece.id % 4) * 16, rotate: piece.rotate, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, delay: piece.delay, ease: "easeOut" }}
                  className={`absolute h-2.5 w-1.5 rounded-sm ${piece.id % 2 ? "bg-emerald-400" : "bg-purple-400"}`}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Top Quiz Status Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div>
            <span
              style={{
                backgroundColor: theme?.badgeBg,
                color: theme?.badgeText || theme?.primaryDark,
                borderColor: theme?.borderSoft,
              }}
              className="rounded-full border px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider"
            >
              Multiple Choice Questions
            </span>
            <p className="mt-1.5 text-xs sm:text-sm font-bold text-[#64748B]">
              Topic: Why Students Should Limit Screen Time Before Bed
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <span
              style={{
                backgroundColor: theme?.badgeBg,
                borderColor: theme?.borderSoft,
                color: theme?.primaryDark,
              }}
              className="rounded-full border px-3 py-1 text-xs sm:text-sm font-extrabold shadow-xs"
            >
              Score: {score} / {questions.length}
            </span>
            <span className="text-xs font-bold text-[#94A3B8]">
              ({answeredCount} of {questions.length} answered)
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full transition-[width] duration-300"
            style={{
              backgroundColor: theme?.primaryDark || theme?.primary || "#7C3AED",
              width: `${(answeredCount / questions.length) * 100}%`,
            }}
          />
        </div>

        {/* All Questions in One Unified View */}
        <div className="mt-8 space-y-9">
          {questions.map((q, qIndex) => {
            const answer = answers[qIndex];
            const isAnswered = Boolean(answer);
            const isFirstOfPart = qIndex === 0 || questions[qIndex - 1]?.part !== q.part;

            return (
              <div key={q.id || qIndex} className="space-y-3.5">
                {/* Part Header Banner if part exists */}
                {q.part && isFirstOfPart && (
                  <div
                    style={{
                      backgroundColor: theme?.badgeBg,
                      borderColor: theme?.borderSoft,
                    }}
                    className="mb-4 rounded-xl border px-4 py-2 text-xs sm:text-sm font-extrabold text-[#334155]"
                  >
                    {q.part}
                  </div>
                )}

                {/* Question Prompt */}
                <div className="flex items-start gap-3">
                  <span
                    style={{
                      backgroundColor: isAnswered
                        ? answer?.correct
                          ? "#DCFCE7"
                          : "#FEE2E2"
                        : "#F1F5F9",
                      color: isAnswered
                        ? answer?.correct
                          ? "#15803D"
                          : "#B91C1C"
                        : "#475569",
                    }}
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-black shadow-xs"
                  >
                    {qIndex + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-base sm:text-lg font-bold leading-relaxed text-[#1E293B] whitespace-pre-line">
                      {q.question}
                    </p>
                  </div>
                </div>

                {/* 3 Options */}
                <div className="grid gap-2.5 sm:grid-cols-3 pl-10">
                  {q.options.map((option, optIdx) => {
                    const optLetter = String.fromCharCode(65 + optIdx); // A, B, C
                    const isSelected = answer?.selected === option;
                    const isCorrect = isAnswered && option === q.answer;
                    const isWrongSelected = isSelected && !answer?.correct;

                    return (
                      <button
                        key={option}
                        type="button"
                        disabled={isAnswered}
                        onClick={() => chooseAnswer(qIndex, option)}
                        className={`group relative flex min-h-[58px] items-center justify-between rounded-2xl border p-3.5 text-left text-xs sm:text-sm font-bold transition-all ${
                          isCorrect
                            ? "border-emerald-400 bg-emerald-50 text-emerald-950 shadow-xs ring-2 ring-emerald-300"
                            : isWrongSelected
                            ? "border-rose-300 bg-rose-50 text-rose-950 ring-2 ring-rose-200"
                            : isAnswered
                            ? "border-slate-200 bg-slate-50/70 text-slate-400 opacity-70"
                            : "border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-purple-300 hover:bg-purple-50/30 hover:shadow-xs"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={`grid h-5 w-5 place-items-center rounded-md text-[11px] font-extrabold ${
                              isCorrect
                                ? "bg-emerald-600 text-white"
                                : isWrongSelected
                                ? "bg-rose-600 text-white"
                                : "bg-slate-100 text-slate-600 group-hover:bg-purple-200"
                            }`}
                          >
                            {optLetter}
                          </span>
                          <span className="leading-snug">{option}</span>
                        </span>
                        {isCorrect && <CheckCircle2 size={16} className="shrink-0 text-emerald-600 ml-1" />}
                        {isWrongSelected && <X size={16} className="shrink-0 text-rose-600 ml-1" />}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback line */}
                {isAnswered && (
                  <div className="pl-10 text-xs font-bold">
                    {answer.correct ? (
                      <span className="text-emerald-700">✓ Correct answer!</span>
                    ) : (
                      <span className="text-rose-700">
                        ✗ Incorrect. The correct answer is: <strong>{q.answer}</strong>
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div
          style={{
            borderColor: theme?.borderSoft,
            backgroundColor: allAnswered ? "#DCFCE7" : theme?.badgeBg,
            color: allAnswered ? "#14532D" : theme?.primaryDark,
          }}
          className="mt-9 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border p-4 sm:p-5 shadow-xs"
        >
          <div className="flex items-center gap-3 text-xs sm:text-sm font-bold">
            {allAnswered ? <Sparkles size={20} className="text-emerald-600 shrink-0" /> : <AlertCircle size={20} className="shrink-0" />}
            <span>
              {allAnswered
                ? `🎉 Quiz complete! You scored ${score}/${questions.length} (${Math.round((score / questions.length) * 100)}%). Click "Complete Mission" below!`
                : `${questions.length - answeredCount} question(s) remaining. Answer all questions to unlock the next step.`}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // STANDARD PAGINATED MODE (Fallback for 3-question short games)
  // =========================================================================
  const current = questions[currentIndex];
  const currentAnswer = answers[currentIndex];
  const options = current?.options ?? [];

  function choose(option) {
    chooseAnswer(currentIndex, option);
  }

  function nextQuestion() {
    if (currentIndex >= questions.length - 1) {
      setShowSummary(true);
      return;
    }
    setCurrentIndex((index) => index + 1);
  }

  if (!current) return null;

  if (showSummary) {
    return (
      <div
        style={{
          borderColor: theme?.borderSoft || "#C9DCD2",
          backgroundColor: theme?.bgLight || "rgba(234, 244, 239, 0.65)",
        }}
        className="rounded-[30px] border px-6 py-9 text-center sm:px-9 sm:py-11"
      >
        <div
          style={{ backgroundColor: theme?.primaryDark || "#24332D" }}
          className="mx-auto grid h-12 w-12 place-items-center rounded-full text-white"
        >
          <Sparkles size={20} />
        </div>
        <p
          style={{ color: theme?.primaryMuted }}
          className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.15em]"
        >
          Game finished
        </p>
        <h3 className="mt-2 text-3xl font-extrabold tracking-[-0.045em] text-[#24332D]">
          {score} / {questions.length} correct
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#68766F]">
          Your answers are locked for this session. The score will be saved automatically with your mission.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{ borderColor: theme?.borderSoft || "#DDE5E0" }}
      className="relative overflow-hidden rounded-[30px] border bg-white/85 p-6 shadow-[0_16px_45px_rgba(36,51,45,0.05)] sm:p-8"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#87938D]">
          Question {String(currentIndex + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}
        </span>
        <span
          style={{
            backgroundColor: theme?.badgeBg,
            borderColor: theme?.borderSoft,
            color: theme?.primaryDark,
          }}
          className="rounded-full border px-3 py-1 text-xs font-extrabold"
        >
          Score {score}
        </span>
      </div>

      <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-[#EDF1EE]">
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{
            backgroundColor: theme?.primary || theme?.accent || "#9FCFBB",
            width: `${Math.max(8, (answeredCount / questions.length) * 100)}%`,
          }}
        />
      </div>

      <h3 className="mt-8 max-w-3xl text-xl font-extrabold leading-8 tracking-[-0.025em] text-[#24332D] sm:text-2xl whitespace-pre-line">
        {current.question}
      </h3>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {options.map((option) => {
          const selected = currentAnswer?.selected === option;
          const isCorrectOption = currentAnswer && option === current.answer;
          const wrongSelected = selected && !currentAnswer?.correct;

          return (
            <button
              key={option}
              type="button"
              disabled={Boolean(currentAnswer)}
              onClick={() => choose(option)}
              className={`min-h-[74px] rounded-[18px] border px-4 py-4 text-left text-sm font-extrabold leading-6 transition ${
                isCorrectOption
                  ? "border-[#8FBEA9] bg-[#EAF4EF] text-[#365846]"
                  : wrongSelected
                  ? "border-[#E0B8B0] bg-[#FAECE9] text-[#8B4F46]"
                  : currentAnswer
                  ? "border-[#E2E7E4] bg-[#F8FAF8] text-[#99A39E]"
                  : "border-[#D8E1DC] bg-white text-[#4D5E55] hover:-translate-y-0.5 hover:border-[#B4C9BE] hover:shadow-[0_9px_22px_rgba(36,51,45,0.06)]"
              }`}
            >
              <span className="flex items-center justify-between gap-2">
                {option}
                {isCorrectOption && <Check size={16} />}
                {wrongSelected && <X size={16} />}
              </span>
            </button>
          );
        })}
      </div>

      {currentAnswer && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex flex-col gap-4 border-t border-[#E5EAE7] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className={`text-sm font-bold ${currentAnswer.correct ? "text-[#4D725F]" : "text-[#8C5A50]"}`}>
            {currentAnswer.correct ? "Correct — nice work." : `The correct answer is “${current.answer}”.`}
          </p>
          <Button theme={theme} variant="pastel" size="sm" onClick={nextQuestion}>
            {currentIndex === questions.length - 1 ? "See Result" : "Next Question"} <ArrowRight size={14} />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
