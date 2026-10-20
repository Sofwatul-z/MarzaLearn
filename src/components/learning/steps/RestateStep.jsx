import { CheckCircle2, Lightbulb, PenLine } from "lucide-react";
import SourceNote from "../../common/SourceNote";

export default function RestateStep({ content, value, onChange, theme }) {
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
          <span
            style={{
              backgroundColor: theme?.badgeBg,
              borderColor: theme?.borderSoft,
              color: theme?.primaryDark,
            }}
            className="ml-eyebrow"
          >
            Step 02 · Restate
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
            Writing progress
          </p>
          <p className="mt-1 text-2xl font-extrabold tracking-[-0.04em] text-[#24332D]">{completed}/{content.prompts.length}</p>
          <p className="mt-1 text-xs leading-5 text-[#7A8780]">Complete every response to unlock the next step.</p>
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
          <PenLine size={16} />
          <span>What to Do in this Step:</span>
        </div>
        <ol
          style={{ color: theme?.primaryDark || "#4A5D54" }}
          className="mt-2.5 space-y-1.5 text-xs sm:text-sm font-medium leading-relaxed opacity-95"
        >
          <li>1. Read each vocabulary word prompt on the left.</li>
          <li>2. In the text area, write an original sentence in the <strong>Simple Present Tense</strong> using the target word. <em>(Do not copy directly from the dictionary!)</em></li>
          <li>3. <strong>Challenge:</strong> Try including descriptive adverbs like <em>really, very, extremely,</em> or <em>quite</em> to enhance your writing.</li>
          <li>4. Complete all {content.prompts.length} sentences ({completed}/{content.prompts.length} completed) to unlock the next step!</li>
        </ol>
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
