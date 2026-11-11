import { BookOpenText, Headphones, Shapes, BookOpen } from "lucide-react";

export default function LearnProgress({ active, completed = [], onSelect, theme, chapterId }) {
  const isAudioOnly = chapterId === 2 || chapterId === 4;
  const night = Number(chapterId) === 4;

  const steps = [
    { id: "introduction", label: "Introduction", icon: BookOpenText },
    {
      id: "listen",
      label: isAudioOnly ? "Listening" : "Reading",
      icon: isAudioOnly ? Headphones : BookOpen,
    },
    { id: "grammar", label: "Grammar Corner", icon: Shapes },
  ];

  return (
    <nav
      className="sticky top-[126px] z-30 -mx-1 mb-8 overflow-x-auto px-1 py-2 sm:top-[76px]"
      aria-label="Chapter learn sections"
    >
      <div
        style={{ borderColor: night ? "rgba(196,181,253,0.65)" : theme?.borderSoft || "#DDE5E0" }}
        className={`mx-auto flex min-w-max items-center gap-1 rounded-full border p-1.5 backdrop-blur-xl ${
          night
            ? "bg-white/85 shadow-[0_12px_32px_rgba(91,33,182,0.12)]"
            : "bg-[#FBFCF8]/90 shadow-[0_10px_30px_rgba(36,51,45,0.06)]"
        }`}
      >
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = active === step.id;
          const isComplete = completed.includes(step.id);

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onSelect(step.id)}
              style={isActive ? { backgroundColor: theme?.primaryDark || "#24332D", color: "#FFFFFF" } : {}}
              className={`group flex items-center gap-2 rounded-full px-3.5 py-2.5 text-xs font-extrabold transition-all sm:px-4 ${
                isActive
                  ? night
                    ? "shadow-[0_8px_20px_rgba(91,33,182,0.28)]"
                    : "shadow-[0_8px_20px_rgba(36,51,45,0.14)]"
                  : night
                    ? "text-[#7C6A99] hover:bg-violet-50 hover:text-[#5B21B6]"
                    : "text-[#6C7973] hover:bg-white hover:text-[#24332D]"
              }`}
              aria-current={isActive ? "step" : undefined}
            >
              <span
                style={
                  !isActive && isComplete && theme?.badgeBg
                    ? { backgroundColor: theme.badgeBg, color: theme.badgeText }
                    : {}
                }
                className={`grid h-6 w-6 place-items-center rounded-full text-[10px] ${
                  isActive
                    ? "bg-white/12 text-white"
                    : isComplete
                      ? night
                        ? "bg-[#EDE9FE] text-[#5B21B6]"
                        : "bg-[#CFE8DD] text-[#315C49]"
                      : night
                        ? "bg-[#F5F3FF] text-[#8B7AA8]"
                        : "bg-[#EEF2EF] text-[#7B8882]"
                }`}
              >
                {index + 1}
              </span>
              <Icon size={14} />
              <span>{step.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
