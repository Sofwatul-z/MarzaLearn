import { useEffect, useRef, useState } from "react";
import {
  Brush,
  Check,
  Eraser,
  ImagePlus,
  PenLine,
  Redo2,
  RotateCcw,
  Trash2,
  Undo2,
  Upload,
} from "lucide-react";
import Button from "../common/Button";

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 560;

function canvasToBlob(canvas, type = "image/png", quality = 0.92) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

function readAsDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function compressImage(file) {
  const sourceUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = sourceUrl;
    });

    const maxDimension = 1280;
    const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    const blob =
      (await canvasToBlob(canvas, "image/webp", 0.84)) ??
      (await canvasToBlob(canvas, "image/jpeg", 0.86));
    const preview = await readAsDataUrl(blob);
    return { blob, preview };
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}

export default function CanvasBoard({ prompt, value, onSave }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);

  const [mode, setMode] = useState(value?.mode ?? "draw");
  const [tool, setTool] = useState("pen");
  const [dirty, setDirty] = useState(false);
  const [uploadBlob, setUploadBlob] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(
    value?.mode === "upload" ? value?.preview ?? null : null
  );
  const [busy, setBusy] = useState(false);
  const [historyState, setHistoryState] = useState({ canUndo: false, canRedo: false });

  function syncHistoryState() {
    setHistoryState({
      canUndo: historyIndexRef.current > 0,
      canRedo:
        historyIndexRef.current >= 0 &&
        historyIndexRef.current < historyRef.current.length - 1,
    });
  }

  function paintWhite(context) {
    context.save();
    context.globalCompositeOperation = "source-over";
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.restore();
  }

  function pushHistory() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const snapshot = canvas.toDataURL("image/png");
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push(snapshot);
    historyIndexRef.current = historyRef.current.length - 1;
    syncHistoryState();
  }

  function loadSnapshot(snapshot, markDirty = false) {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    paintWhite(context);
    if (!snapshot) {
      if (markDirty) setDirty(true);
      return;
    }

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      paintWhite(context);
      context.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      if (markDirty) setDirty(true);
    };
    image.src = snapshot;
  }

  useEffect(() => {
    if (mode !== "draw") return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    paintWhite(context);

    const initial = value?.mode === "draw" ? value?.preview : null;
    if (initial) {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => {
        paintWhite(context);
        context.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        historyRef.current = [canvas.toDataURL("image/png")];
        historyIndexRef.current = 0;
        syncHistoryState();
      };
      image.src = initial;
    } else {
      historyRef.current = [canvas.toDataURL("image/png")];
      historyIndexRef.current = 0;
      syncHistoryState();
    }
  }, [mode, value?.mode, value?.preview]);

  function pointFromEvent(event) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function pointerDown(event) {
    if (mode !== "draw") return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const point = pointFromEvent(event);
    drawingRef.current = true;
    canvas.setPointerCapture?.(event.pointerId);
    context.beginPath();
    context.moveTo(point.x, point.y);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = tool === "eraser" ? "#ffffff" : "#24332D";
    context.lineWidth = tool === "eraser" ? 30 : 5;
  }

  function pointerMove(event) {
    if (!drawingRef.current || mode !== "draw") return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const point = pointFromEvent(event);
    context.lineTo(point.x, point.y);
    context.stroke();
    setDirty(true);
  }

  function pointerUp(event) {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    canvasRef.current?.releasePointerCapture?.(event.pointerId);
    pushHistory();
  }

  function undo() {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    loadSnapshot(historyRef.current[historyIndexRef.current], true);
    syncHistoryState();
  }

  function redo() {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    loadSnapshot(historyRef.current[historyIndexRef.current], true);
    syncHistoryState();
  }

  function clearCanvas() {
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;
    paintWhite(context);
    setDirty(true);
    pushHistory();
  }

  async function handleUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    setBusy(true);
    try {
      const processed = await compressImage(file);
      setUploadBlob(processed.blob);
      setUploadPreview(processed.preview);
      setDirty(true);
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  async function save() {
    setBusy(true);
    try {
      if (mode === "draw") {
        const canvas = canvasRef.current;
        const blob = await canvasToBlob(canvas, "image/png");
        const preview = canvas.toDataURL("image/png");
        const ok = await onSave?.({ mode, blob, preview });
        if (ok !== false) setDirty(false);
        return;
      }

      if (uploadBlob && uploadPreview) {
        const ok = await onSave?.({ mode, blob: uploadBlob, preview: uploadPreview });
        if (ok !== false) setDirty(false);
      }
    } finally {
      setBusy(false);
    }
  }

  const alreadySaved = Boolean(value?.savedAt);
  const saveDisabled = busy || (!dirty && alreadySaved) || (mode === "upload" && !uploadBlob && !alreadySaved);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#839089]">Visual prompt</p>
          <h3 className="mt-1 text-xl font-extrabold tracking-[-0.03em] text-[#24332D]">{prompt}</h3>
        </div>
        <div className="inline-flex w-fit rounded-[14px] border border-[#D8E1DC] bg-white p-1">
          <button
            type="button"
            onClick={() => setMode("draw")}
            className={`inline-flex items-center gap-2 rounded-[10px] px-3 py-2 text-xs font-extrabold transition ${
              mode === "draw" ? "bg-[#24332D] text-white" : "text-[#6D7A74] hover:bg-[#F1F5F2]"
            }`}
          >
            <Brush size={14} /> Draw
          </button>
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`inline-flex items-center gap-2 rounded-[10px] px-3 py-2 text-xs font-extrabold transition ${
              mode === "upload" ? "bg-[#24332D] text-white" : "text-[#6D7A74] hover:bg-[#F1F5F2]"
            }`}
          >
            <ImagePlus size={14} /> Upload
          </button>
        </div>
      </div>

      {mode === "draw" ? (
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setTool("pen")}
              className={`inline-flex h-9 items-center gap-2 rounded-full px-3 text-xs font-bold ${
                tool === "pen" ? "bg-[#CFE8DD] text-[#29483A]" : "bg-[#F0F4F1] text-[#65736D]"
              }`}
            >
              <PenLine size={14} /> Pen
            </button>
            <button
              type="button"
              onClick={() => setTool("eraser")}
              className={`inline-flex h-9 items-center gap-2 rounded-full px-3 text-xs font-bold ${
                tool === "eraser" ? "bg-[#F4D7C5] text-[#664638]" : "bg-[#F0F4F1] text-[#65736D]"
              }`}
            >
              <Eraser size={14} /> Eraser
            </button>
            <span className="mx-1 h-5 w-px bg-[#DDE4E0]" />
            <button type="button" onClick={undo} disabled={!historyState.canUndo} className="grid h-9 w-9 place-items-center rounded-full text-[#65736D] hover:bg-[#EFF4F1] disabled:opacity-30" aria-label="Undo">
              <Undo2 size={15} />
            </button>
            <button type="button" onClick={redo} disabled={!historyState.canRedo} className="grid h-9 w-9 place-items-center rounded-full text-[#65736D] hover:bg-[#EFF4F1] disabled:opacity-30" aria-label="Redo">
              <Redo2 size={15} />
            </button>
            <button type="button" onClick={clearCanvas} className="grid h-9 w-9 place-items-center rounded-full text-[#8F5A52] hover:bg-[#FAECE9]" aria-label="Clear canvas">
              <Trash2 size={15} />
            </button>
          </div>

          <div className="overflow-hidden rounded-[24px] border-2 border-dashed border-[#BED1C7] bg-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.7)]">
            <canvas
              ref={canvasRef}
              onPointerDown={pointerDown}
              onPointerMove={pointerMove}
              onPointerUp={pointerUp}
              onPointerCancel={pointerUp}
              onPointerLeave={(event) => drawingRef.current && pointerUp(event)}
              className="block aspect-[45/28] w-full touch-none cursor-crosshair bg-white"
              aria-label={`Drawing canvas for ${prompt}`}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-[24px] border-2 border-dashed border-[#C9D7D0] bg-[#F9FBF9] p-5 sm:p-7">
          {uploadPreview || (value?.mode === "upload" && value?.preview) ? (
            <div className="overflow-hidden rounded-[18px] border border-[#E0E6E2] bg-white">
              <img
                src={uploadPreview ?? value.preview}
                alt={`Uploaded visual for ${prompt}`}
                className="mx-auto max-h-[440px] w-full object-contain"
              />
            </div>
          ) : (
            <div className="grid min-h-[280px] place-items-center text-center">
              <div>
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#EAF4EF] text-[#4D6A5C]">
                  <Upload size={19} />
                </div>
                <p className="mt-4 font-extrabold text-[#24332D]">Upload your own visual</p>
                <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#7B8781]">Choose a photo or drawing from your device. Large images are resized before upload.</p>
              </div>
            </div>
          )}

          <label className="mt-4 inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-[13px] border border-[#D1DDD6] bg-white px-4 py-2 text-xs font-extrabold text-[#4E6258] transition hover:bg-[#F3F7F4]">
            <ImagePlus size={14} /> {uploadPreview ? "Choose another image" : "Choose image"}
            <input type="file" accept="image/*" onChange={handleUpload} className="sr-only" />
          </label>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-semibold text-[#7F8B85]">
          {value?.pendingUpload
            ? "Saved for recovery on this device; cloud upload will need the Storage setup."
            : alreadySaved && !dirty
              ? "Visual saved. You can replace it before moving on."
              : "Save this visual before continuing."}
        </p>
        <Button variant={alreadySaved && !dirty ? "secondary" : "pastel"} size="sm" onClick={save} disabled={saveDisabled}>
          {busy ? <RotateCcw size={14} className="animate-spin" /> : <Check size={14} />}
          {busy ? "Saving..." : alreadySaved && !dirty ? "Saved" : "Save visual"}
        </Button>
      </div>
    </div>
  );
}
