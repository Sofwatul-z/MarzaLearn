import { Check, LockKeyhole } from "lucide-react";

const defaultSteps = [
  "Provide",
  "Restate",
  "Visualize",
  "Engage",
  "Discuss",
  "Games",
];

export default function StepProgress({
  currentStep = 1,
  highestUnlocked = 1,
  completedSteps = [],
  onSelect,
  steps = defaultSteps,
}) {
  return (
    <nav aria-label="6-Step learning progress" className="py-5 sm:py-6">
      <div className="hidden items-start md:grid md:grid-cols-6">
        {steps.map((label, index) => {
          const number = index + 1;
          const complete = completedSteps.includes(number);
          const active = currentStep === number;
          const unlocked = number <= highestUnlocked;

          return (
            <div key={label} className="relative flex min-w-0 flex-col items-center">
              {index < steps.length - 1 && (
                <span
                  className={`absolute left-1/2 right-[-50%] top-[18px] h-px ${
                    complete ? "bg-[#8EBEAA]" : "bg-[#D9E1DD]"
                  }`}
                  aria-hidden="true"
                />
              )}
              <button
                type="button"
                disabled={!unlocked}
                onClick={() => unlocked && onSelect?.(number)}
                aria-current={active ? "step" : undefined}
                className={`relative z-10 grid h-9 w-9 place-items-center rounded-full border text-xs font-extrabold transition-all ${
                  complete
                    ? "border-[#8EBEAA] bg-[#CFE8DD] text-[#29483A]"
                    : active
                      ? "border-[#24332D] bg-[#24332D] text-white shadow-[0_8px_20px_rgba(36,51,45,0.17)]"
                      : unlocked
                        ? "border-[#C9D6CF] bg-white text-[#66766E] hover:border-[#9FB9AC]"
                        : "cursor-not-allowed border-[#E1E6E3] bg-[#F5F7F5] text-[#A8B1AC]"
                }`}
              >
                {complete ? <Check size={15} strokeWidth={3} /> : unlocked ? number : <LockKeyhole size={13} />}
              </button>
              <span
                className={`mt-2 truncate px-1 text-[10px] font-extrabold uppercase tracking-[0.08em] ${
                  active ? "text-[#24332D]" : complete ? "text-[#547265]" : "text-[#8A9690]"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#849089]">
              Step {String(currentStep).padStart(2, "0")} of 06
            </p>
            <p className="mt-1 text-lg font-extrabold tracking-[-0.025em] text-[#24332D]">
              {steps[currentStep - 1]}
            </p>
          </div>
          <span className="rounded-full border border-[#D6E0DB] bg-white/80 px-3 py-1.5 text-xs font-extrabold text-[#607069]">
            {completedSteps.length}/6 done
          </span>
        </div>
        <div className="mt-4 flex gap-1.5" aria-hidden="true">
          {steps.map((_, index) => {
            const number = index + 1;
            const complete = completedSteps.includes(number);
            const active = currentStep === number;
            return (
              <span
                key={number}
                className={`h-1.5 flex-1 rounded-full ${
                  complete ? "bg-[#8EBEAA]" : active ? "bg-[#24332D]" : "bg-[#DFE5E1]"
                }`}
              />
            );
          })}
        </div>
      </div>
    </nav>
  );
}
