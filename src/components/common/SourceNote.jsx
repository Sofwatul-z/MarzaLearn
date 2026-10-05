export default function SourceNote({ source, className = "" }) {
  if (!source) return null;
  
  // If the source is wrapped in [Sumber Materi: ...], strip it out to avoid duplication
  // since we can render it nicely
  let cleanSource = source;
  if (source.startsWith("[Sumber Materi:") || source.startsWith("[Sumber Materi :")) {
    cleanSource = source.replace(/\[Sumber Materi:?\s*/i, "").replace(/\]$/, "");
  }

  return (
    <p className={`mt-5 text-[11px] text-[#8A9690] italic ${className}`}>
      Sumber Materi: {cleanSource}
    </p>
  );
}
