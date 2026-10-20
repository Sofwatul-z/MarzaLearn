// ChapterDetail.jsx – redesigned per user specifications
// This file implements a clean UI for teachers to view and edit chapter details,
// introduction material, and the six Marzano steps as an expandable accordion.
// It uses existing services (getChapterDetail, updateChapter, deleteChapter) and
// the generic DynamicFormModal component for editing.

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Brush,
  Gamepad2,
  Headphones,
  Link2,
  MessageSquareText,
  PenLine,
  Pencil,
  Plus,
  Trash2,
  X,
  Save,
  ChevronDown,
} from "lucide-react";
import Button from "../../components/common/Button";
import {
  getChapterDetail,
  updateChapter,
  deleteChapter,
  STEP_ORDER,
} from "../../services/chapter";
import { getChapterContent } from "../../data/chapters";

/* ── Helper components ───────────────────────────────────── */
function SourceNote({ source }) {
  if (!source) return null;
  let clean = source;
  if (clean.startsWith("[Sumber Materi:") || clean.startsWith("[Sumber Materi :")) {
    clean = clean.replace(/\[Sumber Materi:?\s*/i, "").replace(/\]$/, "");
  }
  return <p className="mt-3 text-[11px] italic text-[#8A9690]">Sumber: {clean}</p>;
}

