import { MessageSquareText, Quote } from "lucide-react";
import { countSentences, countWords } from "../../../utils/learning";
import SourceNote from "../../common/SourceNote";

export default function DiscussStep({ content, value, onChange }) {
  const response = value?.response ?? "";
  const words = countWords(response);
  const sentences = countSentences(response);

  return (
    <div>
      <div className="max-w-3xl">
        <span className="ml-eyebrow">Step 05 · Discuss</span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-[#24332D] sm:text-4xl">
          {content.title}
        </h2>
        <p className="mt-4 text-sm leading-7 text-[#65736D] sm:text-base">
          Turn what you learned into your own idea. Your teacher will be able to review this response later.
        </p>
      </div>

      <div className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <div className="border-l-4 border-[#E8C3AE] bg-[#FBEDE4]/55 px-5 py-5 sm:px-6">
            <div className="flex items-start gap-3">
              <MessageSquareText size={19} className="mt-0.5 shrink-0 text-[#806255]" />
              <p className="text-sm font-bold leading-7 text-[#4D5C55] sm:text-base">{content.prompt}</p>
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

        <aside className="rounded-[24px] border border-[#DCE4E0] bg-white/65 p-5 sm:p-6">
          <Quote size={20} className="text-[#769185]" />
          <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#86928C]">Example</p>
          <p className="mt-3 text-sm italic leading-7 text-[#66756E]">“{content.example}”</p>
          <p className="mt-5 border-t border-[#E4E9E6] pt-4 text-xs leading-5 text-[#8A9690]">Use the example as a guide for structure, not something to copy.</p>
        </aside>
      </div>
      <SourceNote source={content.source} />
    </div>
  );
}
