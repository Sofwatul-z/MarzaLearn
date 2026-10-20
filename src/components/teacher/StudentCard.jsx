import { ArrowRight, UserCheck } from "lucide-react";
import Button from "../common/Button";

export default function StudentCard({ student, index, onView }) {
  const initials = (student.full_name ?? "S")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  return (
    <div className="group rounded-[24px] border border-[#DCE4DF] bg-white/85 p-5 shadow-[0_6px_18px_rgba(36,51,45,0.03)] transition-all duration-300 hover:border-[#9FB9AC] hover:shadow-[0_12px_28px_rgba(36,51,45,0.06)] hover:-translate-y-0.5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#CFE8DD] text-sm font-extrabold text-[#24332D] shadow-xs">
          {initials || String(index + 1).padStart(2, "0")}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#EAF4EF] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#476759]">
              Class {student.class_name}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#738079]">
              NISN: {student.student_id || student.id.slice(0, 8)}
            </span>
          </div>

          <h3 className="mt-1.5 text-lg font-extrabold tracking-[-0.02em] text-[#24332D] group-hover:text-emerald-950 transition-colors">
            {student.full_name}
          </h3>

          <p className="text-xs text-[#7B8881]">
            Active student · 6-Step mission & Project video tracking
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
        <Button
          variant="secondary"
          size="sm"
          onClick={onView}
          className="group-hover:bg-[#24332D] group-hover:text-white hover:!bg-[#24332D] hover:!text-white transition-all"
        >
          View Progress & Reset <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  );
}