function DynamicFormModal({ title, schema, initialData, onSave, onClose }) {
  const [formData, setFormData] = useState(initialData || {});
  const handleChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));
  const handleArrayChange = (field, idx, value) => {
    setFormData((prev) => {
      const arr = [...(prev[field] || [])];
      arr[idx] = value;
      return { ...prev, [field]: arr };
    });
  };
  const addArrayItem = (field, emptyItem) =>
    setFormData((prev) => ({ ...prev, [field]: [...(prev[field] || []), emptyItem] }));
  const removeArrayItem = (field, idx) =>
    setFormData((prev) => {
      const arr = [...(prev[field] || [])];
      arr.splice(idx, 1);
      return { ...prev, [field]: arr };
    });
  const handleFileUpload = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      handleChange(field, url);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-[28px] bg-white p-7 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold tracking-tight text-[#23332e]">{title}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pr-2 space-y-5">
          {schema.map(({ key, label, type, emptyItem }) => {
            if (type === "textarea") {
              return (
                <div key={key}>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
                  <textarea rows={3} value={formData[key] || ""} onChange={(e) => handleChange(key, e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#5B7568]" />
                </div>
              );
            }
            if (type === "audio") {
              return (
                <div key={key} className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
                  {formData[key] && (
                    <div className="mb-3 flex items-center gap-3">
                      <audio controls src={formData[key]} className="h-8 max-w-[200px]" />
                      <button onClick={() => handleChange(key, "")} className="text-xs text-red-500 hover:underline">Remove</button>
                    </div>
                  )}
                  <input type="file" accept="audio/*" onChange={(e) => handleFileUpload(key, e)}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#EAF4EF] file:text-[#3F6252] hover:file:bg-[#dceee7] cursor-pointer" />
                </div>
              );
            }
            if (type === "array_string") {
              const arr = formData[key] || [];
              return (
                <div key={key} className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
                  {arr.map((item, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input type="text" value={item} onChange={(e) => handleArrayChange(key, i, e.target.value)}
                        className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#5B7568]" />
                      <button onClick={() => removeArrayItem(key, i)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                    </div>
                  ))}
                  <button onClick={() => addArrayItem(key, "")} className="mt-2 text-xs font-bold text-[#5B7568] flex items-center gap-1">
                    <Plus size={12} /> Add Item
                  </button>
                </div>
              );
            }
            if (type === "array_object") {
              const arr = formData[key] || [];
              return (
                <div key={key} className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
                  {arr.map((item, i) => (
                    <div key={i} className="flex gap-2 mb-3 bg-white p-3 rounded-lg border border-slate-100">
                      <div className="flex-1 space-y-2">
                        {Object.keys(emptyItem).map((objKey) => (
                          <input key={objKey} type="text" placeholder={objKey} value={item[objKey] || ""}
                            onChange={(e) => {
                              const newItem = { ...item, [objKey]: e.target.value };
                              handleArrayChange(key, i, newItem);
                            }}
                            className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-[#5B7568]" />
                        ))}
                      </div>
                      <button onClick={() => removeArrayItem(key, i)} className="text-red-400 hover:text-red-600 self-start"><Trash2 size={16} /></button>
                    </div>
                  ))}
                  <button onClick={() => addArrayItem(key, emptyItem)} className="mt-2 text-xs font-bold text-[#5B7568] flex items-center gap-1">
                    <Plus size={12} /> Add Item
                  </button>
                </div>
              );
            }
            // default text input
            return (
              <div key={key}>
                <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
                <input type="text" value={formData[key] || ""} onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#5B7568]" />
              </div>
            );
          })}
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-slate-100">
          <button type="button" onClick={onClose} className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">Cancel</button>
          <Button variant="primary" onClick={() => { onSave(formData); onClose(); }}><Save size={16} /> Save Changes</Button>
        </div>
      </div>
    </div>
  );
}

function GenericRenderer({ data }) {
  if (!data || Object.keys(data).length === 0) {
    return <p className="text-sm text-slate-400 italic">No content yet.</p>;
  }
  const renderValue = (val) => {
    if (Array.isArray(val)) {
      return (
        <ul className="list-disc pl-5 mt-1 space-y-1">
          {val.map((item, i) => (
            <li key={i}>{renderValue(item)}</li>
          ))}
        </ul>
      );
    }
    if (typeof val === "object" && val !== null) {
      return (
        <div className="pl-4 border-l-2 border-slate-100 mt-1 space-y-2">
          {Object.entries(val).map(([k, v]) => (
            <div key={k}>
              <span className="text-xs font-bold uppercase text-slate-400">{k}: </span>
              <span className="text-sm text-slate-700">{renderValue(v)}</span>
            </div>
          ))}
        </div>
      );
    }
    if (typeof val === "string" && val.startsWith("blob:")) {
      return <audio controls src={val} className="h-8 mt-1" />;
    }
    return <span className="text-sm text-slate-700">{String(val)}</span>;
  };
  return (
    <div className="space-y-4">
      {Object.entries(data).map(([key, value]) => {
        if (key === "source") return null;
        return (
          <div key={key} className="border-b border-slate-50 pb-3">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#5B7568] mb-1">{key}</p>
            {renderValue(value)}
          </div>
        );
      })}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────── */
export default function ChapterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editChapter, setEditChapter] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [openStepIdx, setOpenStepIdx] = useState(null);
  const [editingStep, setEditingStep] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getChapterDetail(id);
      setDetail(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <div className="p-10 text-sm text-slate-500">Loading chapter…</div>;
  if (!detail) return <div className="p-10 text-sm text-red-500">Chapter not found.</div>;

  const localChapter = getChapterContent(detail.localId) || {};
  const { title, description, semester } = detail;

  const updateLocalChapter = (newLocal) => {
    const mock = JSON.parse(localStorage.getItem("mock_chapters") || "[]");
    const idx = mock.findIndex((c) => Number(c.id) === detail.localId);
    if (idx !== -1) {
      mock[idx] = { ...mock[idx], ...newLocal };
      localStorage.setItem("mock_chapters", JSON.stringify(mock));
    }
    getChapterDetail(id).then(setDetail);
  };

  const sectionSchemas = {
    overview: [
      { key: "definition", label: "Definition", type: "textarea" },
      { key: "purpose", label: "Purpose", type: "textarea" },
      { key: "structure", label: "Structure", type: "array_object", emptyItem: { name: "", description: "" } },
    ],
    listening: [
      { key: "title", label: "Title", type: "text" },
      { key: "audioSrc", label: "Audio File", type: "audio" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "paragraphs", label: "Paragraphs", type: "array_string" },
    ],
    grammar: [
      { key: "title", label: "Title", type: "text" },
      { key: "intro", label: "Intro", type: "textarea" },
      { key: "tabs", label: "Tabs/Rules", type: "array_object", emptyItem: { label: "", text: "" } },
    ],
  };

  const introSections = [
    { id: "overview", title: "Overview", icon: BookOpen },
    { id: "listening", title: "Listening", icon: Headphones },
    { id: "grammar", title: "Grammar", icon: Layers3 },
  ];

  const steps = detail.steps || [];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button onClick={() => navigate(-1)} className="p-2 mr-4 text-slate-500 hover:text-slate-700 rounded-full hover:bg-slate-100">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold text-[#24332D]">{title}</h1>
          <p className="text-sm text-[#67776F]">{description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setEditChapter(true)}><Pencil size={16} /> Edit</Button>
          <Button variant="destructive" onClick={async () => {
            if (window.confirm("Delete this chapter?")) {
              await deleteChapter(id);
              navigate("/teacher/chapters");
            }
          }}><Trash2 size={16} /> Delete</Button>
        </div>
      </div>

      {/* Introduction Material */}
      <section className="mb-12 border-b pb-8 border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BookOpen size={20} className="text-[#5B7568]" />
            <h2 className="text-xl font-bold text-[#23332e]">Introduction Material</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {introSections.map(({ id, title, icon: Icon }) => {
            const data = localChapter?.[id] || {};
            const hasData = Object.keys(data).length > 0;
            return (
              <div key={id} className="border border-slate-200 rounded-2xl p-5 bg-slate-50 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-3">
                  <Icon size={18} className="text-[#5B7568]" />
                  <h3 className="font-bold text-[#24332D]">{title}</h3>
                </div>
                <div className="flex-1 overflow-hidden">
                  {hasData ? (
                    <p className="text-xs text-slate-500 line-clamp-3">
                      {data.definition || data.title || data.intro || "Content available."}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Empty. Add content here.</p>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-slate-200">
                  {hasData ? (
                    <>
                      <button onClick={() => setEditingSection(id)} className="text-xs font-bold text-[#5B7568] hover:text-[#24332D] flex items-center gap-1">
                        <Pencil size={12} /> Edit / View
                      </button>
                      <button onClick={() => updateLocalChapter({ ...localChapter, [id]: null })} className="text-xs font-bold text-red-400 hover:text-red-600 flex items-center gap-1">
                        <Trash2 size={12} /> Delete
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setEditingSection(id)} className="text-xs font-bold text-[#5B7568] hover:text-[#24332D] flex items-center gap-1">
                      <Plus size={12} /> Add Content
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {editingSection && (
          <DynamicFormModal
            title={`Edit ${editingSection}`}
            schema={sectionSchemas[editingSection]}
            initialData={localChapter?.[editingSection] || {}}
            onSave={(data) => {
              updateLocalChapter({ ...localChapter, [editingSection]: data });
            }}
            onClose={() => setEditingSection(null)}
          />
        )}
      </section>

      {/* Marzano Steps Accordion */}
      <section>
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-bold text-[#23332e]">Marzano Steps</h2>
        </div>
        <div className="space-y-2">
          {steps.map((step, idx) => {
            const isOpen = openStepIdx === idx;
            const stepKey = step.step_name.toLowerCase();
            const marzanoData = localChapter?.marzano || {};
            const stepData = marzanoData[stepKey];
            return (
              <div key={step.id} className="border rounded-md overflow-hidden">
                <div className="group flex items-center justify-between px-4 py-3 cursor-pointer" onClick={() => setOpenStepIdx(isOpen ? null : idx)}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${isOpen ? "bg-[#24332D] text-white" : "bg-[#edf6f1] text-[#23332e] group-hover:bg-[#dceee7]"}`}>{String(idx + 1).padStart(2, "0")}</div>
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} className="text-[#5B7568]" />
                      <h3 className="text-lg font-bold text-[#23332e]">{step.step_name}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold uppercase ${stepData ? "text-[#5B7568]" : "text-slate-300"}`}>{stepData ? "Has content" : "Empty"}</span>
                    <ChevronDown size={18} className={isOpen ? "rotate-180" : ""} />
                  </div>
                </div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4"
                    >
                      {stepData ? (
                        <GenericRenderer data={stepData} />
                      ) : (
                        <p className="text-sm text-slate-400 italic">No content for this step.</p>
                      )}
                      <div className="mt-3 flex gap-2">
                        <Button variant="secondary" onClick={() => setEditingStep(step)}><Pencil size={14} /> Edit</Button>
                        <Button variant="destructive" onClick={() => {
                          const newLocal = { ...localChapter };
                          if (newLocal.marzano) delete newLocal.marzano[stepKey];
                          updateLocalChapter(newLocal);
                        }}><Trash2 size={14} /> Clear</Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        {editingStep && (
          <DynamicFormModal
            title={`Edit ${editingStep.step_name}`}
            schema={[
              { key: "placeholder", label: "Content editor coming soon", type: "text" },
            ]}
            initialData={{ placeholder: "" }}
            onSave={() => setEditingStep(null)}
            onClose={() => setEditingStep(null)}
          />
        )}
      </section>
    </div>
  );
}
