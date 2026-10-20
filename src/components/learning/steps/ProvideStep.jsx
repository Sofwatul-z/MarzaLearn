import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check } from "lucide-react";
import Button from "../../common/Button";
import VocabularyCard from "../VocabularyCard";
import SourceNote from "../../common/SourceNote";

export default function ProvideStep({ content, value, onChange, theme }) {
  const words = content.vocabulary ?? [];
  const seen = value?.seen ?? [];
  const initialIndex = useMemo(() => {
    const firstUnseen = words.findIndex((_, index) => !seen.includes(index));
    return firstUnseen === -1 ? Math.max(0, words.length - 1) : firstUnseen;
  }, []); // Restore to the first unfinished word only when the step opens.
  const [index, setIndex] = useState(initialIndex);

  function markSeen(targetIndex) {
    if (seen.includes(targetIndex)) return;
    onChange?.({ ...value, seen: [...seen, targetIndex].sort((a, b) => a - b) });
  }

  function nextWord() {
    markSeen(index);
    if (index < words.length - 1) setIndex((current) => current + 1);
  }

  function previousWord() {
    if (index > 0) setIndex((current) => current - 1);
  }

  function pronounce(term) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(term);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  const current = words[index];
  const allSeen = words.length > 0 && seen.length >= words.length;

  return (
    <div className="w-full">
      <div className="mb-7">
        <span
          style={{
            backgroundColor: theme?.badgeBg,
            borderColor: theme?.borderSoft,
            color: theme?.primaryDark,
          }}
          className="ml-eyebrow"
        >
          Step 01 · Provide
        </span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-[#24332D] sm:text-4xl">
          {content.title}
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#68766F] sm:text-base">
          {content.subtitle}. Explore each word one at a time instead of memorizing a wall of definitions.
        </p>
      </div>

      {/* Student Action Instructions in English */}
      <div
        style={{
          borderColor: theme?.borderSoft || "#D7E3DC",
          backgroundColor: theme?.bgLight || "rgba(234, 244, 239, 0.75)",
        }}
        className="mb-6 rounded-2xl border p-4 sm:p-5 shadow-xs"
      >
        <div
          style={{ color: theme?.primaryDark || "#355245" }}
          className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider"
        >
          <BookOpen size={16} />
          <span>What to Do in this Step:</span>
        </div>
        <ol
          style={{ color: theme?.primaryDark || "#4A5D54" }}
          className="mt-2.5 space-y-1.5 text-xs sm:text-sm font-medium leading-relaxed opacity-95"
        >
          <li>1. Click the <strong>Speaker / Audio</strong> button on each card to hear correct English pronunciation.</li>
          <li>2. Read through the definition, word class (noun/adjective/verb), and context sentence.</li>
          <li>3. Click <strong>"Got it"</strong> to move to the next word. Once all {words.length} dots turn green, click <strong>Next Step</strong> at the bottom.</li>
        </ol>
      </div>

      {current && (
        <VocabularyCard
          word={current}
          index={index}
          total={words.length}
          onPronounce={pronounce}
          theme={theme}
        />
      )}

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1.5" aria-label={`${seen.length} of ${words.length} words explored`}>
          {words.map((word, wordIndex) => (
            <button
              key={word.term}
              type="button"
              onClick={() => setIndex(wordIndex)}
              style={
                wordIndex === index
                  ? { backgroundColor: theme?.primaryDark || "#24332D" }
                  : seen.includes(wordIndex)
                    ? { backgroundColor: theme?.primary || "#8EBEAA" }
                    : { backgroundColor: "#DCE4DF" }
              }
              className={`h-2.5 rounded-full transition-all ${
                wordIndex === index ? "w-8" : "w-2.5"
              }`}
              aria-label={`Open ${word.term}`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-2 sm:justify-end">
          <Button theme={theme} variant="ghost" size="sm" onClick={previousWord} disabled={index === 0}>
            <ArrowLeft size={14} /> Previous word
          </Button>
          {index < words.length - 1 ? (
            <Button theme={theme} variant="pastel" size="sm" onClick={nextWord}>
              Got it <ArrowRight size={14} />
            </Button>
          ) : (
            <Button
              theme={theme}
              variant={allSeen ? "secondary" : "pastel"}
              size="sm"
              onClick={() => markSeen(index)}
              disabled={allSeen}
            >
              <Check size={14} /> {allSeen ? "All words explored" : "Mark word learned"}
            </Button>
          )}
        </div>
      </div>

      {allSeen && (
        <div
          style={{
            borderColor: theme?.borderSoft,
            backgroundColor: theme?.badgeBg,
            color: theme?.primaryDark,
          }}
          className="mt-5 flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-xs font-bold shadow-xs"
        >
          <span className="text-xl">🎉</span>
          <span>Awesome! You have explored all the target vocabulary words. Click <strong>Next Step</strong> below to start writing!</span>
        </div>
      )}

      <SourceNote source={content.source} />
    </div>
  );
}
