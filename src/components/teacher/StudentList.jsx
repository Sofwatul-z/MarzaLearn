export default function StudentList({ students = [], onView }) {
  return (
    <div className="border-t border-slate-100">
      {students.map((student, index) => (
        <div
          key={student.id}
          className="
          group
          flex
          items-center
          gap-6
          py-8
          border-b
          border-slate-100
          transition-all
          duration-300
          hover:px-3
          "
        >

          <div
            className="
            w-12
            h-12
            shrink-0
            rounded-full
            bg-[#edf6f1]
            flex
            items-center
            justify-center
            text-sm
            font-semibold
            text-[#23332e]
            transition-all
            duration-300
            group-hover:bg-[#dceee7]
            "
          >
            {String(index + 1).padStart(2, "0")}
          </div>


          <div className="flex-1">

            <h3
              className="
              text-lg
              md:text-xl
              font-semibold
              tracking-tight
              text-[#23332e]
              "
            >
              {student.full_name || student.name}
            </h3>


            <p
              className="
              mt-1
              text-sm
              text-slate-500
              "
            >
              {student.student_id || "Student"} · {student.class_name || "-"}
            </p>


            <p
              className="
              mt-2
              text-sm
              text-slate-500
              "
            >
              Monitor learning progress and classroom activity.
            </p>

          </div>


          <div className="flex items-center gap-5">

            <div className="text-right hidden sm:block">

              <p
                className="
                text-xl
                font-bold
                text-[#23332e]
                "
              >
                {student.progress || "0%"}
              </p>


              <p
                className="
                text-[11px]
                uppercase
                tracking-widest
                text-slate-400
                "
              >
                Progress
              </p>

            </div>


            <button
              type="button"
              onClick={() => onView?.(student)}
              className="
              rounded-full
              border
              border-slate-200
              px-5
              py-2.5
              text-sm
              text-[#23332e]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-slate-50
              hover:shadow-sm
              "
            >
              Open →
            </button>

          </div>

        </div>
      ))}
    </div>
  );
}