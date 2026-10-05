import { BookOpenText, Headphones, Shapes } from "lucide-react";

const steps = [
  { id: "introduction", label: "Introduction", icon: BookOpenText },
  { id: "listen", label: "Listen & Read", icon: Headphones },
  { id: "grammar", label: "Grammar Corner", icon: Shapes },
];

export default function LearnProgress({ active, completed = [], onSelect }) {
  return (
    <nav
      className="sticky top-[126px] z-30 -mx-1 mb-8 overflow-x-auto px-1 py-2 sm:top-[76px]"
      aria-label="Chapter learn sections"
    >
      <div className="mx-auto flex min-w-max items-center gap-1 rounded-full border border-[#DDE5E0] bg-[#FBFCF8]/90 p-1.5 shadow-[0_10px_30px_rgba(36,51,45,0.06)] backdrop-blur-xl">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = active === step.id;
          const isComplete = completed.includes(step.id);

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onSelect(step.id)}
              className={`group flex items-center gap-2 rounded-full px-3.5 py-2.5 text-xs font-extrabold transition-all sm:px-4 ${
                isActive
                  ? "bg-[#24332D] text-white shadow-[0_8px_20px_rgba(36,51,45,0.14)]"
                  : "text-[#6C7973] hover:bg-white hover:text-[#24332D]"
              }`}
              aria-current={isActive ? "step" : undefined}
            >
              <span
                className={`grid h-6 w-6 place-items-center rounded-full text-[10px] ${
                  isActive
                    ? "bg-white/12 text-white"
                    : isComplete
                      ? "bg-[#CFE8DD] text-[#315C49]"
                      : "bg-[#EEF2EF] text-[#7B8882]"
                }`}
              >
                {isComplete && !isActive ? "✓" : <Icon size={13} strokeWidth={2.4} />}
              </span>
              <span className="hidden sm:inline">{String(index + 1).padStart(2, "0")} · </span>
              {step.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
