import { Link } from "react-router-dom";

export default function Logo({ to = "/", compact = false, className = "", theme }) {
  const night = theme?.id === "analytical-exposition";

  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-3 rounded-xl focus-visible:outline-none ${className}`}
      aria-label="MarzaLearn home"
    >
      <span
        className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-[14px] shadow-[0_8px_20px_rgba(36,51,45,0.13)]"
        style={{
          backgroundColor: night ? theme.primaryDark : "#24332D",
          boxShadow: night ? "0 8px 20px rgba(91,33,182,0.22)" : undefined,
        }}
      >
        <span
          className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
          style={{ backgroundColor: night ? theme.primary : "#CFE8DD" }}
        />
        <span className="relative text-[15px] font-extrabold tracking-[-0.08em] text-white">
          ML
        </span>
      </span>

      {!compact && (
        <span
          className="text-[1.2rem] font-extrabold tracking-[-0.045em]"
          style={{ color: night ? theme.primaryDark : "#24332D" }}
        >
          Marza<span style={{ color: night ? theme.primaryMuted : "#6D897C" }}>Learn</span>
        </span>
      )}
    </Link>
  );
}
