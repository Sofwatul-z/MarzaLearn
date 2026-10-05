import { supabase } from "./supabase";
import { CHAPTER_CATALOG } from "../data/chapterCatalog";
import { saveStudentProgress } from "./progress";

function isMissingOptionalResource(error) {
  if (!error) return false;

  return (
    error.code === "42P01" ||
    error.code === "42703" ||
    error.code === "PGRST204" ||
    error.code === "PGRST205" ||
    /does not exist|could not find the table|schema cache|column .* does not exist/i.test(
      error.message ?? ""
    )
  );
}

function stripVisualPreviews(items = {}) {
  return Object.fromEntries(
    Object.entries(items).map(([key, item]) => [
      key,
      item
        ? {
            mode: item.mode ?? "draw",
            storagePath: item.storagePath ?? null,
            pendingUpload: Boolean(item.pendingUpload && !item.storagePath),
            savedAt: item.savedAt ?? null,
          }
        : item,
    ])
  );
}

function databaseSessionData(state) {
  return {
    highestUnlocked: state.highestUnlocked,
    completedSteps: state.completedSteps,
    updatedAt: state.updatedAt,
    data: {
      ...state.data,
      visualize: {
        ...state.data.visualize,
        items: stripVisualPreviews(state.data.visualize?.items),
      },
    },
  };
}

function getDatabaseChapterId(chapterId) {
  const catalogChapter = CHAPTER_CATALOG.find(
    (chapter) => chapter.id === Number(chapterId) || chapter.databaseId === Number(chapterId)
  );
  return catalogChapter?.databaseId ?? Number(chapterId);
}

export async function loadLearningSession(studentId, chapterId) {
  if (!studentId || !chapterId) return null;

  const { data, error } = await supabase
    .from("learning_sessions")
    .select(
      "student_id,chapter_id,status,current_step,session_data,started_at,completed_at,updated_at"
    )
    .eq("student_id", studentId)
    .eq("chapter_id", getDatabaseChapterId(chapterId))
    .maybeSingle();

  if (error) {
    if (!isMissingOptionalResource(error)) {
      console.warn("MarzaLearn: could not load learning session", error);
    }
    return null;
  }

  if (!data) return null;

  const sessionData = data.session_data ?? {};

  return {
    status: data.status ?? "in_progress",
    currentStep: Number(data.current_step ?? 1),
    highestUnlocked: Number(
      sessionData.highestUnlocked ?? data.current_step ?? 1
    ),
    completedSteps: Array.isArray(sessionData.completedSteps)
      ? sessionData.completedSteps
      : [],
    data: sessionData.data ?? {},
    startedAt: data.started_at ?? null,
    completedAt: data.completed_at ?? null,
    updatedAt: data.updated_at ?? sessionData.updatedAt ?? null,
  };
}

export async function saveLearningSession(studentId, chapterId, state) {
  if (!studentId || !chapterId || !state) {
    return { ok: false, reason: "missing-data" };
  }

  const payload = {
    student_id: studentId,
    chapter_id: getDatabaseChapterId(chapterId),
    status: state.status,
    current_step: Number(state.currentStep ?? 1),
    session_data: databaseSessionData(state),
    started_at: state.startedAt,
    completed_at: state.completedAt,
    updated_at: state.updatedAt ?? new Date().toISOString(),
  };

  const { error } = await supabase
    .from("learning_sessions")
    .upsert(payload, { onConflict: "student_id,chapter_id" });

  const progressResult = await saveStudentProgress(studentId, chapterId, state);

  if (error) {
    if (!isMissingOptionalResource(error)) {
      console.warn("MarzaLearn: session cloud save failed", error);
    }
    return {
      ok: progressResult.ok,
      reason: isMissingOptionalResource(error) ? "unavailable" : "error",
      error,
    };
  }

  return { ok: true };
}

export async function uploadVisualAsset({
  studentId,
  chapterId,
  promptIndex,
  blob,
}) {
  if (!studentId || !chapterId || !blob) {
    return { ok: false, reason: "missing-data" };
  }

  const extension = blob.type === "image/jpeg" ? "jpg" : blob.type === "image/webp" ? "webp" : "png";
  const path = `${studentId}/chapter-${chapterId}/prompt-${promptIndex + 1}.${extension}`;

  const { error } = await supabase.storage
    .from("visualize-assets")
    .upload(path, blob, {
      cacheControl: "3600",
      contentType: blob.type || "image/png",
      upsert: true,
    });

  if (error) {
    console.warn("MarzaLearn: visual asset cloud upload failed", error);
    return { ok: false, reason: "storage-error", error };
  }

  return { ok: true, path };
}

export async function getVisualAssetUrl(path, expiresIn = 60 * 60) {
  if (!path) return null;

  const { data, error } = await supabase.storage
    .from("visualize-assets")
    .createSignedUrl(path, expiresIn);

  if (error) {
    console.warn("MarzaLearn: could not create visual asset preview URL", error);
    return null;
  }

  return data?.signedUrl ?? null;
}
