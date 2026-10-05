import { supabase } from "./supabase";
import { getChapterContent } from "../data/chapters";
import { CHAPTER_CATALOG } from "../data/chapterCatalog";

const STEP_ORDER = ["Provide", "Restate", "Visualize", "Engage", "Discuss", "Games"];

function isValidId(value) {
  return Number.isInteger(Number(value)) && Number(value) > 0;
}

function getLocalId(chapter) {
  if (!chapter) return null;
  const explicitLocalId = Number(chapter.local_id ?? chapter.content_id);
  if (isValidId(explicitLocalId) && getChapterContent(explicitLocalId)) return explicitLocalId;

  const databaseId = Number(chapter.id);
  const catalogMatch = CHAPTER_CATALOG.find((item) => item.databaseId === databaseId);
  return catalogMatch?.id ?? (getChapterContent(databaseId) ? databaseId : null);
}

function normalizeChapter(row) {
  const localId = getLocalId(row);
  const localChapter = getChapterContent(localId);

  return {
    ...row,
    id: localId ?? Number(row.id),
    databaseId: Number(row.id),
    localId,
    chapter_number: Number(row.order_number ?? row.chapter_number ?? localId ?? row.id),
    semester: Number(row.semester ?? localChapter?.semester ?? 1),
    title: row.title ?? localChapter?.title ?? "Untitled Chapter",
    description: row.description ?? localChapter?.overview?.definition ?? "",
  };
}

function generateLocalSteps(chapter) {
  if (!chapter) return generateEmptySteps("unknown");

  return STEP_ORDER.map((stepName, index) => ({
    id: `${chapter.id}-${index + 1}`,
    step_number: index + 1,
    step_name: stepName,
    description: chapter.marzano?.[stepName.toLowerCase()]?.title ?? "",
  }));
}

function generateEmptySteps(chapterId) {
  return STEP_ORDER.map((stepName, index) => ({
    id: `${chapterId}-${index + 1}`,
    step_number: index + 1,
    step_name: stepName,
    description: "",
  }));
}

export async function getChapters() {
  const { data, error } = await supabase
    .from("chapters")
    .select("*")
    .order("order_number", { ascending: true });

  if (error) {
    console.warn("MarzaLearn: failed to load chapters from Supabase", error);
    return CHAPTER_CATALOG.map((chapter) => ({
      ...chapter,
      databaseId: chapter.databaseId ?? 15 + Number(chapter.id),
      localId: chapter.id,
      chapter_number: chapter.id,
    }));
  }

  const dbChapters = (data ?? []).map(normalizeChapter);

  // Also include local catalog chapters that don't exist in DB
  const dbIds = new Set(dbChapters.map((c) => c.databaseId));
  const localOnly = CHAPTER_CATALOG
    .filter((c) => !dbIds.has(c.databaseId))
    .map((chapter) => ({
      ...chapter,
      databaseId: chapter.databaseId ?? 15 + Number(chapter.id),
      localId: chapter.id,
      chapter_number: chapter.id,
    }));

  let mockChapters = [];
  try {
    mockChapters = JSON.parse(localStorage.getItem('mock_chapters') || '[]').map(normalizeChapter);
  } catch (e) {}

  return [...localOnly, ...dbChapters, ...mockChapters].sort(
    (a, b) => (a.semester ?? 1) - (b.semester ?? 1) || (a.chapter_number ?? a.id) - (b.chapter_number ?? b.id)
  );
}

export async function getTeacherChapters() {
  return getChapters();
}

export async function getChapterById(id) {
  const numericId = Number(id);
  const localChapter = getChapterContent(numericId);

  if (localChapter) {
    const catalog = CHAPTER_CATALOG.find((item) => item.id === numericId);
    const databaseId = catalog?.databaseId ?? numericId;
    const { data } = await supabase.from("chapters").select("*").eq("id", databaseId).maybeSingle();
    return normalizeChapter({ ...data, id: databaseId, local_id: numericId });
  }

  const { data, error } = await supabase.from("chapters").select("*").eq("id", numericId).maybeSingle();
  if (error || !data) return null;
  return normalizeChapter(data);
}

