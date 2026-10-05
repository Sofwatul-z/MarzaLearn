import chapter1 from "./chapter1.js";
import chapter2 from "./chapter2.js";
import chapter3 from "./chapter3.js";
import chapter4 from "./chapter4.js";
import chapter5 from "./chapter5.js";

export const CHAPTER_CONTENT = [chapter1, chapter2, chapter3, chapter4, chapter5];

export function getChapterContent(id) {
  return CHAPTER_CONTENT.find((chapter) => chapter.id === Number(id)) ?? null;
}

export default CHAPTER_CONTENT;
