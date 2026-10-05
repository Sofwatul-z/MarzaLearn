import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ArrowRight, Check, Sparkles, X } from "lucide-react";
import Button from "../common/Button";
import { seededShuffle } from "../../utils/learning";

const confettiPieces = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  x: ((index * 37) % 160) - 80,
  rotate: (index * 71) % 280,
  delay: (index % 6) * 0.025,
}));

export default function QuizGame({ questions = [], value, onChange, chapterId }) {
  const answers = value?.answers ?? {};
  const firstUnanswered = questions.findIndex((_, index) => !answers[index]);
  const [currentIndex, setCurrentIndex] = useState(firstUnanswered === -1 ? Math.max(0, questions.length - 1) : firstUnanswered);
  const [showSummary, setShowSummary] = useState(firstUnanswered === -1 && questions.length > 0);
  const [celebrate, setCelebrate] = useState(false);

  const current = questions[currentIndex];
  const currentAnswer = answers[currentIndex];
  const options = useMemo(
    () => seededShuffle(current?.options ?? [], `chapter-${chapterId}-quiz-${currentIndex}`),
    [current, currentIndex, chapterId]
  );

  const answeredCount = Object.keys(answers).length;
  const score = Object.values(answers).filter((answer) => answer?.correct).length;

  function choose(option) {
    if (!current || currentAnswer) return;
    const correct = option === current.answer;
    const next = {
      ...value,
      answers: {
        ...answers,
        [currentIndex]: { selected: option, correct },
      },
    };
    onChange?.(next);

    if (correct) {
      setCelebrate(true);
      window.setTimeout(() => setCelebrate(false), 900);
    }
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
      <div className="rounded-[30px] border border-[#C9DCD2] bg-[#EAF4EF]/65 px-6 py-9 text-center sm:px-9 sm:py-11">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#24332D] text-white">
          <Sparkles size={20} />
        </div>
        <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#668073]">Game finished</p>
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
    <div className="relative overflow-hidden rounded-[30px] border border-[#DDE5E0] bg-white/85 p-6 shadow-[0_16px_45px_rgba(36,51,45,0.05)] sm:p-8">
      <AnimatePresence>
        {celebrate && (
          <div className="pointer-events-none absolute inset-x-0 top-16 z-20 flex justify-center" aria-hidden="true">
            {confettiPieces.map((piece) => (
              <motion.span
                key={piece.id}
                initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 0.7 }}
                animate={{ opacity: 0, x: piece.x, y: 125 + (piece.id % 4) * 16, rotate: piece.rotate, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, delay: piece.delay, ease: "easeOut" }}
                className={`absolute h-2.5 w-1.5 rounded-sm ${piece.id % 2 ? "bg-[#9FCFBB]" : "bg-[#F4D7C5]"}`}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between gap-4">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#87938D]">
          Question {String(currentIndex + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}
        </span>
        <span className="text-xs font-extrabold text-[#5F756A]">Score {score}</span>
      </div>

      <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-[#EDF1EE]">
        <div
          className="h-full rounded-full bg-[#9FCFBB] transition-[width] duration-300"
          style={{ width: `${Math.max(8, (answeredCount / questions.length) * 100)}%` }}
        />
      </div>

      <h3 className="mt-8 max-w-3xl text-xl font-extrabold leading-8 tracking-[-0.025em] text-[#24332D] sm:text-2xl">
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
            {currentAnswer.correct
              ? "Correct — nice work."
              : `The correct answer is “${current.answer}”.`}
          </p>
          <Button variant="pastel" size="sm" onClick={nextQuestion}>
            {currentIndex === questions.length - 1 ? "See result" : "Next question"} <ArrowRight size={14} />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
