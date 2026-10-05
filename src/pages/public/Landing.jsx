import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brush,
  CheckCircle2,
  Gamepad2,
  GraduationCap,
  Link2,
  Layers3,
  Headphones,
  MessageSquareText,
  PenLine,
  Play,
  Sparkles,
  Users,
} from "lucide-react";

import Navbar from "../../components/common/Navbar";
import Button from "../../components/common/Button";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

const steps = [
  { icon: BookOpen, label: "Engage", desc: "Introduce new concepts with story openings, questions, and audio/video activities." },
  { icon: Brush, label: "Explore", desc: "Discover vocabulary through interactive exploration and discovery exercises." },
  { icon: MessageSquareText, label: "Explain", desc: "Deepen understanding with detailed grammar explanations and learning notes." },
  { icon: PenLine, label: "Elaborate", desc: "Apply learning through practical challenges and creative application activities." },
  { icon: Gamepad2, label: "Evaluate", desc: "Test your knowledge with interactive quizzes, matching games, and assessments." },
  { icon: Link2, label: "Extend", desc: "Connect learning to real-life applications and additional homework activities." },
];

const features = [
  {
    icon: GraduationCap,
    title: "Marzano's 6-Step Method",
    desc: "A research-backed vocabulary learning framework that moves students from recognition to deep understanding through six connected activities.",
  },
  {
    icon: Sparkles,
    title: "Interactive Learning",
    desc: "Drawing canvas, audio listening, word-matching games, and real-time quizzes keep students engaged throughout every chapter.",
  },
  {
    icon: BarChart3,
    title: "Teacher Dashboard",
    desc: "Monitor student progress in real-time, review submitted work, manage chapters, and track learning analytics from one place.",
  },
];

const stats = [
  { value: "5", label: "Chapters" },
  { value: "6", label: "Learning Steps" },
  { value: "30+", label: "Activities" },
  { value: "∞", label: "Creativity" },
];

