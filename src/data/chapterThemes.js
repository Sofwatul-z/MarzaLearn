/**
 * Chapter Theme Configuration
 *
 * Each chapter has a distinct visual identity derived from its content:
 *  - Chapter 1: Athletes & Sports (Descriptive Text)
 *  - Chapter 2: Badminton at Istora (Recount Text)
 *  - Chapter 3: Healthy Lifestyle & Nutrition (Procedure Text)
 *  - Chapter 4: Screen Time & Sleep (Analytical Exposition)
 *  - Chapter 5: Malin Kundang Legend (Narrative Text)
 *
 * The hero section, decorations, colors, and labels adapt per-chapter.
 */

export const CHAPTER_THEMES = {
  1: {
    id: "badminton-warmup",
    label: "Badminton Warm-up",
    heroGradient: "from-[#F8F5EC] via-[#F8F5EC] to-transparent",
    heroBg: "#F8F5EC",
    accentPrimary: "#183B40",
    accentSecondary: "#D93435",
    accentBlue: "#37679D",
    accentTeal: "#63B7A8",
    tipLabel: "Focus Note",
    tipBorder: "border-[#63B7A8]/30",
    tipBg: "bg-white/85",
    tipAccent: "bg-[#D93435]",
    tipLabelColor: "text-[#D93435]",
    completionEmoji: "🏸",
    completionText: "Warm-up complete! You are ready for the next step.",
    glowColors: ["from-[#63B7A8]/20", "from-[#D93435]/10"],
    zoomLabel: "Inspect Image",
  },
  2: {
    id: "arena",
    label: "Championship Arena",
    heroGradient: "from-red-50/40 via-white to-amber-50/30",
    heroBg: "#FEF7F5",
    accentPrimary: "#991B1B",
    accentSecondary: "#DC2626",
    tipLabel: "Match Strategy Tip",
    tipBorder: "border-red-200/60",
    tipBg: "bg-gradient-to-r from-red-50/60 via-white to-amber-50/40",
    tipAccent: "bg-[#DC2626]",
    tipLabelColor: "text-[#B91C1C]",
    completionEmoji: "🏟️",
    completionText: "The crowd roars! Excellent performance.",
    glowColors: ["from-red-400/15", "from-amber-300/15"],
    zoomLabel: "Zoom In",
  },
  3: {
    id: "nutrition",
    label: "Healthy Habits",
    heroGradient: "from-green-50/60 via-amber-50/20 to-orange-50/30",
    heroBg: "#F8FAF4",
    accentPrimary: "#3D6B4F",
    accentSecondary: "#D97706",
    tipLabel: "Wellness Tip",
    tipBorder: "border-green-200/60",
    tipBg: "bg-gradient-to-r from-green-50/70 via-white to-amber-50/50",
    tipAccent: "bg-[#65A30D]",
    tipLabelColor: "text-[#4D7C0F]",
    completionEmoji: "🥗",
    completionText: "Nourishing work! Your healthy habits shine.",
    glowColors: ["from-green-400/20", "from-amber-200/20"],
    zoomLabel: "Zoom In",
  },
  4: {
    id: "screen",
    label: "Digital Wellness",
    heroGradient: "from-indigo-50/40 via-slate-50/30 to-purple-50/30",
    heroBg: "#F5F5FA",
    accentPrimary: "#3730A3",
    accentSecondary: "#7C3AED",
    tipLabel: "Research Insight",
    tipBorder: "border-indigo-200/50",
    tipBg: "bg-gradient-to-r from-indigo-50/60 via-white to-purple-50/40",
    tipAccent: "bg-[#4F46E5]",
    tipLabelColor: "text-[#4338CA]",
    completionEmoji: "🌙",
    completionText: "Rest well! A balanced mind is a sharp one.",
    glowColors: ["from-indigo-400/15", "from-purple-300/15"],
    zoomLabel: "Zoom In",
  },
  5: {
    id: "folklore",
    label: "The Legend",
    heroGradient: "from-amber-50/50 via-orange-50/20 to-teal-50/30",
    heroBg: "#FAF8F3",
    accentPrimary: "#92400E",
    accentSecondary: "#D97706",
    tipLabel: "Storyteller's Wisdom",
    tipBorder: "border-amber-200/60",
    tipBg: "bg-gradient-to-r from-amber-50/70 via-white to-teal-50/40",
    tipAccent: "bg-[#D97706]",
    tipLabelColor: "text-[#92400E]",
    completionEmoji: "🌊",
    completionText: "The legend lives on through your words.",
    glowColors: ["from-amber-400/20", "from-teal-300/15"],
    zoomLabel: "Zoom In",
  },
};

export function getChapterTheme(chapterId) {
  const ch = Number(chapterId) || 1;
  return CHAPTER_THEMES[ch] ?? CHAPTER_THEMES[1];
}
