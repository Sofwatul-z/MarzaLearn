import { CheckCircle2, Lightbulb } from "lucide-react";
import SourceNote from "../../common/SourceNote";

export default function RestateStep({ content, value, onChange }) {
  const responses = value?.responses ?? {};
  const completed = content.prompts.filter((_, index) => responses[index]?.trim()).length;

  function update(index, text) {
    onChange?.({
      ...value,
      responses: { ...responses, [index]: text },
    });
  }

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
        <div className="max-w-3xl">
          <span className="ml-eyebrow">Step 02 · Restate</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-[#24332D] sm:text-4xl">
            {content.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#65736D] sm:text-base">{content.instructions}</p>
        </div>
        <div className="border-l-2 border-[#C6DDD2] pl-5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#839089]">Writing progress</p>
          <p className="mt-1 text-2xl font-extrabold tracking-[-0.04em] text-[#24332D]">{completed}/{content.prompts.length}</p>
          <p className="mt-1 text-xs leading-5 text-[#7A8780]">Complete every response to unlock the next step.</p>
        </div>
      </div>

      <div className="mt-8 divide-y divide-[#E3E9E5] border-y border-[#E3E9E5]">
        {content.prompts.map((prompt, index) => {
          const text = responses[index] ?? "";
          const done = Boolean(text.trim());
          return (
            <div key={prompt} className="grid gap-4 py-6 sm:grid-cols-[190px_minmax(0,1fr)] sm:gap-8 sm:py-7">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold tabular-nums text-[#98A39D]">{String(index + 1).padStart(2, "0")}</span>
                  {done && <CheckCircle2 size={15} className="text-[#54806B]" />}
                </div>
                <p className="mt-2 text-lg font-extrabold tracking-[-0.025em] text-[#24332D]">{prompt}</p>
              </div>
              <div>
                <textarea
                  value={text}
                  onChange={(event) => update(index, event.target.value)}
                  rows={3}
                  className="ml-input min-h-[112px] resize-y leading-7"
                  placeholder={`Write your own sentence using ${prompt.split(" (")[0]}...`}
                  aria-label={`Your sentence for ${prompt}`}
                />
                <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-[#8A9690]">
                  <Lightbulb size={13} /> Make it your sentence, not a copied definition.
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <SourceNote source={content.source} />
    </div>
  );
}
