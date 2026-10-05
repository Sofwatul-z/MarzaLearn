import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  CheckCircle2,
  Clock3,
  Headphones,
  Layers3,
  Sparkles,
} from "lucide-react";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import AudioPlayer from "../../components/learning/AudioPlayer";
import ChapterArtwork from "../../components/learning/ChapterArtwork";
import GrammarExplorer from "../../components/learning/GrammarExplorer";
import LearnProgress from "../../components/learning/LearnProgress";
import { getChapterContent } from "../../data/chapters";
import { getChapterById } from "../../services/chapter";
import SourceNote from "../../components/common/SourceNote";

const stageOrder = ["introduction", "listen", "grammar"];

function StructureTimeline({ items }) {
  return (
    <div className="mt-8">
      {items.map((item, index) => (
        <div key={item.name} className="grid grid-cols-[46px_minmax(0,1fr)] gap-4 sm:grid-cols-[58px_minmax(0,1fr)]">
          <div className="relative flex justify-center">
            {index < items.length - 1 && (
              <span className="absolute bottom-0 top-10 w-px bg-[#DDE5E0]" aria-hidden="true" />
            )}
            <span className="relative z-10 grid h-9 w-9 place-items-center rounded-full border border-[#BFD5CA] bg-[#EAF4EF] text-xs font-extrabold text-[#3F6252]">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="pb-7">
            <h3 className="font-extrabold tracking-[-0.02em] text-[#24332D]">{item.name}</h3>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[#69776F]">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function IntroductionSection({ chapter }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)] lg:gap-16">
      <div>
        <span className="ml-eyebrow"><BookOpenText size={14} /> Introduction</span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.045em] text-[#24332D] sm:text-4xl">
          What is {chapter.title}?
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[#53635B]">{chapter.overview.definition}</p>

        <div className="mt-9 border-l-2 border-[#B8D7C8] pl-5 sm:pl-7">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#718078]">Purpose</p>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[#64736C] sm:text-base">{chapter.overview.purpose}</p>
        </div>
      </div>

      <div className="rounded-[28px] border border-[#DDE5E0] bg-white/70 p-6 sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#75837C]">Text structure</p>
            <h3 className="mt-2 text-xl font-extrabold tracking-[-0.03em] text-[#24332D]">Build it in order.</h3>
          </div>
          <Layers3 size={22} className="text-[#5B7568]" />
        </div>
        <StructureTimeline items={chapter.overview.structure} />
      </div>
      
      <div className="lg:col-span-2">
        <SourceNote source={chapter.overview.source} className="!mt-0" />
      </div>
    </div>
  );
}

function ListenSection({ chapter }) {
  return (
    <div>
      <div className="max-w-3xl">
        <span className="ml-eyebrow"><Headphones size={14} /> Listen & read</span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-[#24332D] sm:text-4xl">
          Hear the rhythm, then follow the text.
        </h2>
        <p className="mt-4 text-sm leading-7 text-[#65736D] sm:text-base">
          Play the narration and read along. You can pause, replay, seek, or change the playback speed whenever you need.
        </p>
      </div>

      <div className="mt-8 grid gap-7 lg:grid-cols-[minmax(300px,0.74fr)_minmax(0,1.26fr)] lg:items-start">
        <div className="lg:sticky lg:top-[164px]">
          <AudioPlayer src={chapter.listening.audioSrc} title={chapter.listening.title} />
          <div className="mt-4 flex items-center gap-2 px-1 text-xs font-semibold text-[#78857F]">
            <Sparkles size={14} className="text-[#6D8D7D]" />
            Listen once for meaning, then replay while reading.
          </div>
        </div>

        <article className="overflow-hidden rounded-[30px] border border-[#DDE5E0] bg-white/[0.84] shadow-[0_16px_45px_rgba(36,51,45,0.05)]">
          <header className="border-b border-[#E5EBE7] bg-[#F7FAF8] px-6 py-5 sm:px-8">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#738079]">Reading text</p>
            <h3 className="mt-2 text-xl font-extrabold tracking-[-0.03em] text-[#24332D] sm:text-2xl">
              {chapter.listening.title}
            </h3>
          </header>
          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <div className="ml-reading-width space-y-5">
              {chapter.listening.paragraphs.map((paragraph, index) => (
                <div key={index} className="grid grid-cols-[28px_minmax(0,1fr)] gap-3">
                  <span className="pt-1 text-[10px] font-extrabold tabular-nums text-[#A0AAA5]">{String(index + 1).padStart(2, "0")}</span>
                  <p className="text-[15px] leading-8 text-[#4F5F57] sm:text-base">{paragraph}</p>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>

      <SourceNote source={chapter.listening.source} />
    </div>
  );
}

function MissionHandoff({ chapter, onStart }) {
  return (
    <div className="overflow-hidden rounded-[34px] bg-[#24332D] text-white shadow-[0_28px_75px_rgba(36,51,45,0.15)]">
      <div className="grid gap-8 p-7 sm:p-9 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:p-10">
        <div>
          <span className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#B9D8CA]">
            <CheckCircle2 size={14} /> Learn section complete
          </span>
          <h3 className="mt-3 max-w-2xl text-2xl font-extrabold tracking-[-0.04em] text-white sm:text-3xl">
            Ready for the 6-Step Learning Mission?
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">
            Provide → Restate → Visualize → Engage → Discuss → Games. Once you start the mission, plan to finish all six steps in the same learning session.
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-xs font-bold text-white/60">
            <span className="inline-flex items-center gap-2"><Clock3 size={14} /> {chapter.duration}</span>
            <span>6 connected activities</span>
            <span>Autosave-ready flow</span>
          </div>
        </div>
        <Button variant="pastel" size="lg" onClick={onStart} className="w-full lg:w-auto">
          Start 6-Step Mission <ArrowRight size={17} />
        </Button>
      </div>
    </div>
  );
}

export default function Chapter() {
  const { id } = useParams();
  const navigate = useNavigate();
  const bundled = useMemo(() => getChapterContent(id), [id]);
  const [chapterMeta, setChapterMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState("introduction");
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await getChapterById(id);
        if (mounted) setChapterMeta(data);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  const chapter = bundled ? { ...chapterMeta, ...bundled } : null;

  if (loading) return <Loader label="Opening your chapter..." />;

  if (!chapter) {
    return (
      <div className="py-20 text-center">
        <p className="ml-eyebrow">Chapter not found</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-[#24332D]">This chapter is not available.</h1>
        <Button variant="secondary" className="mt-7" onClick={() => navigate("/student/chapters")}>
          <ArrowLeft size={16} /> Back to chapters
        </Button>
      </div>
    );
  }

  function goToStage(nextStage) {
    const currentIndex = stageOrder.indexOf(activeStage);
    const nextIndex = stageOrder.indexOf(nextStage);
    if (nextIndex > currentIndex) {
      setCompleted((items) =>
        Array.from(new Set([...items, ...stageOrder.slice(0, nextIndex)]))
      );
    }
    setActiveStage(nextStage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function next() {
    const index = stageOrder.indexOf(activeStage);
    if (index < stageOrder.length - 1) goToStage(stageOrder[index + 1]);
  }

  function previous() {
    const index = stageOrder.indexOf(activeStage);
    if (index > 0) goToStage(stageOrder[index - 1]);
  }

  const isGrammar = activeStage === "grammar";

  return (
    <div>
      <section className="relative overflow-hidden border-b border-[#E3E9E5] pb-8 pt-2 sm:pb-10 sm:pt-5">
        <button
          type="button"
          onClick={() => navigate("/student/chapters")}
          className="mb-7 inline-flex items-center gap-2 text-xs font-extrabold text-[#6B7972] transition-colors hover:text-[#24332D]"
        >
          <ArrowLeft size={15} /> All chapters
        </button>

        <div className="grid items-center gap-5 lg:grid-cols-[minmax(0,1.04fr)_minmax(360px,0.8fr)] lg:gap-10">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="ml-eyebrow">Semester {chapter.semester} · Chapter {String(chapter.id).padStart(2, "0")}</span>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-[-0.055em] text-[#24332D] sm:text-5xl lg:text-6xl">
              {chapter.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#5D6D65] sm:text-lg">{chapter.heroLine}</p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-[#738079]">
              <span>{chapter.focus}</span>
              <span>•</span>
              <span>{chapter.duration}</span>
              <span>•</span>
              <span>Listening included</span>
            </div>
          </motion.div>
          <ChapterArtwork chapterId={chapter.id} title={chapter.title} />
        </div>
      </section>

      <LearnProgress active={activeStage} completed={completed} onSelect={goToStage} />

      <section className="min-h-[540px] pb-8 pt-2 sm:pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
          >
            {activeStage === "introduction" && <IntroductionSection chapter={chapter} />}
            {activeStage === "listen" && <ListenSection chapter={chapter} />}
            {activeStage === "grammar" && <GrammarExplorer grammar={chapter.grammar} />}
          </motion.div>
        </AnimatePresence>
      </section>

      <div className="mb-9 flex items-center justify-between border-t border-[#E2E8E4] pt-6">
        <Button variant="ghost" onClick={previous} disabled={activeStage === stageOrder[0]}>
          <ArrowLeft size={16} /> Previous
        </Button>
        {!isGrammar && (
          <Button variant="primary" onClick={next}>
            Next: {activeStage === "introduction" ? "Listen & Read" : "Grammar Corner"} <ArrowRight size={16} />
          </Button>
        )}
      </div>

      {isGrammar && (
        <MissionHandoff
          chapter={chapter}
          onStart={() => navigate(`/student/chapter/${chapter.id}/session`)}
        />
      )}
    </div>
  );
}
