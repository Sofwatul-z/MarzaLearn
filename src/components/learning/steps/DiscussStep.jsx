import { MessageSquareText, Quote } from "lucide-react";
import { countSentences, countWords } from "../../../utils/learning";
import SourceNote from "../../common/SourceNote";

export default function DiscussStep({ content, value, onChange, theme }) {
  const response = value?.response ?? "";
  const words = countWords(response);
  const sentences = countSentences(response);

  return (
    <div>
      <div className="max-w-3xl">
        <span
          style={{
            backgroundColor: theme?.badgeBg,
            borderColor: theme?.borderSoft,
            color: theme?.primaryDark,
          }}
          className="ml-eyebrow"
        >
          Step 05 · Discuss
        </span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-[#24332D] sm:text-4xl">
          {content.title}
        </h2>
        <p className="mt-4 text-sm leading-7 text-[#65736D] sm:text-base">
          Turn what you learned into your own idea. Your teacher will be able to review this response later.
        </p>
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
          <MessageSquareText size={16} />
          <span>What to Do in this Step:</span>
        </div>
        <ol
          style={{ color: theme?.primaryDark || "#4A5D54" }}
          className="mt-2.5 space-y-1.5 text-xs sm:text-sm font-medium leading-relaxed opacity-95"
        >
          <li>1. Read the discussion question in the prompt box below.</li>
          <li>2. Read the <strong>Example</strong> card on the right to see good sentence structure and flow.</li>
          <li>3. Write your own paragraph (minimum 20 characters). Try using the target vocabulary you learned!</li>
          <li>4. Once written, advance to the final step: Games & Quiz!</li>
        </ol>
      </div>

      <div className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <div
            style={{
              borderColor: theme?.primary || "#E8C3AE",
              backgroundColor: theme?.bgSurface || "rgba(251, 237, 228, 0.55)",
            }}
            className="border-l-4 px-5 py-5 sm:px-6"
          >
            <div className="flex items-start gap-3">
              <MessageSquareText size={19} style={{ color: theme?.primaryDark }} className="mt-0.5 shrink-0" />
              <p
                style={{ color: theme?.primaryDark || "#4D5C55" }}
                className="text-sm font-bold leading-7 sm:text-base"
              >
                {content.prompt}
              </p>
            </div>
          </div>

          <textarea
            value={response}
            onChange={(event) => onChange?.({ ...value, response: event.target.value })}
            rows={8}
            className="ml-input mt-5 min-h-[230px] resize-y text-[15px] leading-7"
            placeholder="Write your response here..."
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-[#8A9690]">
            <span>{words} words · about {sentences} {sentences === 1 ? "sentence" : "sentences"}</span>
            <span>{response.trim().length >= 20 ? "Ready to continue" : "Write a complete response to continue"}</span>
          </div>
        </div>

        <aside
          style={{ borderColor: theme?.borderSoft || "#DCE4E0" }}
          className="rounded-[24px] border bg-white/65 p-5 sm:p-6"
        >
          <Quote size={20} style={{ color: theme?.primaryDark }} />
          <p
            style={{ color: theme?.primaryMuted }}
            className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.14em]"
          >
            Example
          </p>
          <p className="mt-3 text-sm italic leading-7 text-[#66756E]">“{content.example}”</p>
          <p className="mt-5 border-t border-[#E4E9E6] pt-4 text-xs leading-5 text-[#8A9690]">Use the example as a guide for structure, not something to copy.</p>
        </aside>
      </div>
      <SourceNote source={content.source} />
    </div>
  );
}
