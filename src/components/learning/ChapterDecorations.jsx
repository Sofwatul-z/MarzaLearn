export default function ChapterDecorations() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none" aria-hidden="true">
      {/* Grid Pattern Background */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(148, 163, 184, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px",
        }}
      />
    </div>
  );
}
