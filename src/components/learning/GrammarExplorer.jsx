import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, MessageSquareQuote } from "lucide-react";
import SourceNote from "../common/SourceNote";

function FormulaRows({ rows = [] }) {
  return (
    <div className="mt-7 border-y border-[#DDE5E0]">
      {rows.map((row, index) => (
        <div
          key={`${row.type}-${index}`}
          className="grid gap-3 border-b border-[#E6ECE8] py-5 last:border-b-0 md:grid-cols-[118px_minmax(0,1fr)_minmax(0,0.9fr)] md:items-center md:gap-5"
        >
          <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#7D8B84]">
            {row.type}
          </span>
          <p className="font-extrabold tracking-[-0.02em] text-[#24332D]">{row.formula}</p>
          <p className="text-sm leading-6 text-[#66756E]">
            <span className="mr-2 text-[#A0AAA5]">→</span>
            {row.example}
          </p>
        </div>
      ))}
    </div>
  );
}

function ExpressionRows({ rows = [] }) {
  return (
    <div className="mt-7 divide-y divide-[#E4EAE6] border-y border-[#DDE5E0]">
      {rows.map(([expression, example]) => (
        <div key={expression} className="grid gap-2 py-5 md:grid-cols-[minmax(0,0.65fr)_minmax(0,1fr)] md:gap-8">
          <p className="font-extrabold tracking-[-0.02em] text-[#24332D]">{expression}</p>
          <p className="text-sm leading-6 text-[#66756E]">{example}</p>
        </div>
      ))}
    </div>
  );
}

export default function GrammarExplorer({ grammar }) {
  const [activeTab, setActiveTab] = useState(grammar.tabs[0]?.id);

  useEffect(() => {
    setActiveTab(grammar.tabs[0]?.id);
  }, [grammar]);

  const active = grammar.tabs.find((tab) => tab.id === activeTab) ?? grammar.tabs[0];

  return (
    <div>
      <div className="max-w-3xl">
        <span className="ml-eyebrow">Grammar corner</span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-[#24332D] sm:text-4xl">
          {grammar.title}
        </h2>
        <p className="mt-4 text-sm leading-7 text-[#65736D] sm:text-base">{grammar.intro}</p>
      </div>

      <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
        {grammar.tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap rounded-full border px-4 py-2.5 text-xs font-extrabold transition-all ${
              activeTab === tab.id
                ? "border-[#24332D] bg-[#24332D] text-white"
                : "border-[#DCE4DF] bg-white/70 text-[#66756E] hover:border-[#B9CBC1] hover:text-[#24332D]"
            }`}
            aria-pressed={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.24 }}
          className="mt-5 overflow-hidden rounded-[30px] border border-[#DDE5E0] bg-white/[0.82] p-6 shadow-[0_16px_45px_rgba(36,51,45,0.055)] sm:p-8"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_220px]">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#6D8278]">Focus</p>
              <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.035em] text-[#24332D]">
                {active.title}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#66756E]">{active.description}</p>
            </div>

            <div className="relative min-h-28 overflow-hidden rounded-[22px] bg-[#EAF4EF] p-5">
              <span className="absolute -right-3 -top-5 text-7xl font-black tracking-[-0.08em] text-[#BFDACC]/35">Aa</span>
              <MessageSquareQuote size={21} className="relative text-[#48685A]" />
              <p className="relative mt-5 text-xs font-bold leading-5 text-[#526A5E]">
                Learn the pattern first, then notice how it changes in the example.
              </p>
            </div>
          </div>

          {active.chips?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {active.chips.map((chip) => (
                <span key={chip} className="rounded-full bg-[#FBEDE4] px-3.5 py-2 text-xs font-extrabold text-[#745C4F]">
                  {chip}
                </span>
              ))}
            </div>
          )}

          {active.notes?.length > 0 && (
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {active.notes.map((note) => (
                <div key={note} className="flex gap-2.5 text-sm leading-6 text-[#5F6E67]">
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#CFE8DD] text-[#315C49]">
                    <Check size={12} strokeWidth={2.6} />
                  </span>
                  <span>{note}</span>
                </div>
              ))}
            </div>
          )}

          {active.formulas?.length > 0 && <FormulaRows rows={active.formulas} />}
          {active.expressionExamples?.length > 0 && <ExpressionRows rows={active.expressionExamples} />}

          {active.callout && (
            <div className="mt-6 flex gap-3 rounded-[20px] border border-[#E8D4C7] bg-[#FBEDE4]/75 p-4 text-sm leading-6 text-[#69594F]">
              <ArrowRight size={17} className="mt-1 shrink-0 text-[#8A6754]" />
              <p>{active.callout}</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <SourceNote source={grammar.source} />
    </div>
  );
}
