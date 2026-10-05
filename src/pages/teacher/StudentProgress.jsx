export default function StudentProgress({ student }) {
  const progress = student?.progress || {};

  const items = [
    {
      number: "01",
      title: "Chapter Completion",
      value: `${progress.completed_chapters || 0} Chapters`,
      description: "Completed learning materials and chapter activities."
    },
    {
      number: "02",
      title: "Average Score",
      value: `${progress.average_score || 0}%`,
      description: "Average performance from completed exercises."
    },
    {
      number: "03",
      title: "Learning Activity",
      value: `${progress.activities || 0} Activities`,
      description: "Total learning activities completed."
    }
  ];

  return (
    <section className="mt-12">
      <div className="mb-10">
        <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-slate-400">
          Learning Progress
        </p>

        <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#23332e]">
          Student journey
        </h2>

        <p className="mt-3 text-sm text-slate-500 max-w-lg">
          Track learning development and classroom progress from each activity.
        </p>
      </div>


      <div className="border-t border-slate-100">
        {items.map((item) => (
          <div
            key={item.number}
            className="flex items-center gap-6 py-8 border-b border-slate-100 group"
          >
            <div className="w-12 h-12 shrink-0 rounded-full bg-[#edf6f1] flex items-center justify-center text-sm font-semibold text-[#23332e] group-hover:bg-[#dceee7] transition">
              {item.number}
            </div>


            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-semibold text-[#23332e]">
                {item.title}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {item.description}
              </p>
            </div>


            <div className="text-right">
              <p className="text-xl font-bold text-[#23332e]">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>


      <div className="mt-10 border-t border-slate-100 pt-8">
        <p className="text-[11px] uppercase tracking-widest text-slate-400">
          Student Overview
        </p>

        <div className="mt-4 flex flex-wrap gap-x-10 gap-y-5">

          <div>
            <p className="text-2xl font-bold text-[#23332e]">
              {student?.full_name || "-"}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Student name
            </p>
          </div>


          <div>
            <p className="text-2xl font-bold text-[#23332e]">
              {student?.class_name || "-"}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Class
            </p>
          </div>


          <div>
            <p className="text-2xl font-bold text-[#23332e]">
              {student?.student_id || "-"}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Student ID
            </p>
          </div>

        </div>
      </div>

    </section>
  );
}