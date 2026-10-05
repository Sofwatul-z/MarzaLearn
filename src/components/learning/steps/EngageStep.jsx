import { useMemo, useState } from "react";
import { Check, MousePointer2, X } from "lucide-react";
import { seededShuffle } from "../../../utils/learning";
import SourceNote from "../../common/SourceNote";

export default function EngageStep({ content, value, onChange, chapterId }) {
  const pairs = content.pairs ?? [];
  const matched = value?.matched ?? [];
  const mistakeTerms = value?.mistakeTerms ?? {};
  const attempts = Number(value?.attempts ?? 0);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const definitions = useMemo(
    () => seededShuffle(pairs.map(([, definition]) => definition), `chapter-${chapterId}-engage`),
    [pairs, chapterId]
  );
  const definitionToTerm = useMemo(
    () => Object.fromEntries(pairs.map(([term, definition]) => [definition, term])),
    [pairs]
  );
  const firstTryScore = pairs.filter(([term]) => matched.includes(term) && !mistakeTerms[term]).length;

  function chooseDefinition(definition) {
    if (!selectedTerm || matched.includes(selectedTerm)) return;
    const correctTerm = definitionToTerm[definition];
    if (matched.includes(correctTerm)) return;

    const correct = correctTerm === selectedTerm;
    const nextAttempts = attempts + 1;

    if (correct) {
      const nextMatched = [...matched, selectedTerm];
      onChange?.({
        ...value,
        matched: nextMatched,
        mistakeTerms,
        attempts: nextAttempts,
      });
      setFeedback({ type: "correct", text: `${selectedTerm} matches ${definition}.` });
      setSelectedTerm(null);
      return;
    }

    onChange?.({
      ...value,
      matched,
      mistakeTerms: { ...mistakeTerms, [selectedTerm]: true },
      attempts: nextAttempts,
    });
    setFeedback({ type: "wrong", text: "Not quite. Try another meaning for that word." });
    setSelectedTerm(null);
  }

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
        <div className="max-w-3xl">
          <span className="ml-eyebrow">Step 04 · Engage</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-[#24332D] sm:text-4xl">
            {content.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#65736D] sm:text-base">{content.instructions}</p>
        </div>
        <div className="border-l-2 border-[#C6DDD2] pl-5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#839089]">First-try score</p>
          <p className="mt-1 text-2xl font-extrabold tracking-[-0.04em] text-[#24332D]">{firstTryScore}/{pairs.length}</p>
          <p className="mt-1 text-xs leading-5 text-[#7A8780]">A mistake does not block you. Match every pair to finish.</p>
        </div>
      </div>

      <div className="mt-8 rounded-[30px] border border-[#DDE5E0] bg-white/75 p-5 sm:p-7">
        <div className="mb-5 flex items-center gap-2 text-xs font-semibold text-[#77847D]">
          <MousePointer2 size={14} /> Select a word on the left, then choose its match on the right.
        </div>

        <div className="grid grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] gap-3 sm:gap-5">
          <div className="space-y-2.5">
            <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#929D97]">Words</p>
            {pairs.map(([term]) => {
              const done = matched.includes(term);
              const selected = selectedTerm === term;
              return (
                <button
                  key={term}
                  type="button"
                  disabled={done}
                  onClick={() => {
                    setSelectedTerm(term);
                    setFeedback(null);
                  }}
                  className={`flex min-h-[56px] w-full items-center justify-between gap-2 rounded-[16px] border px-3 py-3 text-left text-xs font-extrabold transition sm:px-4 sm:text-sm ${
                    done
                      ? "border-[#BFD8CC] bg-[#EAF4EF] text-[#4A695A]"
                      : selected
                        ? "border-[#24332D] bg-[#24332D] text-white shadow-[0_8px_22px_rgba(36,51,45,0.12)]"
                        : "border-[#D9E1DD] bg-white text-[#3F5149] hover:border-[#AFC4B9]"
                  }`}
                >
                  <span>{term}</span>
                  {done && <Check size={14} />}
                </button>
              );
            })}
          </div>

          <div className="space-y-2.5">
            <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#929D97]">Matches</p>
            {definitions.map((definition) => {
              const term = definitionToTerm[definition];
              const used = matched.includes(term);
              return (
                <button
                  key={definition}
                  type="button"
                  disabled={used || !selectedTerm}
                  onClick={() => chooseDefinition(definition)}
                  className={`min-h-[56px] w-full rounded-[16px] border px-3 py-3 text-left text-xs font-bold leading-5 transition sm:px-4 sm:text-sm ${
                    used
                      ? "border-[#DCE5E0] bg-[#F2F6F3] text-[#9AA49F] line-through"
                      : selectedTerm
                        ? "border-[#D7E1DC] bg-[#FBFCFB] text-[#56675E] hover:border-[#E2BEAA] hover:bg-[#FBEDE4]"
                        : "cursor-not-allowed border-[#E5EAE7] bg-[#F7F9F7] text-[#A0AAA5]"
                  }`}
                >
                  {definition}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 min-h-[44px] border-t border-[#E5EAE7] pt-4">
          {feedback ? (
            <p className={`inline-flex items-center gap-2 text-xs font-extrabold ${feedback.type === "correct" ? "text-[#49705D]" : "text-[#96594F]"}`}>
              {feedback.type === "correct" ? <Check size={14} /> : <X size={14} />} {feedback.text}
            </p>
          ) : (
            <p className="text-xs font-semibold text-[#8A9690]">{matched.length}/{pairs.length} pairs connected.</p>
          )}
        </div>
      </div>
      <SourceNote source={content.source} />
    </div>
  );
}
