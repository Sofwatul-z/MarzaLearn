export default function StudentCard({ student, index, onView }) {
  return (
    <div className="group flex items-center gap-6 py-7 border-b border-slate-100">
      <div className="w-12 h-12 shrink-0 rounded-full bg-[#edf6f1] flex items-center justify-center text-sm font-semibold text-[#23332e] group-hover:bg-[#dceee7] transition">
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="flex-1">
        <h3 className="text-lg md:text-xl font-semibold text-[#23332e]">
          {student.full_name}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {student.student_id} · Class {student.class_name}
        </p>

        <p className="mt-2 text-sm text-slate-500">
          Monitor learning progress and chapter completion.
        </p>
      </div>

      <button
        type="button"
        onClick={onView}
        className="rounded-full border border-slate-200 px-5 py-2.5 text-sm text-[#23332e] hover:bg-slate-50 transition"
      >
        View Progress →
      </button>
    </div>
  );
}