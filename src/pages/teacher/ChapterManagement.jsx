import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import ChapterCard from "../../components/teacher/ChapterCard";
import { getTeacherChapters, createChapter } from "../../services/chapter";
import BackDashboard from "../../components/teacher/BackDashboard";

function ChapterModal({ onClose, onSave, existingChapters }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [semester, setSemester] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    // Calculate globally unique order_number to avoid unique constraint violations
    const maxOrder = existingChapters.reduce(
      (max, c) => Math.max(max, c.chapter_number || 0, c.order_number || 0),
      0
    );
    const autoOrder = maxOrder + 1;

    try {
      await onSave({ title, description, semester, order_number: autoOrder });
      onClose();
    } catch (err) {
      console.error("Supabase insert error:", err);
      setError(`Failed to save chapter: ${err.message || err.details || JSON.stringify(err)}`);
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-[28px] bg-white p-7 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-[#23332e]">New Chapter</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition">
            <X size={20} />
          </button>
        </div>

        {error && <div className="mb-4 text-sm text-red-500">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
            <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#5B7568] focus:ring-1 focus:ring-[#5B7568]"
              placeholder="e.g. Descriptive Text" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
            <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#5B7568] focus:ring-1 focus:ring-[#5B7568]"
              placeholder="Short overview..." />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Semester</label>
            <select value={semester} onChange={(e) => setSemester(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#5B7568]">
              <option value={1}>Semester 1</option>
              <option value={2}>Semester 2</option>
            </select>
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose}
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
              Cancel
            </button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Create Chapter"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ChapterManagement() {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function loadChapters() {
    try {
      const data = await getTeacherChapters();
      setChapters(data);
    } catch (loadError) {
      console.error("Failed to load teacher chapters:", loadError);
      setError("Unable to load chapters. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadChapters(); }, []);

  async function handleCreate(chapterData) {
    await createChapter(chapterData);
    await loadChapters();
  }

  const [selectedSemester, setSelectedSemester] = useState(1);

  if (loading) {
    return <div className="p-10 text-sm text-slate-500">Loading chapters...</div>;
  }

  const visibleChapters = chapters
    .filter((c) => Number(c.semester) === Number(selectedSemester))
    .sort((a, b) => (a.chapter_number ?? a.id) - (b.chapter_number ?? b.id));

  return (
    <div>
      <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <span className="ml-eyebrow">Curriculum library</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-[-0.055em] text-[#24332D]">
            Chapter Library
          </h1>
          <p className="mt-3 max-w-lg text-sm sm:text-base leading-7 text-[#67776F]">
            Organize learning chapters, review the 6 Marzano steps, and manage classroom materials.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Semester Switcher Pill (Matching Student ChapterPath) */}
          <div className="inline-flex rounded-full border border-[#DCE4DF] bg-white/80 p-1 shadow-[0_8px_24px_rgba(36,51,45,0.04)]">
            {[1, 2].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setSelectedSemester(value)}
                className={`rounded-full px-4 py-2 text-xs font-extrabold transition-all sm:px-5 ${
                  selectedSemester === value
                    ? "bg-[#24332D] text-white shadow-[0_6px_16px_rgba(36,51,45,0.14)]"
                    : "text-[#6C7973] hover:bg-[#F4F7F5] hover:text-[#24332D]"
                }`}
              >
                Semester {value}
              </button>
            ))}
          </div>

          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> New Chapter
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-8 rounded-2xl border border-[#E9C8C3] bg-[#FAECE9] p-4 text-sm font-semibold text-[#944A40]">
          {error}
        </div>
      )}

      {/* Chapters list rendered in unified card style */}
      <div className="space-y-4">
        {visibleChapters.length > 0 ? (
          visibleChapters.map((chapter, index) => (
            <ChapterCard
              key={chapter.databaseId ?? chapter.id}
              chapter={chapter}
              index={index}
            />
          ))
        ) : (
          <div className="rounded-[28px] border border-dashed border-[#DDE5E0] bg-white/50 p-12 text-center">
            <p className="text-base font-extrabold text-[#24332D]">No chapters in Semester {selectedSemester} yet</p>
            <p className="mt-1 text-xs text-[#7B8881]">Click &ldquo;New Chapter&rdquo; above to add a learning chapter.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <ChapterModal existingChapters={chapters} onClose={() => setIsModalOpen(false)} onSave={handleCreate} />
      )}
    </div>
  );
}
