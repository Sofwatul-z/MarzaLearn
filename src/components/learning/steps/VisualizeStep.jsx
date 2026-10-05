import { useState } from "react";
import { CheckCircle2, CloudOff } from "lucide-react";
import CanvasBoard from "../CanvasBoard";
import { uploadVisualAsset } from "../../../services/session";
import SourceNote from "../../common/SourceNote";

export default function VisualizeStep({
  content,
  value,
  onChange,
  studentId,
  chapterId,
}) {
  const items = value?.items ?? {};
  const firstIncomplete = content.prompts.findIndex((_, index) => !items[index]?.savedAt);
  const [activeIndex, setActiveIndex] = useState(firstIncomplete === -1 ? 0 : firstIncomplete);
  const savedCount = content.prompts.filter((_, index) => items[index]?.savedAt).length;

  async function saveVisual(payload) {
    const upload = await uploadVisualAsset({
      studentId,
      chapterId,
      promptIndex: activeIndex,
      blob: payload.blob,
    });

    const item = {
      mode: payload.mode,
      preview: payload.preview,
      storagePath: upload.ok ? upload.path : null,
      pendingUpload: !upload.ok,
      savedAt: new Date().toISOString(),
    };

    onChange?.({
      ...value,
      items: { ...items, [activeIndex]: item },
    });

    return true;
  }

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
        <div className="max-w-3xl">
          <span className="ml-eyebrow">Step 03 · Visualize</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-[#24332D] sm:text-4xl">
            {content.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#65736D] sm:text-base">{content.instructions}</p>
          {content.example && (
            <p className="mt-2 text-xs font-semibold leading-5 text-[#849089]">Example: {content.example}</p>
          )}
        </div>
        <div className="border-l-2 border-[#E8CDBD] pl-5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8E776A]">Visual progress</p>
          <p className="mt-1 text-2xl font-extrabold tracking-[-0.04em] text-[#24332D]">{savedCount}/{content.prompts.length}</p>
          <p className="mt-1 text-xs leading-5 text-[#7A8780]">Draw directly or upload an image for each prompt.</p>
        </div>
      </div>

      <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
        {content.prompts.map((prompt, index) => {
          const saved = Boolean(items[index]?.savedAt);
          return (
            <button
              key={prompt}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-extrabold transition ${
                activeIndex === index
                  ? "border-[#24332D] bg-[#24332D] text-white"
                  : saved
                    ? "border-[#BBD4C8] bg-[#EAF4EF] text-[#496759]"
                    : "border-[#D9E1DD] bg-white/80 text-[#718078] hover:border-[#BFCFC7]"
              }`}
            >
              {saved && <CheckCircle2 size={14} />}
              {prompt}
              {items[index]?.pendingUpload && <CloudOff size={13} />}
            </button>
          );
        })}
      </div>

      <div className="mt-3 rounded-[30px] border border-[#DDE5E0] bg-white/75 p-5 shadow-[0_16px_45px_rgba(36,51,45,0.045)] sm:p-7">
        <CanvasBoard
          key={`${activeIndex}-${items[activeIndex]?.savedAt ?? "new"}`}
          prompt={content.prompts[activeIndex]}
          value={items[activeIndex]}
          onSave={saveVisual}
        />
      </div>
      <SourceNote source={content.source} />
    </div>
  );
}
