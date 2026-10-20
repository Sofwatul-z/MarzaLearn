import { useState } from "react";
import {
  RotateCcw,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Sparkles,
  BookOpen,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { CHAPTER_CATALOG } from "../../data/chapterCatalog";
import {
  resetStudentChapterProgress,
  resetAllStudentProgress,
} from "../../services/teacher";

export default function StudentProgress({ student, onRefresh }) {
  const [resettingId, setResettingId] = useState(null); // 'all' or chapterId
  const [confirmModal, setConfirmModal] = useState(null); // { type: 'chapter' | 'all', chapterId?: number, chapterTitle?: string }
  const [toastMessage, setToastMessage] = useState(null);

  const progress = student?.progress || {};
  const rows = progress.rows || [];

  const items = [
    {
      number: "01",
      title: "Chapter Completion",
      value: `${progress.completed_chapters || 0} Chapters`,
      description: "Completed learning materials and chapter activities.",
    },
    {
      number: "02",
      title: "Average Score",
      value: `${progress.average_score || 0}%`,
      description: "Average performance from completed exercises.",
    },
    {
      number: "03",
      title: "Learning Activity",
      value: `${progress.activities || 0} Activities`,
      description: "Total learning activities completed.",
    },
  ];

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  }

  async function handleConfirmReset() {
    if (!confirmModal || !student?.id) return;
    const { type, chapterId } = confirmModal;
    setResettingId(type === "all" ? "all" : chapterId);
    setConfirmModal(null);

    try {
      let res;
      if (type === "all") {
        res = await resetAllStudentProgress(student.id);
      } else {
        res = await resetStudentChapterProgress(student.id, chapterId);
      }

      if (res?.ok) {
        showToast(
          type === "all"
            ? `Seluruh progres pembelajaran ${student.full_name || "siswa"} berhasil direset ke awal.`
            : `Progres Chapter ${chapterId} untuk ${student.full_name || "siswa"} berhasil direset ke awal.`
        );
        onRefresh?.();
      } else {
        showToast("Gagal mereset progres. Silakan coba kembali.");
      }
    } catch (err) {
      console.error("Reset error:", err);
      showToast("Terjadi kendala saat mereset progres.");
    } finally {
      setResettingId(null);
    }
  }

  return (
    <section className="mt-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-600 hover:text-emerald-900"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Overview Stats */}
      <div className="mb-10">
        <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-slate-400">
          Learning Progress
        </p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#23332e]">
          Student journey
        </h2>
        <p className="mt-2 text-sm text-slate-500 max-w-lg">
          Track learning development and classroom progress from each activity.
        </p>
      </div>

      <div className="border-t border-slate-100">
        {items.map((item) => (
          <div
            key={item.number}
            className="flex items-center gap-6 py-6 border-b border-slate-100 group"
          >
            <div className="w-11 h-11 shrink-0 rounded-full bg-[#edf6f1] flex items-center justify-center text-sm font-semibold text-[#23332e] group-hover:bg-[#dceee7] transition">
              {item.number}
            </div>

            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-bold text-[#23332e]">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{item.description}</p>
            </div>

            <div className="text-right">
              <p className="text-xl font-extrabold text-[#23332e]">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Student Profile Info */}
      <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50/70 p-5 sm:p-6">
        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
          Student Profile
        </p>
        <div className="mt-3 flex flex-wrap gap-x-12 gap-y-3">
          <div>
            <p className="text-lg font-bold text-[#23332e]">
              {student?.full_name || "-"}
            </p>
            <p className="text-xs text-slate-500">Student Name</p>
          </div>
          <div>
            <p className="text-lg font-bold text-[#23332e]">
              {student?.class_name || "-"}
            </p>
            <p className="text-xs text-slate-500">Class</p>
          </div>
          <div>
            <p className="text-lg font-bold text-[#23332e]">
              {student?.student_id || "-"}
            </p>
            <p className="text-xs text-slate-500">Student ID</p>
          </div>
        </div>
      </div>

      {/* Chapter Progress & Reset Controls */}
      <div className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.16em] font-bold text-[#4B705F]">
              Pemicu Reset & Manajemen Bab
            </span>
            <h3 className="mt-1 text-2xl font-extrabold text-[#23332e]">
              Progres per Chapter (Marzano 6-Step)
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Reset pekerjaan siswa agar dapat mengulang dari awal (Step 1). Sinkron dengan database Supabase & panel siswa.
            </p>
          </div>

          <button
            type="button"
            disabled={resettingId !== null}
            onClick={() =>
              setConfirmModal({
                type: "all",
                chapterTitle: "Semua Chapter (1 - 5)",
              })
            }
            className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
          >
            {resettingId === "all" ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <RotateCcw size={14} />
            )}
            Reset Semua Chapter
          </button>
        </div>

        <div className="space-y-4">
          {CHAPTER_CATALOG.map((cat) => {
            const row = rows.find(
              (r) =>
                Number(r.chapter_id) === Number(cat.id) ||
                Number(r.chapter_id) === Number(cat.databaseId)
            );

            const percentage = Number(row?.percentage || 0);
            const isCompleted = percentage >= 100;
            const isInProgress = percentage > 0 && percentage < 100;

            const stepsState = [
              { label: "Provide", done: Boolean(row?.provide) },
              { label: "Restate", done: Boolean(row?.restate) },
              { label: "Visualize", done: Boolean(row?.visualize) },
              { label: "Engage", done: Boolean(row?.engage) },
              { label: "Discuss", done: Boolean(row?.discuss) },
              { label: "Games", done: Boolean(row?.play) },
            ];

            const isCurrentResetting = resettingId === cat.id;

            return (
              <div
                key={cat.id}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-[#8EBEAA]/60"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#EAF4EF] text-xs font-extrabold text-[#23332e]">
                      {String(cat.id).padStart(2, "0")}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-[#23332e] sm:text-base">
                        {cat.title}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {cat.focus || "English Material"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status badge */}
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-800">
                        <CheckCircle2 size={13} className="text-emerald-600" /> Selesai (100%)
                      </span>
                    ) : isInProgress ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-800">
                        <Clock3 size={13} className="text-amber-600" /> Progres ({percentage}%)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-500">
                        Belum Dimulai (0%)
                      </span>
                    )}

                    {/* Reset Button */}
                    <button
                      type="button"
                      disabled={resettingId !== null}
                      onClick={() =>
                        setConfirmModal({
                          type: "chapter",
                          chapterId: cat.id,
                          chapterTitle: `Chapter ${cat.id}: ${cat.title}`,
                        })
                      }
                      title="Reset progres siswa untuk bab ini"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50"
                    >
                      {isCurrentResetting ? (
                        <Loader2 size={13} className="animate-spin text-rose-600" />
                      ) : (
                        <RotateCcw size={13} />
                      )}
                      <span>Reset</span>
                    </button>
                  </div>
                </div>

                {/* Step indicators */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mr-1">
                    Langkah:
                  </span>
                  {stepsState.map((st, sIdx) => (
                    <span
                      key={st.label}
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                        st.done
                          ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                          : "border border-slate-200/60 bg-slate-50 text-slate-400"
                      }`}
                    >
                      {st.done ? (
                        <Check size={11} strokeWidth={3} className="text-emerald-600" />
                      ) : (
                        <span className="text-[10px] text-slate-400">{sIdx + 1}</span>
                      )}
                      <span>{st.label}</span>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-4">
              <RotateCcw size={22} />
            </div>

            <h3 className="text-xl font-extrabold text-[#23332e]">
              Reset Pekerjaan Siswa?
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Apakah Anda yakin ingin mereset progres siswa{" "}
              <strong>{student?.full_name}</strong> pada{" "}
              <strong>{confirmModal.chapterTitle}</strong>?
            </p>

            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-800">
              <p className="font-bold flex items-center gap-1.5">
                <AlertCircle size={14} className="shrink-0" />
                Dampak Reset:
              </p>
              <ul className="mt-1.5 list-disc list-inside space-y-1 text-amber-900/80">
                <li>Seluruh jawaban Step 1–6 akan dihapus.</li>
                <li>Progres kembali ke 0% dan status <em>Not Started</em>.</li>
                <li>Tersinkronisasi langsung ke database dan panel siswa.</li>
              </ul>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-rose-700 shadow-md shadow-rose-600/20 transition"
              >
                <RotateCcw size={14} />
                Ya, Reset Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
