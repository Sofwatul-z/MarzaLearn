import { useState } from "react";
import { Brush, CheckCircle2, CloudOff } from "lucide-react";
import CanvasBoard from "../CanvasBoard";
import { uploadVisualAsset } from "../../../services/session";
import SourceNote from "../../common/SourceNote";

export default function VisualizeStep({
  content,
  value,
  onChange,
  studentId,
  chapterId,
  theme,
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
          <span
            style={{
              backgroundColor: theme?.badgeBg,
              borderColor: theme?.borderSoft,
              color: theme?.primaryDark,
            }}
            className="ml-eyebrow"
          >
            Step 03 · Visualize
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-[#24332D] sm:text-4xl">
            {content.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#65736D] sm:text-base">{content.instructions}</p>
          {content.example && (
            <p className="mt-2 text-xs font-semibold leading-5 text-[#849089]">Example: {content.example}</p>
          )}
        </div>
        <div
          style={{ borderColor: theme?.primary || "#E8CDBD" }}
          className="border-l-4 pl-5"
        >
          <p
            style={{ color: theme?.primaryMuted }}
            className="text-[10px] font-extrabold uppercase tracking-[0.14em]"
          >
            Visual progress
          </p>
          <p className="mt-1 text-2xl font-extrabold tracking-[-0.04em] text-[#24332D]">{savedCount}/{content.prompts.length}</p>
          <p className="mt-1 text-xs leading-5 text-[#7A8780]">Draw directly or upload an image for each prompt.</p>
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
          <Brush size={16} />
          <span>What to Do in this Step:</span>
        </div>
        <ol
          style={{ color: theme?.primaryDark || "#4A5D54" }}
          className="mt-2.5 space-y-1.5 text-xs sm:text-sm font-medium leading-relaxed opacity-95"
        >
          <li>1. Select each word prompt using the pill buttons below (e.g. <em>{content.prompts[0]}</em>).</li>
          <li>2. Create a visual that you feel <strong>represents</strong> the words below: either draw directly using brushes and shapes on a digital canvas, OR <strong>upload an image</strong> from your device.</li>
          <li>3. Click the <strong>Save Visual</strong> button inside the canvas card to save your work.</li>
          <li>4. Save artwork for all {content.prompts.length} words to unlock the next step!</li>
        </ol>
      </div>

      <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
        {content.prompts.map((prompt, index) => {
          const saved = Boolean(items[index]?.savedAt);
          return (
            <button
              key={prompt}
              type="button"
              onClick={() => setActiveIndex(index)}
              style={
                activeIndex === index
                  ? {
                      backgroundColor: theme?.primaryDark || "#24332D",
                      borderColor: theme?.primaryDark || "#24332D",
                      color: "#FFFFFF",
                    }
                  : saved
                    ? {
                        backgroundColor: theme?.badgeBg || "#EAF4EF",
                        borderColor: theme?.borderSoft || "#BBD4C8",
                        color: theme?.badgeText || "#496759",
                      }
                    : {}
              }
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-extrabold transition ${
                activeIndex === index
                  ? "shadow-sm"
                  : saved
                    ? ""
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

      <div
        style={{ borderColor: theme?.borderSoft || "#DDE5E0" }}
        className="mt-3 rounded-[30px] border bg-white/75 p-5 shadow-[0_16px_45px_rgba(36,51,45,0.045)] sm:p-7"
      >
        <CanvasBoard
          key={`${activeIndex}-${items[activeIndex]?.savedAt ?? "new"}`}
          prompt={content.prompts[activeIndex]}
          value={items[activeIndex]}
          onSave={saveVisual}
          theme={theme}
        />
      </div>
      <SourceNote source={content.source} />
    </div>
  );
}
