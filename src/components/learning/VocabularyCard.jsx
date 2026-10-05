import { Volume2 } from "lucide-react";

export default function VocabularyCard({ word, index, total, onPronounce }) {
  return (
    <article className="relative min-h-[330px] overflow-hidden rounded-[30px] border border-[#DDE5E0] bg-white/90 px-6 py-7 shadow-[0_18px_50px_rgba(36,51,45,0.055)] sm:min-h-[360px] sm:px-9 sm:py-9">
      <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-[#EAF4EF] blur-2xl" aria-hidden="true" />
      <div className="absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-[#FBEDE4] blur-2xl" aria-hidden="true" />

      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#85918B]">
            Word {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span className="rounded-full bg-[#EAF4EF] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#557064]">
            {word.partOfSpeech}
          </span>
        </div>

        <div className="my-auto py-10 sm:py-12">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-4xl font-extrabold tracking-[-0.055em] text-[#24332D] sm:text-5xl">
              {word.term}
            </h3>
            <button
              type="button"
              onClick={() => onPronounce?.(word.term)}
              className="grid h-11 w-11 place-items-center rounded-full border border-[#C9D9D1] bg-[#F8FBF9] text-[#496658] transition hover:-translate-y-0.5 hover:bg-[#EAF4EF]"
              aria-label={`Hear pronunciation of ${word.term}`}
              title="Hear pronunciation"
            >
              <Volume2 size={18} />
            </button>
          </div>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#5F6F67] sm:text-lg">
            {word.definition}
          </p>
        </div>

        <div className="h-px bg-[#E7ECE9]" />
        <p className="mt-5 max-w-xl text-xs font-semibold leading-5 text-[#8A9690]">
          Read the meaning, hear the word, then move forward when it feels familiar.
        </p>
      </div>
    </article>
  );
}
