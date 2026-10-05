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

  if (loading) {
    return <div className="p-10 text-sm text-slate-500">Loading chapters...</div>;
  }

  const semester1 = chapters.filter((c) => c.semester === 1).sort((a, b) => (a.chapter_number ?? a.id) - (b.chapter_number ?? b.id));
  const semester2 = chapters.filter((c) => c.semester === 2).sort((a, b) => (a.chapter_number ?? a.id) - (b.chapter_number ?? b.id));

  return (
    <section className="min-h-screen bg-[#FBFCF8] py-10">
      <div className="max-w-5xl mx-auto px-8">
        
        <button
          type="button"
          onClick={() => window.history.back()}
          className="mb-8 inline-flex items-center gap-2 text-xs font-extrabold text-[#6B7972] transition-colors hover:text-[#24332D]"
        >
          &larr; Back to Dashboard
        </button>

        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-slate-400">Teacher Workspace</p>
            <h1 className="mt-3 text-5xl md:text-[64px] leading-[0.95] tracking-[-0.05em] font-bold text-[#23332e]">
              Chapter Library
            </h1>
            <p className="mt-5 max-w-lg text-sm md:text-base text-slate-500">
              Organize learning chapters and manage classroom materials.
            </p>
          </div>

          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> New Chapter
          </Button>
        </div>

        {error && (
          <div className="mb-8 rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</div>
        )}

        <div className="space-y-12">
          {semester1.length > 0 && (
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-4 ml-3">Semester 1</h2>
              <div className="flex flex-col gap-2">
                {semester1.map((chapter, index) => (
                  <ChapterCard key={chapter.databaseId ?? chapter.id} chapter={chapter} index={index} />
                ))}
              </div>
            </div>
          )}

          {semester2.length > 0 && (
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-4 ml-3">Semester 2</h2>
              <div className="flex flex-col gap-2">
                {semester2.map((chapter, index) => (
                  <ChapterCard key={chapter.databaseId ?? chapter.id} chapter={chapter} index={index} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <ChapterModal existingChapters={chapters} onClose={() => setIsModalOpen(false)} onSave={handleCreate} />
      )}
    </section>
  );
}
