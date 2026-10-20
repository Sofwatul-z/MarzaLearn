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

export default function GrammarExplorer({ grammar, theme }) {
  const [activeTab, setActiveTab] = useState(grammar.tabs[0]?.id);

  useEffect(() => {
    setActiveTab(grammar.tabs[0]?.id);
  }, [grammar]);

  const active = grammar.tabs.find((tab) => tab.id === activeTab) ?? grammar.tabs[0];

  return (
    <div>
      <div className="max-w-3xl">
        <span
          style={{
            backgroundColor: theme?.badgeBg,
            borderColor: theme?.borderSoft,
            color: theme?.primaryDark,
          }}
          className="ml-eyebrow"
        >
          Grammar corner
        </span>
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
            style={
              activeTab === tab.id
                ? {
                    backgroundColor: theme?.primaryDark || "#24332D",
                    borderColor: theme?.primaryDark || "#24332D",
                    color: "#FFFFFF",
                  }
                : {}
            }
            className={`whitespace-nowrap rounded-full border px-4 py-2.5 text-xs font-extrabold transition-all ${
              activeTab === tab.id
                ? "shadow-sm"
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
          style={{ borderColor: theme?.borderSoft || "#DDE5E0" }}
          className="mt-5 overflow-hidden rounded-[30px] border bg-white/[0.88] p-6 shadow-[0_16px_45px_rgba(36,51,45,0.055)] sm:p-8"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_220px]">
            <div>
              <p
                style={{ color: theme?.primaryMuted }}
                className="text-[11px] font-extrabold uppercase tracking-[0.14em]"
              >
                Focus
              </p>
              <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.035em] text-[#24332D]">
                {active.title}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#66756E]">{active.description}</p>
            </div>

            <div
              style={{
                backgroundColor: theme?.bgLight || "#EAF4EF",
                borderColor: theme?.borderSoft,
              }}
              className="relative min-h-28 overflow-hidden rounded-[22px] border p-5"
            >
              <span
                style={{ color: theme?.primary ? `${theme.primary}55` : "#BFDACC55" }}
                className="absolute -right-3 -top-5 text-7xl font-black tracking-[-0.08em]"
              >
                Aa
              </span>
              <MessageSquareQuote size={21} style={{ color: theme?.primaryDark || "#48685A" }} className="relative" />
              <p
                style={{ color: theme?.primaryDark || "#526A5E" }}
                className="relative mt-5 text-xs font-bold leading-5"
              >
                Learn the pattern first, then notice how it changes in the example.
              </p>
            </div>
          </div>

          {active.chips?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {active.chips.map((chip) => (
                <span
                  key={chip}
                  style={{
                    backgroundColor: theme?.badgeBg || "#FBEDE4",
                    color: theme?.badgeText || "#745C4F",
                    borderColor: theme?.borderSoft,
                  }}
                  className="rounded-full border px-3.5 py-2 text-xs font-extrabold"
                >
                  {chip}
                </span>
              ))}
            </div>
          )}

          {active.notes?.length > 0 && (
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {active.notes.map((note) => (
                <div key={note} className="flex gap-2.5 text-sm leading-6 text-[#5F6E67]">
                  <span
                    style={{
                      backgroundColor: theme?.badgeBg || "#CFE8DD",
                      color: theme?.badgeText || "#315C49",
                    }}
                    className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full"
                  >
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
            <div
              style={{
                backgroundColor: theme?.bgSurface || "#FBEDE4",
                borderColor: theme?.borderSoft || "#E8D4C7",
                color: theme?.primaryDark || "#69594F",
              }}
              className="mt-6 flex gap-3 rounded-[20px] border p-4 text-sm leading-6"
            >
              <ArrowRight size={17} style={{ color: theme?.primaryDark }} className="mt-1 shrink-0" />
              <p>{active.callout}</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <SourceNote source={grammar.source} />
    </div>
  );
}
