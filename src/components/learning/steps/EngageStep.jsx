import { useMemo, useState } from "react";
import { Check, Link2, MousePointer2, X } from "lucide-react";
import { seededShuffle } from "../../../utils/learning";
import SourceNote from "../../common/SourceNote";

export default function EngageStep({ content, value, onChange, chapterId, theme }) {
  const pairs = content.pairs ?? [];
  const matched = value?.matched ?? [];
  const failed = value?.failed ?? [];
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
  const isAllAttempted = (matched.length + failed.length) >= pairs.length;

  function chooseDefinition(definition) {
    if (!selectedTerm || matched.includes(selectedTerm) || failed.includes(selectedTerm)) return;
    const correctTerm = definitionToTerm[definition];

    const correct = correctTerm === selectedTerm;
    const nextAttempts = attempts + 1;

    if (correct) {
      const nextMatched = [...matched, selectedTerm];
      onChange?.({
        ...value,
        matched: nextMatched,
        failed,
        mistakeTerms,
        attempts: nextAttempts,
      });
      setFeedback({ type: "correct", text: `Correct! "${selectedTerm}" matches "${definition}".` });
      setSelectedTerm(null);
      return;
    }

    // Only 1 attempt allowed per word: lock immediately and persist as failed
    const nextFailed = [...failed, selectedTerm];
    const nextMistakes = { ...mistakeTerms, [selectedTerm]: true };
    onChange?.({
      ...value,
      matched,
      failed: nextFailed,
      mistakeTerms: nextMistakes,
      attempts: nextAttempts,
    });
    setFeedback({
      type: "wrong",
      text: `Incorrect. "${selectedTerm}" was locked after this single attempt.`,
    });
    setSelectedTerm(null);
  }

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
        <div className="max-w-3xl">
          <span
            style={{
              backgroundColor: theme?.badgeBg,
              borderColor: theme?.borderSoft,
              color: theme?.primaryDark,
            }}
            className="ml-eyebrow"
          >
            Step 04 · Engage
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-[#24332D] sm:text-4xl">
            {content.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#65736D] sm:text-base">{content.instructions}</p>
        </div>
        <div
          style={{ borderColor: theme?.primary || "#C6DDD2" }}
          className="border-l-4 pl-5"
        >
          <p
            style={{ color: theme?.primaryMuted }}
            className="text-[10px] font-extrabold uppercase tracking-[0.14em]"
          >
            First-try score
          </p>
          <p className="mt-1 text-2xl font-extrabold tracking-[-0.04em] text-[#24332D]">{firstTryScore}/{pairs.length}</p>
          <p className="mt-1 text-xs leading-5 text-[#7A8780]">A mistake does not block you. Match every pair to finish.</p>
        </div>
      </div>

      {/* Student Action Instructions in English */}
      <div
        style={{
          borderColor: theme?.borderSoft || "#D7E3DC",
          backgroundColor: theme?.bgLight || "rgba(234, 244, 239, 0.75)",
        }}
        className="mt-6 rounded-2xl border p-4 sm:p-5 shadow-xs"
      >
        <div
          style={{ color: theme?.primaryDark || "#355245" }}
          className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider"
        >
          <Link2 size={16} />
          <span>What to Do in this Step:</span>
        </div>
        <ol
          style={{ color: theme?.primaryDark || "#4A5D54" }}
          className="mt-2.5 space-y-1.5 text-xs sm:text-sm font-medium leading-relaxed opacity-95"
        >
          <li>1. Click any <strong>Words</strong> in the left column.</li>
          <li>2. Click its <strong>matching synonym</strong> on the right.</li>
          <li>3. ⚠️Single Attempt Rule: Choose carefully! You only <strong>get 1 try per word.</strong> Correct matches turn green, while mistakes are permanently locked in.</li>
          <li>4. Complete all {pairs.length} pairs to unlock the next level. A mistake won't stop you, so match every pair to finish!</li>
        </ol>
      </div>

      <div
        style={{ borderColor: theme?.borderSoft || "#DDE5E0" }}
        className="mt-8 rounded-[30px] border bg-white/75 p-5 sm:p-7"
      >
        <div className="mb-5 flex items-center gap-2 text-xs font-semibold text-[#77847D]">
          <MousePointer2 size={14} /> Select a word on the left, then choose its match on the right. (Single attempt per word)
        </div>

        <div className="grid grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] gap-3 sm:gap-5">
          <div className="space-y-2.5">
            <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.13em]" style={{ color: theme?.primaryDark || "#929D97" }}>Words</p>
            {pairs.map(([term]) => {
              const isMatched = matched.includes(term);
              const isFailed = failed.includes(term);
              const isDone = isMatched || isFailed;
              const selected = selectedTerm === term;
              return (
                <button
                  key={term}
                  type="button"
                  disabled={isDone}
                  onClick={() => {
                    setSelectedTerm(term);
                    setFeedback(null);
                  }}
                  style={
                    selected
                      ? {
                          backgroundColor: theme?.primaryDark || "#24332D",
                          borderColor: theme?.primaryDark || "#24332D",
                          color: "#FFFFFF",
                        }
                      : isMatched
                        ? {
                            backgroundColor: theme?.badgeBg || "#EAF4EF",
                            borderColor: theme?.borderSoft || "#BFD8CC",
                            color: theme?.badgeText || "#4A695A",
                          }
                        : isFailed
                          ? {
                              backgroundColor: "#FAECE9",
                              borderColor: "#E0B8B0",
                              color: "#8B4F46",
                            }
                          : {}
                  }
                  className={`flex min-h-[56px] w-full items-center justify-between gap-2 rounded-[16px] border px-3 py-3 text-left text-xs font-extrabold transition sm:px-4 sm:text-sm ${
                    isDone
                      ? ""
                      : selected
                        ? "shadow-[0_8px_22px_rgba(36,51,45,0.12)]"
                        : "border-[#D9E1DD] bg-white text-[#3F5149] hover:border-[#AFC4B9]"
                  }`}
                >
                  <span>{term}</span>
                  {isMatched && <Check size={14} />}
                  {isFailed && <span className="flex items-center gap-1 text-[11px] font-extrabold text-[#8B4F46]"><X size={13} /> Missed</span>}
                </button>
              );
            })}
          </div>

          <div className="space-y-2.5">
            <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.13em]" style={{ color: theme?.primaryDark || "#929D97" }}>Matches</p>
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
            <p className="text-xs font-semibold text-[#8A9690]">
              {matched.length + failed.length}/{pairs.length} pairs completed ({matched.length} correct, {failed.length} missed).
            </p>
          )}
        </div>
      </div>
      <SourceNote source={content.source} />
    </div>
  );
}
