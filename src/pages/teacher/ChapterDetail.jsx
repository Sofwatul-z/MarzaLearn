import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Brush,
  ChevronDown,
  Gamepad2,
  Headphones,
  Layers3,
  Link2,
  MessageSquareText,
  Pencil,
  PenLine,
  Plus,
  Trash2,
  X,
  Save,
} from "lucide-react";
import Button from "../../components/common/Button";
import { getChapterDetail, updateChapter, deleteChapter, STEP_ORDER } from "../../services/chapter";
import { getChapterContent } from "../../data/chapters";

const STEP_ICONS = {
  Engage: BookOpen,
  Explore: Brush,
  Explain: MessageSquareText,
  Elaborate: PenLine,
  Evaluate: Gamepad2,
  Extend: Link2,
  // fallbacks for old names
  Provide: BookOpen,
  Restate: PenLine,
  Visualize: Brush,
  Discuss: MessageSquareText,
  Games: Gamepad2,
};

/* ── tiny reusable SourceNote ───────────────────────────── */
function SourceNote({ source }) {
  if (!source) return null;
  let clean = source;
  if (clean.startsWith("[Sumber Materi:") || clean.startsWith("[Sumber Materi :")) {
    clean = clean.replace(/\[Sumber Materi:?\s*/i, "").replace(/\]$/, "");
  }
  return <p className="mt-3 text-[11px] italic text-[#8A9690]">Sumber: {clean}</p>;
}

