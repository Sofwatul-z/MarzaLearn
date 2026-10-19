import { Volume2 } from "lucide-react";
import ch1Shoes from "../../assets/badminton-warmup/01-shoes.webp";
import ch1BottleTowel from "../../assets/badminton-warmup/01-bottle-towel.webp";

export default function VocabularyCard({ word, index, total, onPronounce, chapterId = 1 }) {
  // Select contextual illustration if relevant to word meaning without changing content
  const termLower = word?.term?.toLowerCase() || "";
  let relevantIllustration = null;
  let illustrationAlt = "";

  if (chapterId === 1) {
    if (termLower === "athletic") {
      relevantIllustration = ch1Shoes;
      illustrationAlt = "Athletic badminton court footwear";
    } else if (termLower === "persistent" || termLower === "energetic") {
      relevantIllustration = ch1BottleTowel;
      illustrationAlt = "Hydration bottle and towel for training persistence";
    }
  }

  return (
    <article className="relative min-h-[330px] overflow-hidden rounded-[26px] border border-[#DDE5E0] bg-white/95 px-6 py-7 shadow-[0_12px_40px_rgba(24,59,64,0.05)] sm:min-h-[350px] sm:px-9 sm:py-9">
      <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-[#EAF4EF] blur-2xl pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-[#F8F5EC] blur-2xl pointer-events-none" aria-hidden="true" />

      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#85918B]">
            Word {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span className="rounded-full bg-[#EAF4EF] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#183B40]">
            {word.partOfSpeech}
          </span>
        </div>

        <div className="my-auto py-8 sm:py-10">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-4xl font-extrabold tracking-[-0.055em] text-[#183B40] sm:text-5xl">
                  {word.term}
                </h3>
                <button
                  type="button"
                  onClick={() => onPronounce?.(word.term)}
                  className="grid h-11 w-11 place-items-center rounded-full border border-[#C9D9D1] bg-[#F8FBF9] text-[#183B40] transition hover:-translate-y-0.5 hover:bg-[#EAF4EF]"
                  aria-label={`Hear pronunciation of ${word.term}`}
                  title="Hear pronunciation"
                >
                  <Volume2 size={18} />
                </button>
              </div>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#4A5D54] sm:text-lg">
                {word.definition}
              </p>
            </div>

            {relevantIllustration && (
              <div className="flex justify-center md:justify-end">
                <div className="relative flex items-center justify-center rounded-2xl bg-[#F8F5EC] p-3 border border-[#E3E9E5]">
                  <img
                    src={relevantIllustration}
                    alt={illustrationAlt}
                    className="h-20 w-24 object-contain sm:h-28 sm:w-32 lg:h-32 lg:w-36 transition-transform hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="h-px bg-[#E7ECE9]" />
        <p className="mt-5 max-w-xl text-xs font-semibold leading-5 text-[#8A9690]">
          Read the meaning, hear the word, then move forward when it feels familiar.
        </p>
      </div>
    </article>
  );
}
