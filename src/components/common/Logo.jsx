import { Link } from "react-router-dom";

export default function Logo({ to = "/", compact = false, className = "" }) {
  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-3 rounded-xl focus-visible:outline-none ${className}`}
      aria-label="MarzaLearn home"
    >
      <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-[14px] bg-[#24332D] shadow-[0_8px_20px_rgba(36,51,45,0.13)]">
        <span className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-[#CFE8DD]" />
        <span className="relative text-[15px] font-extrabold tracking-[-0.08em] text-white">
          ML
        </span>
      </span>

      {!compact && (
        <span className="text-[1.2rem] font-extrabold tracking-[-0.045em] text-[#24332D]">
          Marza<span className="text-[#6D897C]">Learn</span>
        </span>
      )}
    </Link>
  );
}
