import { useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, Layers3, Sparkles } from "lucide-react";
import Button from "../common/Button";

export default function ChapterCard({ chapter, index, onEdit, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-[#DCE4DF] bg-white/85 p-6 shadow-[0_8px_24px_rgba(36,51,45,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#9FB9AC] hover:shadow-[0_16px_36px_rgba(36,51,45,0.07)] sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="flex items-start gap-4 sm:gap-5">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#CFE8DD] text-base font-extrabold text-[#24332D] shadow-sm">
            {String(chapter.chapter_number ?? index + 1).padStart(2, "0")}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#EAF4EF] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#476759]">
                Semester {chapter.semester || 1}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#738079]">
                6 Marzano Steps
              </span>
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-700">
                PjBL Project
              </span>
            </div>

            <h3 className="mt-2 text-xl font-extrabold tracking-[-0.03em] text-[#24332D] group-hover:text-emerald-950 transition-colors">
              {chapter.title}
            </h3>

            <p className="mt-1.5 max-w-2xl text-xs sm:text-sm leading-6 text-[#67776F]">
              {chapter.description || "Manage chapter vocabulary, grammar, listening materials, and student project assignments."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(chapter)}
              className="text-[#5B7568]"
            >
              Edit
            </Button>
          )}

          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(chapter.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              Delete
            </Button>
          )}

          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate(`/teacher/chapters/${chapter.databaseId ?? chapter.id}`)}
            className="group-hover:bg-[#24332D] group-hover:text-white transition-all"
          >
            Open Materials <ArrowRight size={15} />
          </Button>
        </div>
      </div>
    </div>
  );
}
