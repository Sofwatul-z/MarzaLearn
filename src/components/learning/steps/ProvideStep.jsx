import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check } from "lucide-react";
import Button from "../../common/Button";
import VocabularyCard from "../VocabularyCard";
import SourceNote from "../../common/SourceNote";

export default function ProvideStep({ content, value, onChange }) {
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
        <span className="ml-eyebrow">Step 01 · Provide</span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-[#24332D] sm:text-4xl">
          {content.title}
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#68766F] sm:text-base">
          {content.subtitle}. Explore each word one at a time instead of memorizing a wall of definitions.
        </p>
      </div>

      {/* Student Action Instructions in English */}
      <div className="mb-6 rounded-2xl border border-[#D7E3DC] bg-[#EAF4EF]/75 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#355245]">
          <BookOpen size={16} className="text-[#355245]" />
          <span>What to Do in this Step:</span>
        </div>
        <ol className="mt-2.5 space-y-1.5 text-xs sm:text-sm font-medium leading-relaxed text-[#4A5D54]">
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
        />
      )}

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1.5" aria-label={`${seen.length} of ${words.length} words explored`}>
          {words.map((word, wordIndex) => (
            <button
              key={word.term}
              type="button"
              onClick={() => setIndex(wordIndex)}
              className={`h-2.5 rounded-full transition-all ${
                wordIndex === index
                  ? "w-8 bg-[#24332D]"
                  : seen.includes(wordIndex)
                    ? "w-2.5 bg-[#8EBEAA]"
                    : "w-2.5 bg-[#DCE4DF]"
              }`}
              aria-label={`Open ${word.term}`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-2 sm:justify-end">
          <Button variant="ghost" size="sm" onClick={previousWord} disabled={index === 0}>
            <ArrowLeft size={14} /> Previous word
          </Button>
          {index < words.length - 1 ? (
            <Button variant="pastel" size="sm" onClick={nextWord}>
              Got it <ArrowRight size={14} />
            </Button>
          ) : (
            <Button
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
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-xs font-bold text-emerald-800 shadow-xs">
          <span className="text-xl">🎉</span>
          <span>Awesome! You have explored all the target vocabulary words. Click <strong>Next Step</strong> below to start writing!</span>
        </div>
      )}

      <SourceNote source={content.source} />
    </div>
  );
}
