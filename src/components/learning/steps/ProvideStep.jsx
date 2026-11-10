import { useEffect } from "react";
import { BookOpen, Volume2, Sparkles } from "lucide-react";
import SourceNote from "../../common/SourceNote";

export default function ProvideStep({ content, value, onChange, theme }) {
  const words = content.vocabulary ?? [];
  const seen = value?.seen ?? [];

  // Automatically mark all words as explored since they are all displayed in this single slide
  useEffect(() => {
    if (words.length > 0 && seen.length < words.length) {
      onChange?.({
        ...value,
        seen: words.map((_, index) => index),
      });
    }
  }, [words.length]);

  function pronounce(term) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(term);
    utterance.lang = "en-US";
    utterance.rate = 0.88;
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="w-full">
      <div className="mb-6">
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
        <p className="mt-2.5 text-sm leading-7 text-[#68766F] sm:text-base">
          {content.subtitle}. Explore all target words in this session and listen to their pronunciation.
        </p>
      </div>

      {/* Student Action Instructions in English */}
      <div
        style={{
          borderColor: theme?.borderSoft || "#D7E3DC",
          backgroundColor: theme?.bgLight || "rgba(234, 244, 239, 0.75)",
        }}
        className="mb-7 rounded-2xl border p-4 sm:p-5 shadow-xs"
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
          <li>1. <strong>Listen & Practice:</strong> Click the <Volume2 size={13} className="inline mx-1 text-sky-600" /> speaker icon on each card to hear correct English pronunciation.</li>
          <li>2. <strong>Understand:</strong> Read the part of speech, meaning, and context sentence for each word.</li>
          <li>3. <strong>Ready to Go:</strong> All words are right here in one view. Proceed directly to <strong>Next Step</strong> below whenever you are ready!</li>
        </ol>
      </div>

      {/* All vocabulary words presented together in one slide / unified grid */}
      <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {words.map((item, index) => {
          return (
            <article
              key={item.term}
              style={{
                borderColor: theme?.borderSoft || "#E2E8F0",
              }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border bg-white/95 p-5 sm:p-6 shadow-[0_10px_30px_rgba(36,51,45,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(36,51,45,0.1)]"
            >
              {/* Header: Number and Part of Speech badge */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    style={{ color: theme?.primaryMuted || "#64748B" }}
                    className="text-xs font-extrabold tracking-wider"
                  >
                    #{String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    style={{
                      backgroundColor: theme?.badgeBg,
                      color: theme?.badgeText || theme?.primaryDark,
                      borderColor: theme?.borderSoft,
                    }}
                    className="rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider"
                  >
                    {item.partOfSpeech || "Word"}
                  </span>
                </div>

                {/* Term & Audio pronunciation button */}
                <div className="mt-3.5 flex items-center justify-between gap-3">
                  <h3 className="text-xl sm:text-2xl font-extrabold tracking-[-0.03em] text-[#1E293B]">
                    {item.term}
                  </h3>
                  <button
                    type="button"
                    onClick={() => pronounce(item.term)}
                    style={{
                      backgroundColor: theme?.badgeBg,
                      color: theme?.primaryDark,
                    }}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full transition-transform hover:scale-110 active:scale-95 shadow-xs"
                    title={`Pronounce ${item.term}`}
                    aria-label={`Pronounce ${item.term}`}
                  >
                    <Volume2 size={16} />
                  </button>
                </div>

                {/* Meaning / Definition */}
                <div className="mt-3.5 rounded-xl bg-slate-50 p-3 text-xs sm:text-sm font-medium leading-relaxed text-[#334155] border border-slate-100">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Meaning</p>
                  <p>{item.definition}</p>
                </div>
              </div>

              {/* Context / Example sentence */}
              {item.example && (
                <div className="mt-4 pt-3.5 border-t border-slate-100">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Example in context</p>
                  <p className="text-xs sm:text-[13px] italic leading-relaxed text-[#475569]">
                    "{item.example}"
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Direct confirmation banner */}
      <div
        style={{
          borderColor: theme?.borderSoft,
          backgroundColor: theme?.badgeBg,
          color: theme?.badgeText || theme?.primaryDark,
        }}
        className="mt-7 flex items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-xs sm:text-sm font-bold shadow-xs"
      >
        <div className="flex items-center gap-2.5">
          <Sparkles size={18} className="shrink-0" />
          <span>All <strong>{words.length}</strong> target vocabulary words are ready. Click <strong>Next Step</strong> below to proceed!</span>
        </div>
      </div>

      <SourceNote source={content.source} />
    </div>
  );
}
