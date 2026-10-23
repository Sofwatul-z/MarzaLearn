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
            preview: item.preview ?? null, // Preserve visual artwork so teacher review and other devices display the real drawing!
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

  const dbCId = getDatabaseChapterId(chapterId);
  const targetIds = Array.from(new Set([Number(chapterId), dbCId, Number(chapterId) + 15])).filter(Boolean);

  const { data, error } = await supabase
    .from("learning_sessions")
    .select(
      "student_id,chapter_id,status,current_step,session_data,started_at,completed_at,updated_at"
    )
    .eq("student_id", studentId)
    .in("chapter_id", targetIds)
    .order("updated_at", { ascending: false })
    .limit(1)
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
    return { ok: false, reason: "missing-data", sessionSaved: false, progressSaved: false };
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

  let { error } = await supabase
    .from("learning_sessions")
    .upsert(payload, { onConflict: "student_id,chapter_id" });

  // If upsert failed due to foreign key or constraint on databaseChapterId, retry with raw numeric chapterId
  if (error && Number(chapterId) !== payload.chapter_id) {
    const fallbackPayload = { ...payload, chapter_id: Number(chapterId) };
    const retry = await supabase
      .from("learning_sessions")
      .upsert(fallbackPayload, { onConflict: "student_id,chapter_id" });
    if (!retry.error) {
      error = null;
    }
  }

  const progressResult = await saveStudentProgress(
    studentId,
    chapterId,
    state
  );

  if (error) {
    console.warn("MarzaLearn: session cloud save failed", error);

    return {
      ok: false,
      reason: isMissingOptionalResource(error)
        ? "unavailable"
        : "session-save-error",
      error,
      sessionSaved: false,
      progressSaved: Boolean(progressResult.ok),
    };
  }

  if (!progressResult.ok) {
    console.warn(
      "MarzaLearn: progress summary save failed",
      progressResult.error
    );

    return {
      ok: false,
      reason: "progress-save-error",
      error: progressResult.error,
      sessionSaved: true,
      progressSaved: false,
    };
  }

  return {
    ok: true,
    sessionSaved: true,
    progressSaved: true,
  };
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

/**
 * Auto-uplift mechanism: Scans localStorage for student's local session drafts
 * and saves any un-synced or newer work directly to Supabase cloud.
 * This guarantees cross-device consistency so other devices & teacher review immediately see the student's work.
 */
export async function upliftLocalDraftsToCloud(studentId) {
  if (!studentId || typeof window === "undefined") return { uplifted: 0 };

  let upliftedCount = 0;
  const prefixes = [
    `marzalearn-session-v1:${studentId}:`,
    `marzalearn-session:${studentId}:`,
  ];

  try {
    const keysToCheck = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (prefixes.some((p) => key?.startsWith(p))) {
        keysToCheck.push(key);
      }
    }

    for (const key of keysToCheck) {
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;

      let localSession = null;
      try {
        localSession = JSON.parse(raw);
      } catch (e) {
        continue;
      }

      if (
        !localSession ||
        localSession.status === "not_started" ||
        localSession.status === "reset"
      ) {
        continue;
      }

      // Extract chapterId from key
      const parts = key.split(":");
      const rawCId = parts[parts.length - 1];
      const chapterId = Number(rawCId);
      if (!chapterId || isNaN(chapterId)) continue;

      // Check cloud state
      const cloudSession = await loadLearningSession(studentId, chapterId);
      if (cloudSession?.status === "reset") {
        // Teacher has reset this chapter in cloud; discard stale local draft
        try {
          window.localStorage.removeItem(key);
        } catch (e) {}
        continue;
      }

      const localCompleted = localSession.completedSteps?.length || 0;
      const cloudCompleted = cloudSession?.completedSteps?.length || 0;
      const localTime = new Date(localSession.updatedAt || 0).getTime();
      const cloudTime = new Date(cloudSession?.updatedAt || 0).getTime();

      // Uplift if cloud has nothing or local is more complete / newer
      const shouldUplift =
        !cloudSession ||
        cloudSession.status === "not_started" ||
        localCompleted > cloudCompleted ||
        (localCompleted === cloudCompleted && localTime > cloudTime);

      if (shouldUplift) {
        const res = await saveLearningSession(studentId, chapterId, localSession);
        if (res.ok) {
          upliftedCount++;
        }
      }
    }
  } catch (err) {
    console.warn("MarzaLearn: auto-uplift failed", err);
  }

  return { uplifted: upliftedCount };
}
