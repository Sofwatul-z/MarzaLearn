import { CHAPTER_CONTENT } from '../data/chapters';

export const MARZANO_STEPS = [
  'provide',
  'restate',
  'visualize',
  'engage',
  'discuss',
  'play',
];

export function getChapterContentById(id) {
  return CHAPTER_CONTENT.find((chapter) => chapter.id === Number(id)) ?? null;
}

export function validateChapterContent(chapter) {
  const required = [
    'id',
    'title',
    'overview',
    'listening',
    'grammar',
    'marzano',
    'project',
  ];

  const missing = required.filter((key) => !chapter?.[key]);

  return {
    valid: missing.length === 0,
    missing,
  };
}

export function getLearningFlow(chapter) {
  if (!chapter) return [];

  return MARZANO_STEPS.map((step) => ({
    id: step,
    title: chapter.marzano?.[step]?.title ?? step,
    activity: chapter.marzano?.[step]?.activity ?? null,
  }));
}
