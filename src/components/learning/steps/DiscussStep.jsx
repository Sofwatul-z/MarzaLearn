import { MessageSquareText, Quote, Sparkles } from "lucide-react";
import { countSentences, countWords } from "../../../utils/learning";
import SourceNote from "../../common/SourceNote";

export default function DiscussStep({ content, value, onChange }) {
  const response = value?.response ?? "";
  const words = countWords(response);
  const sentences = countSentences(response);

  return (
    <div className="relative" data-step-content>
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#4D7C0F]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#65A30D]" />
          Step 05 · Discuss
        </div>
        <h2 className="mt-2 text-2xl font-black tracking-[-0.035em] text-[#14261F] sm:text-3xl">
          Let's Talk & Share!
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#5A7066]">
          Turn what you learned into your own idea. Your teacher will be able to review this response later.
        </p>
      </div>

      <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          {/* Prompt Box */}
          <div className="relative overflow-hidden rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/60 via-white to-amber-50/30 p-5 shadow-xs sm:p-6">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#65A30D]" />
            <div className="flex items-start gap-3.5 pl-1.5">
              <MessageSquareText size={20} className="mt-0.5 shrink-0 text-[#4D7C0F]" />
              <p className="text-sm font-bold leading-relaxed text-[#1F332A] sm:text-base">
                {content.prompt}
              </p>
            </div>
          </div>

          {/* Writing Area */}
          <div className="relative mt-5">
            <textarea
              value={response}
              onChange={(event) => onChange?.({ ...value, response: event.target.value })}
              rows={8}
              className="w-full rounded-2xl border border-[#CCD8D1] bg-white px-5 py-4 text-[15px] font-medium leading-relaxed text-[#14261F] shadow-xs placeholder-[#94A49B] transition-all focus:border-emerald-600 focus:outline-hidden focus:ring-4 focus:ring-emerald-500/15"
              placeholder="Write your thoughts here... Share your ideas in 2–3 sentences using the vocabulary you learned."
            />
          </div>

          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#6F8279]">
            <span>
              {words} words · {sentences} {sentences === 1 ? "sentence" : "sentences"}
            </span>
            <span className={response.trim().length >= 20 ? "text-emerald-700 font-black" : "text-amber-700"}>
              {response.trim().length >= 20 ? "✓ Ready to advance" : "Write at least 20 characters to advance"}
            </span>
          </div>
        </div>

        {/* Example Box */}
        <aside className="relative rounded-3xl border border-emerald-900/10 bg-gradient-to-b from-[#F2F8F5] to-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-emerald-900/10 pb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#0F5132]">
              Example
            </span>
            <Quote size={18} className="text-[#0F5132]/60" />
          </div>

          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#8A9690]">
            Model Sentence Structure
          </p>
          <p className="mt-2 text-sm italic leading-relaxed text-[#2D453B]">
            "{content.example}"
          </p>

          <div className="mt-6 border-t border-emerald-900/10 pt-4 flex items-start gap-2 text-xs font-semibold text-[#667A71]">
            <Sparkles size={14} className="mt-0.5 text-amber-500 shrink-0" />
            <span>Use the example as inspiration for sentence flow, not something to copy word-for-word.</span>
          </div>
        </aside>
      </div>

      {response.trim().length >= 20 && (
        <div className="mt-6 flex items-center gap-3.5 rounded-2xl border border-emerald-300 bg-emerald-50/90 p-4 text-xs font-bold text-emerald-900 shadow-sm">
          <span className="text-2xl">✨</span>
          <span>
            Excellent work! Your reflection is thoughtful and well-written. Click <strong>Next Step</strong> below to enter the final quiz!
          </span>
        </div>
      )}

      <SourceNote source={content.source} />
    </div>
  );
}
