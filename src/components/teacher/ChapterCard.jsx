import { useNavigate } from "react-router-dom";

export default function ChapterCard({ chapter, index, onEdit, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="group flex items-center gap-6 py-8 border-b border-slate-100 transition-all duration-300 hover:px-3">
      <div className="w-12 h-12 shrink-0 rounded-full bg-[#edf6f1] flex items-center justify-center text-sm font-semibold text-[#23332e] transition-all duration-300 group-hover:bg-[#dceee7]">
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="flex-1">
        <h3 className="text-xl font-semibold tracking-tight text-[#23332e]">
          {chapter.title}
        </h3>

        <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
          {chapter.description || "Manage chapter materials, exercises, and learning activities."}
        </p>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {onEdit && (
          <button
            onClick={() => onEdit(chapter)}
            className="text-sm font-semibold text-[#5B7568] transition hover:text-[#24332D]"
          >
            Edit
          </button>
        )}
        
        {onDelete && (
          <button
            onClick={() => onDelete(chapter.id)}
            className="text-sm font-semibold text-red-400 transition hover:text-red-600"
          >
            Delete
          </button>
        )}

        <button
          onClick={() => navigate(`/teacher/chapters/${chapter.id}`)}
          className="rounded-full border border-slate-200 px-5 py-2.5 text-sm text-[#23332e] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-sm"
        >
          Open →
        </button>
      </div>
    </div>
  );
}