export default function Landing() {
  return (
    <div id="home" className="min-h-screen bg-[#FBFCF8] overflow-hidden">
      <Navbar />

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative px-6 pt-20 pb-28 sm:px-10 lg:px-16">
        {/* background decoration */}
        <div className="pointer-events-none absolute -right-32 top-10 h-[520px] w-[520px] rounded-full bg-[#CFE8DD]/40 blur-[100px]" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-[380px] w-[380px] rounded-full bg-[#F4D7C5]/25 blur-[90px]" />

        <div className="relative z-10 mx-auto max-w-[1200px] grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          {/* left text */}
          <div>
            <motion.div {...fadeUp(0)}>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#EAF4EF] px-4 py-2 text-xs font-bold text-[#3F6252]">
                <Play size={13} /> Interactive English Learning Platform
              </span>
            </motion.div>

            <motion.h1 {...fadeUp(0.1)}
              className="mt-7 text-5xl font-extrabold leading-[1.05] tracking-[-0.055em] text-[#24332D] sm:text-6xl lg:text-[68px]"
            >
              Learn English
              <br />
              Through Stories,
              <br />
              <span className="text-[#5B7568]">Creativity</span>, &amp; Games
            </motion.h1>

            <motion.p {...fadeUp(0.2)}
              className="mt-7 max-w-xl text-lg leading-8 text-[#6C7973] sm:text-xl"
            >
              An interactive learning platform designed with Marzano's 6-Step Vocabulary Journey — combining structured learning, creative projects, and gamified challenges.
            </motion.p>

            <motion.div {...fadeUp(0.3)} className="mt-9 flex flex-wrap gap-4">
              <Button as={Link} to="/login" size="lg" className="group">
                <span className="text-white">Start Learning</span>
                <ArrowRight size={18} className="text-white transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button as="a" href="#journey" variant="secondary" size="lg">
                <span className="text-[#24332D]">Explore Journey</span>
              </Button>
            </motion.div>
          </div>

          {/* right illustration — decorative abstract */}
          <motion.div {...fadeUp(0.2)} className="relative hidden lg:block">
            <div className="relative mx-auto w-full max-w-[440px]">
              {/* Main circle */}
              <div className="aspect-square w-full rounded-full bg-gradient-to-br from-[#CFE8DD] to-[#EAF4EF] p-10 shadow-[0_40px_100px_rgba(36,51,45,0.1)]">
                <div className="flex h-full w-full flex-col items-center justify-center rounded-full border-2 border-dashed border-[#B8D7C8] bg-white/60 backdrop-blur-sm">
                  <span className="text-6xl font-black tracking-[-0.06em] text-[#24332D]">6</span>
                  <span className="mt-1 text-sm font-bold text-[#5B7568]">Step Journey</span>
                  <span className="mt-3 text-xs text-[#8A9690]">Marzano Method</span>
                </div>
              </div>
              {/* Floating badges */}
              <div className="absolute -left-6 top-14 rounded-2xl border border-[#D7E1DC] bg-white px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-[#5B7568]" />
                  <span className="text-xs font-bold text-[#24332D]">Vocabulary</span>
                </div>
              </div>
              <div className="absolute -right-4 top-10 rounded-2xl border border-[#D7E1DC] bg-white px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <Brush size={16} className="text-[#745C4F]" />
                  <span className="text-xs font-bold text-[#24332D]">Creative</span>
                </div>
              </div>
              <div className="absolute -left-2 top-1/2 rounded-2xl border border-[#D7E1DC] bg-white px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <Gamepad2 size={16} className="text-[#5B7568]" />
                  <span className="text-xs font-bold text-[#24332D]">Games</span>
                </div>
              </div>
              <div className="absolute -right-6 top-1/2 rounded-2xl border border-[#D7E1DC] bg-white px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <Headphones size={16} className="text-[#745C4F]" />
                  <span className="text-xs font-bold text-[#24332D]">Listening</span>
                </div>
              </div>
              <div className="absolute left-10 bottom-8 rounded-2xl border border-[#D7E1DC] bg-white px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <Layers3 size={16} className="text-[#5B7568]" />
                  <span className="text-xs font-bold text-[#24332D]">Grammar</span>
                </div>
              </div>
              <div className="absolute right-10 bottom-8 rounded-2xl border border-[#D7E1DC] bg-white px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <MessageSquareText size={16} className="text-[#5B7568]" />
                  <span className="text-xs font-bold text-[#24332D]">Speaking</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ STATS BAR ═══════════════════ */}
      <motion.section {...fadeUp()} className="relative z-10 mx-6 -mt-8 sm:mx-10 lg:mx-16">
        <div className="mx-auto max-w-[1200px] grid grid-cols-2 gap-px overflow-hidden rounded-[24px] border border-[#D7E1DC] bg-[#D7E1DC] shadow-[0_20px_60px_rgba(36,51,45,0.06)] sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white px-6 py-7 text-center">
              <p className="text-3xl font-extrabold tracking-[-0.04em] text-[#24332D]">{stat.value}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[#8A9690]">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ═══════════════════ FEATURES ═══════════════════ */}
      <section id="about" className="px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1200px]">
          <motion.div {...fadeUp()} className="mb-14 max-w-2xl">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#718078]">Why MarzaLearn</span>
            <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.045em] text-[#24332D] sm:text-5xl">
              Everything you need for effective English learning.
            </h2>
          </motion.div>

          <div className="grid gap-px overflow-hidden rounded-[28px] border border-[#E3E9E5] bg-[#E3E9E5] md:grid-cols-3">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div key={feature.title} {...fadeUp(i * 0.08)} className="bg-white p-8 sm:p-10">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EAF4EF] text-[#3F6252]">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-5 text-xl font-extrabold tracking-[-0.03em] text-[#24332D]">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#69776F]">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════ 6-STEP JOURNEY ═══════════════════ */}
      <section id="journey" className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1200px]">
          <motion.div {...fadeUp()} className="mb-12 max-w-2xl">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#718078]">The Journey</span>
            <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.045em] text-[#24332D] sm:text-5xl">
              Six steps. One powerful learning flow.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#6C7973] sm:text-lg">
              Every chapter follows the same proven Marzano sequence — each step builds on the last, guiding students from discovery to mastery.
            </p>
          </motion.div>

          <div className="relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.label}
                  {...fadeUp(index * 0.05)}
                  className="grid grid-cols-[52px_minmax(0,1fr)] gap-4 sm:grid-cols-[68px_minmax(0,1fr)] sm:gap-6"
                >
                  <div className="relative flex justify-center">
                    {index < steps.length - 1 && (
                      <span className="absolute bottom-0 top-12 w-px bg-[#DDE5E0]" />
                    )}
                    <span className="relative z-10 grid h-11 w-11 place-items-center rounded-full border border-[#24332D] bg-[#24332D] text-white shadow-[0_8px_20px_rgba(36,51,45,0.15)]">
                      <Icon size={17} />
                    </span>
                  </div>
                  <div className="border-b border-[#E3E9E5] pb-7 pt-0.5 sm:pb-8">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8A9690]">
                        Step {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-xl font-extrabold tracking-[-0.03em] text-[#24332D]">{step.label}</h3>
                    </div>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#69776F]">{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="px-6 py-16 sm:px-10 lg:px-16">
        <motion.div {...fadeUp()}
          className="mx-auto max-w-[1200px] overflow-hidden rounded-[36px] bg-[#24332D] px-8 py-14 text-center text-white shadow-[0_40px_100px_rgba(36,51,45,0.2)] sm:px-14 sm:py-18"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#CFE8DD]/10 blur-3xl" />
          <span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#B9D8CA]">
            <CheckCircle2 size={14} /> Ready to begin?
          </span>
          <h2 className="mt-5 text-4xl font-extrabold tracking-[-0.045em] text-white sm:text-5xl">
            Start your learning journey today.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-white/60">
            Join MarzaLearn and experience a new way to learn English — structured, creative, and fun.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Button as={Link} to="/login" variant="pastel" size="lg" className="group">
              Get Started Free
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="border-t border-[#E3E9E5] px-6 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <p className="text-lg font-extrabold tracking-[-0.03em] text-[#24332D]">MarzaLearn</p>
            <p className="mt-1 text-xs text-[#8A9690]">Learn. Create. Grow.</p>
          </div>
          <div className="flex items-center gap-6 text-sm text-[#8A9690]">
            <a href="#home" className="transition hover:text-[#24332D]">Home</a>
            <a href="#journey" className="transition hover:text-[#24332D]">Journey</a>
            <a href="#about" className="transition hover:text-[#24332D]">About</a>
            <Link to="/login" className="transition hover:text-[#24332D]">Login</Link>
          </div>
          <p className="text-xs text-[#A0AAA5]">© 2026 MarzaLearn. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}