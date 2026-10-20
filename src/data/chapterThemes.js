/**
 * Chapter Theme Configuration & Pastel Color Palettes
 *
 * Distinct visual identity and color palette for each chapter:
 *  - Chapter 1: #EAC3D5 (Soft Rose Pastel)
 *  - Chapter 2: #809CCE (Soft Periwinkle Blue Pastel)
 *  - Chapter 3: #D6EADF (Soft Mint Sage Pastel)
 *  - Chapter 4: #94B8D0 (Sky Steel Pastel Blue)
 *  - Chapter 5: #B7E0D2 (Seafoam Aqua Pastel)
 */

export const CHAPTER_THEMES = {
  1: {
    id: "descriptive-text",
    label: "Descriptive Text · Athletes & Sports",
    primary: "#EAC3D5",
    primaryDark: "#4D2639",
    primaryMuted: "#87526D",
    bgLight: "rgba(234, 195, 213, 0.22)",
    bgSurface: "rgba(234, 195, 213, 0.12)",
    border: "rgba(234, 195, 213, 0.85)",
    borderSoft: "rgba(234, 195, 213, 0.45)",
    badgeBg: "#F9EDF3",
    badgeText: "#5C243F",
    accent: "#DF9BB9",
    glowColors: ["from-[#EAC3D5]/35", "from-[#F4D7C5]/25"],
    heroBg: "#FAF4F7",
    completionEmoji: "🏸",
    completionText: "Warm-up complete! You are ready for the next step.",
  },
  2: {
    id: "recount-text",
    label: "Recount Text · Sports Events & Arena",
    primary: "#809CCE",
    primaryDark: "#1F3459",
    primaryMuted: "#456291",
    bgLight: "rgba(128, 156, 206, 0.22)",
    bgSurface: "rgba(128, 156, 206, 0.12)",
    border: "rgba(128, 156, 206, 0.85)",
    borderSoft: "rgba(128, 156, 206, 0.45)",
    badgeBg: "#EDF2FA",
    badgeText: "#223E6E",
    accent: "#6788C4",
    glowColors: ["from-[#809CCE]/35", "from-[#94B8D0]/25"],
    heroBg: "#F4F7FC",
    completionEmoji: "🏟️",
    completionText: "The crowd roars! Excellent performance.",
  },
  3: {
    id: "procedure-text",
    label: "Procedure Text · Healthy Lifestyle & Nutrition",
    primary: "#D6EADF",
    primaryDark: "#234434",
    primaryMuted: "#4E7360",
    bgLight: "rgba(214, 234, 223, 0.35)",
    bgSurface: "rgba(214, 234, 223, 0.15)",
    border: "rgba(214, 234, 223, 0.9)",
    borderSoft: "rgba(214, 234, 223, 0.5)",
    badgeBg: "#EDF7F2",
    badgeText: "#21533C",
    accent: "#8EBEAA",
    glowColors: ["from-[#D6EADF]/45", "from-[#B7E0D2]/30"],
    heroBg: "#F7FAF8",
    completionEmoji: "🥗",
    completionText: "Nourishing work! Your healthy habits shine.",
  },
  4: {
    id: "analytical-exposition",
    label: "Analytical Exposition · Screen Time & Wellness",
    primary: "#94B8D0",
    primaryDark: "#1C364A",
    primaryMuted: "#456B86",
    bgLight: "rgba(148, 184, 208, 0.22)",
    bgSurface: "rgba(148, 184, 208, 0.12)",
    border: "rgba(148, 184, 208, 0.85)",
    borderSoft: "rgba(148, 184, 208, 0.45)",
    badgeBg: "#ECF4F9",
    badgeText: "#1F4A6A",
    accent: "#6CA3C7",
    glowColors: ["from-[#94B8D0]/35", "from-[#809CCE]/25"],
    heroBg: "#F5F8FA",
    completionEmoji: "🌙",
    completionText: "Rest well! A balanced mind is a sharp one.",
  },
  5: {
    id: "narrative-text",
    label: "Narrative Text · Folklore & Stories",
    primary: "#B7E0D2",
    primaryDark: "#193E33",
    primaryMuted: "#3E7465",
    bgLight: "rgba(183, 224, 210, 0.28)",
    bgSurface: "rgba(183, 224, 210, 0.14)",
    border: "rgba(183, 224, 210, 0.85)",
    borderSoft: "rgba(183, 224, 210, 0.45)",
    badgeBg: "#EBF7F2",
    badgeText: "#185343",
    accent: "#76C4AB",
    glowColors: ["from-[#B7E0D2]/40", "from-[#D6EADF]/30"],
    heroBg: "#F6FAF8",
    completionEmoji: "🌊",
    completionText: "The legend lives on through your words.",
  },
};

export function getChapterTheme(chapterId) {
  const ch = Number(chapterId) || 1;
  return CHAPTER_THEMES[ch] ?? CHAPTER_THEMES[1];
}
