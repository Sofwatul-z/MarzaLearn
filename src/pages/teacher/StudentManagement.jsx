import { useEffect, useState } from "react";
import { getStudentsByClass } from "../../services/teacher";
import StudentProgress from "./StudentProgress";
import StudentCard from "../../components/teacher/StudentCard";
import BackDashboard from "../../components/teacher/BackDashboard";

export default function StudentManagement() {
  const [cls, setCls] = useState("XC");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    async function loadStudents() {
      setLoading(true);
      setError("");

      try {
        const result = await getStudentsByClass(cls);
        setStudents(Array.isArray(result) ? result : []);
      } catch (err) {
        console.error("Student RPC Error:", err);
        setStudents([]);
        setError("Unable to load students. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadStudents();
  }, [cls]);

  return (
  <section className="min-h-screen bg-white py-10">
    <div className="max-w-5xl mx-auto px-8">
      <BackDashboard />
      <div className="mb-14">
        <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-slate-400">
          Teacher Workspace
        </p>

        <h1 className="mt-3 text-4xl md:text-[42px] font-bold tracking-tight text-[#23332e]">
          Student Community
        </h1>

        <p className="mt-4 max-w-lg text-sm md:text-base text-slate-500">
          Manage and monitor your learners progress throughout the classroom journey.
        </p>
      </div>


      <div className="flex gap-3 mb-10">
        {["XC", "XD"].map((c) => (
          <button
            key={c}
            onClick={() => setCls(c)}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
              cls === c
                ? "bg-[#23332e] text-white"
                : "border border-slate-200 bg-white text-[#23332e] hover:bg-slate-50"
            }`}
          >
            Class {c}
          </button>
        ))}
      </div>


      <div className="border-y border-slate-100 py-6 mb-8">
        <p className="text-[11px] uppercase tracking-widest text-slate-400">
          Current Class
        </p>

        <p className="mt-2 text-3xl font-bold text-[#23332e]">
          {students.length}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Students registered in class {cls}
        </p>
      </div>


      {loading && (
        <p className="py-6 text-sm text-slate-500">
          Loading students...
        </p>
      )}


      {error && (
        <div className="rounded-xl bg-red-50 p-5 text-sm text-red-600">
          {error}
        </div>
      )}


      {!loading && !error && students.length === 0 && (
        <div className="py-8">
          <p className="font-semibold text-[#23332e]">
            No students found
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Belum ada siswa pada kelas {cls}.
          </p>
        </div>
      )}


      {!loading && !error && students.length > 0 && (
        <div className="border-t border-slate-100">
          {students.map((student, index) => (
            <StudentCard
              key={student.id}
              student={student}
              index={index}
              onView={() => setSelectedStudent(student)}
            />
          ))}
        </div>
      )}


      {selectedStudent && (
        <div className="mt-12 border-t border-slate-100 pt-8">

          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-slate-400">
                Student Monitoring
              </p>

              <h2 className="mt-3 text-2xl font-bold text-[#23332e]">
                {selectedStudent.full_name}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {selectedStudent.student_id} · Class {selectedStudent.class_name}
              </p>
            </div>


            <button
              type="button"
              onClick={() => setSelectedStudent(null)}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-500 hover:bg-slate-50 transition"
            >
              Close
            </button>
          </div>


          <StudentProgress student={selectedStudent} />

        </div>
      )}

    </div>
  </section>
);
}