/* ── Dynamic Form Modal for Non-IT Users ────────────────── */
function DynamicFormModal({ title, schema, initialData, onSave, onClose }) {
  const [formData, setFormData] = useState(initialData || {});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => {
      const arr = [...(prev[field] || [])];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (field, emptyItem) => {
    setFormData(prev => ({ ...prev, [field]: [...(prev[field] || []), emptyItem] }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => {
      const arr = [...(prev[field] || [])];
      arr.splice(index, 1);
      return { ...prev, [field]: arr };
    });
  };

  const handleFileUpload = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a local blob URL for immediate playback/usage
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
            if (type === 'textarea') {
              return (
                <div key={key}>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
                  <textarea rows={3} value={formData[key] || ""} onChange={(e) => handleChange(key, e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#5B7568]" />
                </div>
              );
            }
            if (type === 'audio') {
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
            if (type === 'array_string') {
              const arr = formData[key] || [];
              return (
                <div key={key} className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
                  {arr.map((item, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input type="text" value={item} onChange={(e) => handleArrayChange(key, i, e.target.value)}
                        className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#5B7568]" />
                      <button onClick={() => removeArrayItem(key, i)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                    </div>
                  ))}
                  <button onClick={() => addArrayItem(key, "")} className="mt-2 text-xs font-bold text-[#5B7568] flex items-center gap-1">
                    <Plus size={12} /> Add Item
                  </button>
                </div>
              );
            }
            if (type === 'array_object') {
               const arr = formData[key] || [];
               return (
                 <div key={key} className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                   <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
                   {arr.map((item, i) => (
                     <div key={i} className="flex gap-2 mb-3 bg-white p-3 rounded-lg border border-slate-100">
                       <div className="flex-1 space-y-2">
                         {Object.keys(emptyItem).map(objKey => (
                           <input key={objKey} type="text" placeholder={objKey} value={item[objKey] || ""}
                             onChange={(e) => {
                               const newItem = { ...item, [objKey]: e.target.value };
                               handleArrayChange(key, i, newItem);
                             }}
                             className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-[#5B7568]" />
                         ))}
                       </div>
                       <button onClick={() => removeArrayItem(key, i)} className="text-red-400 hover:text-red-600 self-start"><Trash2 size={16}/></button>
                     </div>
                   ))}
                   <button onClick={() => addArrayItem(key, emptyItem)} className="mt-2 text-xs font-bold text-[#5B7568] flex items-center gap-1">
                     <Plus size={12} /> Add Item
                   </button>
                 </div>
               );
            }
            // default text
            return (
              <div key={key}>
                <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
                <input type="text" value={formData[key] || ""} onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#5B7568]" />
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button type="button" onClick={onClose} className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
            Cancel
          </button>
          <Button variant="primary" onClick={() => { onSave(formData); onClose(); }}>
            <Save size={16} /> Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ── Generic Step content ──────────────────────────────── */
function GenericContentRenderer({ data }) {
  if (!data || Object.keys(data).length === 0) {
    return <p className="text-sm text-slate-400 italic">No content yet.</p>;
  }

  const renderValue = (val) => {
    if (Array.isArray(val)) {
      return (
        <ul className="list-disc pl-5 mt-1 space-y-1">
          {val.map((item, i) => <li key={i}>{renderValue(item)}</li>)}
        </ul>
      );
    }
    if (typeof val === 'object' && val !== null) {
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
    if (typeof val === 'string' && val.startsWith('blob:')) {
      return <audio controls src={val} className="h-8 mt-1" />;
    }
    return <span className="text-sm text-slate-700">{String(val)}</span>;
  };

  return (
    <div className="space-y-4">
      {Object.entries(data).map(([key, value]) => {
        if (key === 'source') return null;
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

/* ── Introduction material section ─────────────────────── */
function IntroductionSection({ localChapter, onUpdateLocal }) {
  const [editingSection, setEditingSection] = useState(null);

  const handleSave = (section, newData) => {
    onUpdateLocal({
      ...localChapter,
      [section]: newData
    });
  };

  const sections = [
    { id: 'overview', title: 'Overview', icon: BookOpen },
    { id: 'listening', title: 'Listening', icon: Headphones },
    { id: 'grammar', title: 'Grammar', icon: Layers3 },
  ];

  return (
    <div className="mb-12 border-b border-slate-100 pb-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen size={18} className="text-[#5B7568]" />
          <h2 className="text-2xl font-bold tracking-tight text-[#23332e]">Introduction Material</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sections.map(({ id, title, icon: Icon }) => {
          const data = localChapter?.[id];
          const hasData = data && Object.keys(data).length > 0;

          return (
            <div key={id} className="border border-slate-200 rounded-2xl p-5 bg-slate-50 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-3">
                <Icon size={16} className="text-[#5B7568]" />
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
                    <button onClick={() => handleSave(id, null)} className="text-xs font-bold text-red-400 hover:text-red-600 flex items-center gap-1">
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
          schema={
            editingSection === 'overview'
              ? [
                  { key: 'definition', label: 'Definition', type: 'textarea' },
                  { key: 'purpose', label: 'Purpose', type: 'textarea' },
                  { key: 'structure', label: 'Structure', type: 'array_object', emptyItem: { name: "", description: "" } }
                ]
              : editingSection === 'listening'
              ? [
                  { key: 'title', label: 'Title', type: 'text' },
                  { key: 'audioSrc', label: 'Audio File', type: 'audio' },
                  { key: 'description', label: 'Description', type: 'textarea' },
                  { key: 'paragraphs', label: 'Paragraphs', type: 'array_string' }
                ]
              : [
                  { key: 'title', label: 'Title', type: 'text' },
                  { key: 'intro', label: 'Intro', type: 'textarea' },
                  { key: 'tabs', label: 'Tabs/Rules', type: 'array_object', emptyItem: { label: "", text: "" } }
                ]
          }
          initialData={localChapter?.[editingSection] || {}}
          onSave={(data) => handleSave(editingSection, data)}
          onClose={() => setEditingSection(null)}
        />
      )}
    </div>
  );
}

/* ── Expandable step row ───────────────────────────────── */
function StepRow({ step, index, localData, isOpen, onToggle, onUpdateLocal }) {
  const Icon = STEP_ICONS[step.step_name] ?? BookOpen;
  const stepKey = step.step_name.toLowerCase();
  const marzanoData = localData?.marzano || {};
  const data = marzanoData[stepKey];
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (newData) => {
    onUpdateLocal({
      ...localData,
      marzano: {
        ...marzanoData,
        [stepKey]: newData
      }
    });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if(window.confirm(`Clear all content for ${step.step_name}?`)) {
      handleSave(null);
    }
  }

  return (
    <div className="border-b border-slate-100">
      <div className="group flex w-full items-center gap-5 py-6 transition-all duration-200 hover:px-2">
        <button type="button" onClick={onToggle} className="flex-1 flex items-center gap-5 text-left">
          <div className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${isOpen ? "bg-[#24332D] text-white" : "bg-[#edf6f1] text-[#23332e] group-hover:bg-[#dceee7]"}`}>
            {String(index + 1).padStart(2, "0")}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Icon size={15} className="text-[#5B7568]" />
              <h3 className="text-lg font-bold tracking-tight text-[#23332e]">{step.step_name}</h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {data ? (
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#5B7568]">Has content</span>
            ) : (
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Empty</span>
            )}
            <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </div>
        </button>
        
        {/* Quick action buttons on row */}
        <div className="flex gap-2">
          {data ? (
             <>
               <button onClick={() => setIsEditing(true)} className="p-2 text-[#5B7568] hover:bg-[#EAF4EF] rounded-full transition"><Pencil size={14}/></button>
               <button onClick={handleDelete} className="p-2 text-red-400 hover:bg-red-50 rounded-full transition"><Trash2 size={14}/></button>
             </>
          ) : (
             <button onClick={() => setIsEditing(true)} className="p-2 text-[#5B7568] hover:bg-[#EAF4EF] rounded-full transition"><Plus size={14}/></button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-6 pt-1 ml-16">
              {data ? (
                <>
                  <GenericContentRenderer data={data} />
                  <SourceNote source={data.source} />
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 px-6 py-8 text-center bg-slate-50">
                  <p className="text-sm text-slate-400 font-bold mb-2">No content for {step.step_name}</p>
                  <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                    <Plus size={14} /> Add Content
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isEditing && (
        <DynamicFormModal
          title={`Edit ${step.step_name} Content`}
          schema={
            stepKey === 'provide' ? [
              { key: 'title', label: 'Title', type: 'text' },
              { key: 'subtitle', label: 'Subtitle', type: 'text' },
              { key: 'vocabulary', label: 'Vocabulary', type: 'array_object', emptyItem: { term: "", definition: "", partOfSpeech: "" } }
            ] :
            stepKey === 'restate' ? [
              { key: 'title', label: 'Title', type: 'text' },
              { key: 'instructions', label: 'Instructions', type: 'textarea' },
              { key: 'prompts', label: 'Prompts', type: 'array_string' }
            ] :
            stepKey === 'visualize' ? [
              { key: 'title', label: 'Title', type: 'text' },
              { key: 'instructions', label: 'Instructions', type: 'textarea' },
              { key: 'prompts', label: 'Prompts', type: 'array_string' }
            ] :
            stepKey === 'engage' ? [
              { key: 'title', label: 'Title', type: 'text' },
              { key: 'instructions', label: 'Instructions', type: 'textarea' },
              { key: 'pairs', label: 'Matching Pairs', type: 'array_object', emptyItem: { left: "", right: "" } }
            ] :
            stepKey === 'discuss' ? [
              { key: 'title', label: 'Title', type: 'text' },
              { key: 'prompt', label: 'Discussion Prompt', type: 'textarea' },
              { key: 'example', label: 'Example Response', type: 'textarea' }
            ] :
            stepKey === 'games' ? [
              { key: 'title', label: 'Title', type: 'text' },
              { key: 'questions', label: 'Questions', type: 'array_object', emptyItem: { question: "", answer: "" } }
            ] :
            []
          }
          initialData={data || {}}
          onSave={handleSave}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}

/* ── Main page ─────────────────────────────────────────── */
export default function ChapterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openStep, setOpenStep] = useState(null);
  
  const [editModal, setEditModal] = useState(null); // "chapter" | null
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editSemester, setEditSemester] = useState(1);
  const [saving, setSaving] = useState(false);

  // We maintain a local copy of chapter contents that merges getChapterContent and localStorage overrides
  const [localData, setLocalData] = useState({});

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await getChapterDetail(id);
        if (active) {
          setChapter(data);
          // merge file data with localStorage overrides
          const fileData = getChapterContent(data.localId ?? Number(id)) || {};
          const storedData = localStorage.getItem(`chapter_content_${id}`);
          if (storedData) {
            setLocalData({ ...fileData, ...JSON.parse(storedData) });
          } else {
            setLocalData(fileData);
          }
        }
      } catch (loadError) {
        console.error("Failed to load chapter detail:", loadError);
        if (active) setError("Unable to load chapter detail.");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [id]);

  const handleUpdateLocalData = (newData) => {
    setLocalData(newData);
    localStorage.setItem(`chapter_content_${id}`, JSON.stringify(newData));
  };

  function openEditChapter() {
    setEditTitle(chapter.title);
    setEditDesc(chapter.description ?? "");
    setEditSemester(chapter.semester);
    setEditModal("chapter");
  }

  async function handleSaveChapter(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateChapter(chapter.databaseId ?? chapter.id, {
        title: editTitle,
        description: editDesc,
        semester: editSemester,
        order_number: chapter.chapter_number,
      });
      setChapter((prev) => ({ ...prev, title: editTitle, description: editDesc, semester: editSemester }));
      setEditModal(null);
    } catch (err) {
      alert("Failed to save chapter.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteChapter() {
    if (window.confirm("Are you sure you want to delete this chapter? This cannot be undone.")) {
      try {
        await deleteChapter(chapter.databaseId ?? chapter.id);
        navigate("/teacher/chapters");
      } catch (err) {
        alert("Failed to delete chapter.");
      }
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-[#FBFCF8] p-10 text-sm text-slate-500">Loading chapter...</div>;
  }

  if (!chapter) {
    return (
      <div className="min-h-screen bg-[#FBFCF8] p-10">
        <p className="text-red-500">{error || "Chapter not found."}</p>
        <button
            type="button"
            onClick={() => navigate("/teacher/chapters")}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition-colors hover:text-[#24332D]"
          >
            &larr; Back to Chapter List
        </button>
      </div>
    );
  }

  const steps = chapter.steps?.length
    ? chapter.steps
    : STEP_ORDER.map((name, i) => ({ id: `${id}-${i + 1}`, step_number: i + 1, step_name: name, description: "" }));

  return (
    <section className="min-h-screen bg-[#FBFCF8] py-10">
      <div className="max-w-5xl mx-auto px-8">
        
        <div className="flex flex-col gap-2 mb-10">
          <button
            type="button"
            onClick={() => navigate("/teacher/dashboard")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#8A9690] transition-colors hover:text-[#24332D]"
          >
            &larr; Back to Dashboard
          </button>
          <button
            type="button"
            onClick={() => navigate("/teacher/chapters")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#8A9690] transition-colors hover:text-[#24332D]"
          >
            &larr; Back to Chapter List
          </button>
        </div>

        {/* ── Chapter header ────────────────────────────── */}
        <div className="mb-12">
          <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#8A9690]">
            Semester {chapter.semester} · Chapter
          </p>
          <h1 className="mt-3 text-5xl md:text-[56px] leading-[0.95] tracking-[-0.05em] font-bold text-[#23332e]">
            {chapter.title}
          </h1>
          <p className="mt-5 max-w-2xl text-sm md:text-base leading-relaxed text-[#6C7973]">
            {chapter.description}
          </p>

          <div className="mt-6 flex gap-3">
            <Button variant="secondary" size="sm" onClick={openEditChapter}>
              <Pencil size={14} /> Edit Chapter Meta
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteChapter}>
              <Trash2 size={14} /> Delete
            </Button>
          </div>
        </div>

        {/* ── Introduction Material ─────────────────────── */}
        <IntroductionSection localChapter={localData} onUpdateLocal={handleUpdateLocalData} />

        {/* ── Learning Steps ───────────────────────────── */}
        <div>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#8A9690]">Learning Steps</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#23332e]">Marzano 6-Step Journey</h2>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-widest text-[#8A9690]">Total Steps</p>
              <p className="mt-1 text-3xl font-bold text-[#23332e]">{steps.length}</p>
            </div>
          </div>

          <div className="border-t border-slate-100">
            {steps.map((step, index) => (
              <StepRow
                key={step.id}
                step={step}
                index={index}
                localData={localData}
                isOpen={openStep === index}
                onToggle={() => setOpenStep(openStep === index ? null : index)}
                onUpdateLocal={handleUpdateLocalData}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Edit chapter meta modal ─────────────────────────── */}
      {editModal === "chapter" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-7 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-[#23332e]">Edit Chapter Meta</h2>
              <button onClick={() => setEditModal(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveChapter} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
                <input required type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#5B7568] focus:ring-1 focus:ring-[#5B7568]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                <textarea rows={3} value={editDesc} onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#5B7568] focus:ring-1 focus:ring-[#5B7568]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Semester</label>
                <select value={editSemester} onChange={(e) => setEditSemester(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#5B7568]">
                  <option value={1}>Semester 1</option>
                  <option value={2}>Semester 2</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setEditModal(null)}
                  className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">Cancel</button>
                <Button variant="primary" type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}