export async function getChapterDetail(id) {
  const databaseId = Number(id);
  if (!isValidId(databaseId)) return null;

  const { data: chapterData, error: chapterError } = await supabase
    .from("chapters")
    .select("*")
    .eq("id", databaseId)
    .maybeSingle();

  if (chapterError) {
    console.warn("MarzaLearn: failed to load chapter detail", chapterError);
  }

  const localId = getLocalId(chapterData) ?? CHAPTER_CATALOG.find((item) => item.databaseId === databaseId)?.id ?? databaseId;
  const localChapter = getChapterContent(localId);
  const { data: stepsData, error: stepsError } = await supabase
    .from("chapter_steps")
    .select("*")
    .eq("chapter_id", databaseId)
    .order("step_number", { ascending: true });

  if (stepsError) {
    console.warn("MarzaLearn: failed to load chapter steps", stepsError);
  }

  const steps = stepsData?.length
    ? stepsData
    : localChapter
      ? generateLocalSteps(localChapter)
      : generateEmptySteps(databaseId);

  return {
    ...normalizeChapter({ ...(chapterData ?? {}), id: databaseId, local_id: localId }),
    localId,
    steps,
  };
}

export async function createChapter(chapter) {
  const payload = {
    title: chapter.title,
    description: chapter.description,
    semester: chapter.semester,
    order_number: chapter.order_number,
  };
  if (chapter.content_id) payload.content_id = chapter.content_id;

  const { data, error } = await supabase
    .from("chapters")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("Failed to create chapter", error);
    
    if (error.code === '42501' || error.message?.includes('row-level security')) {
      console.warn("RLS prevents saving to DB. Saving chapter to localStorage instead.");
      try {
        const localChapters = JSON.parse(localStorage.getItem('mock_chapters') || '[]');
        const newChapter = {
          ...payload,
          id: Date.now(),
          databaseId: Date.now(),
          isMock: true
        };
        localChapters.push(newChapter);
        localStorage.setItem('mock_chapters', JSON.stringify(localChapters));
        return normalizeChapter(newChapter);
      } catch (e) {
        throw new Error("Local storage fallback failed.");
      }
    }
    
    throw error;
  }
  return normalizeChapter(data);
}

export async function updateChapter(id, chapter) {
  const payload = {
    title: chapter.title,
    description: chapter.description,
    semester: chapter.semester,
    order_number: chapter.order_number,
  };
  if (chapter.content_id) payload.content_id = chapter.content_id;

  const { data, error } = await supabase
    .from("chapters")
    .update(payload)
    .eq("id", Number(id))
    .select()
    .single();

  if (error) {
    if (error.code === '42501' || error.message?.includes('row-level security')) {
      console.warn("RLS prevents updating DB. Updating in localStorage instead.");
      try {
        let localChapters = JSON.parse(localStorage.getItem('mock_chapters') || '[]');
        const idx = localChapters.findIndex(c => c.id === id || c.databaseId === id || c.id === Number(id));
        if (idx !== -1) {
          localChapters[idx] = { ...localChapters[idx], ...payload };
          localStorage.setItem('mock_chapters', JSON.stringify(localChapters));
          return normalizeChapter(localChapters[idx]);
        }
      } catch (e) {}
    }
    console.error("Failed to update chapter", error);
    throw error;
  }
  return normalizeChapter(data);
}

export async function deleteChapter(id) {
  const { error } = await supabase
    .from("chapters")
    .delete()
    .eq("id", Number(id));

  if (error) {
    if (error.code === '42501' || error.message?.includes('row-level security')) {
      console.warn("RLS prevents deleting DB. Deleting in localStorage instead.");
      try {
        let localChapters = JSON.parse(localStorage.getItem('mock_chapters') || '[]');
        const filtered = localChapters.filter(c => c.id !== id && c.databaseId !== id && c.id !== Number(id));
        localStorage.setItem('mock_chapters', JSON.stringify(filtered));
        return true;
      } catch (e) {}
    }
    console.error("Failed to delete chapter", error);
    throw error;
  }
  return true;
}

export { STEP_ORDER };