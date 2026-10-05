import { CHAPTER_CONTENT } from "./chapters";

const projectLabels = {
  1: "Digital Athlete Profile",
  2: "Digital Recount Story",
  3: "Digital How-To Guide",
  4: "Persuasive Campaign",
  5: "Digital Story Project",
};

const descriptions = {
  1: "Describe people clearly through appearance, personality, adjectives, and simple present forms.",
  2: "Retell memorable events in sequence using action verbs, simple past, and past progressive.",
  3: "Give useful instructions and advice with imperatives, modals, sequencing, and had better.",
  4: "Build a clear point of view with a thesis, supporting arguments, and expressions of opinion.",
  5: "Explore stories, conflicts, resolutions, past tense, and imaginative conditional sentences.",
};

export const CHAPTER_CATALOG = CHAPTER_CONTENT.map((chapter) => ({
  id: chapter.id,
  databaseId: 15 + chapter.id,
  semester: chapter.semester,
  title: chapter.title,
  shortTitle: chapter.shortTitle,
  description: descriptions[chapter.id],
  focus: chapter.focus,
  eyebrow: chapter.kicker,
  duration: chapter.duration,
  listening: Boolean(chapter.listening?.audioSrc),
  projectLabel: projectLabels[chapter.id],
}));

export function getCatalogChapter(id) {
  const numericId = Number(id);
  return CHAPTER_CATALOG.find((chapter) => chapter.id === numericId) ?? null;
}

export function getSemesterChapters(semester) {
  return CHAPTER_CATALOG.filter((chapter) => chapter.semester === Number(semester));
}
