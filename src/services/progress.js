import { supabase } from "./supabase";
import { CHAPTER_CATALOG } from "../data/chapterCatalog";

function isMissingOptionalTable(error) {
  if (!error) return false;

  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    /does not exist|could not find the table|schema cache/i.test(error.message ?? "")
  );
}

async function safelyLoad(query, label) {
  const { data, error } = await query;

  if (error) {
    // Phase 3 can run before the progress tables are created. Missing optional
    // tables simply mean every chapter starts with a clean "Not Started" state.
    if (!isMissingOptionalTable(error)) {
      console.warn(`MarzaLearn: failed to load ${label}`, error);
    }
    return [];
  }

  return data ?? [];
}

function getLocalLearningSessions(studentId) {
  if (!studentId || typeof window === "undefined") return [];

  const prefix = `marzalearn-session-v1:${studentId}:`;
  const sessions = [];

  try {
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (!key?.startsWith(prefix)) continue;

      const chapterId = Number(key.slice(prefix.length));
      const raw = window.localStorage.getItem(key);
      if (!raw || !chapterId) continue;
      const session = JSON.parse(raw);
      if (!session?.status || session.status === "not_started") continue;

      sessions.push({
        chapter_id: chapterId,
        status: session.status,
        current_step: session.currentStep ?? 1,
        started_at: session.startedAt ?? null,
        completed_at: session.completedAt ?? null,
        updated_at: session.updatedAt ?? null,
      });
    }
  } catch (error) {
    console.warn("MarzaLearn: could not read local mission progress", error);
  }

  return sessions;
}

function mergeSessionProgress(cloudSessions, localSessions) {
  const byChapter = new Map();

  [...cloudSessions, ...localSessions].forEach((session) => {
    const key = Number(session.chapter_id);
    const existing = byChapter.get(key);
    if (!existing) {
      byChapter.set(key, session);
      return;
    }

    const existingTime = new Date(existing.updated_at ?? existing.completed_at ?? existing.started_at ?? 0).getTime();
    const candidateTime = new Date(session.updated_at ?? session.completed_at ?? session.started_at ?? 0).getTime();
    if (candidateTime >= existingTime) byChapter.set(key, session);
  });

  return [...byChapter.values()].sort((a, b) =>
    new Date(b.started_at ?? 0).getTime() - new Date(a.started_at ?? 0).getTime()
  );
}

export async function getStudentLearningSessions(studentId) {
  if (!studentId) return [];

  const cloud = await safelyLoad(
    supabase
      .from("learning_sessions")
      .select("chapter_id,status,current_step,started_at,completed_at,updated_at")
      .eq("student_id", studentId)
      .order("started_at", { ascending: false }),
    "learning sessions"
  );

  return mergeSessionProgress(cloud, getLocalLearningSessions(studentId)).map((session) => {
    const catalogChapter = CHAPTER_CATALOG.find(
      (chapter) => chapter.id === Number(session.chapter_id) || chapter.databaseId === Number(session.chapter_id)
    );
    return catalogChapter ? { ...session, chapter_id: catalogChapter.id } : session;
  });
}

export async function getStudentProjectSubmissions(studentId) {
  if (!studentId) return [];

  return safelyLoad(
    supabase
      .from("project_submissions")
      .select("chapter_id,status,submitted_at,reviewed_at")
      .eq("student_id", studentId)
      .order("submitted_at", { ascending: false }),
    "project submissions"
  );
}

function normalizeMissionStatus(session) {
  const status = session?.status?.toLowerCase();

  if (status === "completed" || session?.completed_at) return "completed";
  if (status === "in_progress" || status === "active" || session) return "in_progress";
  return "not_started";
}

function normalizeProjectStatus(project) {
  const status = project?.status?.toLowerCase();

  if (status === "reviewed" || project?.reviewed_at) return "reviewed";
  if (status === "submitted" || project?.submitted_at) return "submitted";
  if (status === "draft") return "draft";
  return "not_submitted";
}

export async function saveStudentProgress(studentId, chapterId, state) {
  if (!studentId || !chapterId || !state) {
    return { ok: false, reason: "missing-data" };
  }

  const currentStep = Math.min(6, Math.max(0, Number(state.currentStep ?? 0)));
  const percentage = state.status === "completed"
    ? 100
    : Math.round((Math.max(0, currentStep - 1) / 6) * 100);
  const catalogChapter = CHAPTER_CATALOG.find((chapter) => chapter.id === Number(chapterId) || chapter.databaseId === Number(chapterId));
  const databaseChapterId = catalogChapter?.databaseId ?? Number(chapterId);

  const payload = {
    student_id: studentId,
    chapter_id: databaseChapterId,
    current_step: currentStep,
    percentage,
    status: state.status,
    updated_at: state.updatedAt ?? new Date().toISOString(),
  };

  const { error } = await supabase
    .from("student_progress")
    .upsert(payload, { onConflict: "student_id,chapter_id" });

  if (error) {
    if (!isMissingOptionalTable(error)) {
      console.warn("MarzaLearn: failed to save student progress", error);
    }
    return { ok: false, reason: isMissingOptionalTable(error) ? "unavailable" : "error", error };
  }

  return { ok: true };
}

export function buildStudentChapterProgress(chapters, sessions = [], projects = []) {
  return chapters.map((chapter) => {
    const latestSession = sessions.find(
      (session) => Number(session.chapter_id) === Number(chapter.id) || Number(session.chapter_id) === Number(chapter.databaseId)
    );
    const latestProject = projects.find(
      (project) => Number(project.chapter_id) === Number(chapter.id) || Number(project.chapter_id) === Number(chapter.databaseId)
    );

    const missionStatus = normalizeMissionStatus(latestSession);
    const currentStep = Math.min(
      6,
      Math.max(0, Number(latestSession?.current_step ?? 0))
    );

    const missionPercent =
      missionStatus === "completed"
        ? 100
        : missionStatus === "in_progress"
          ? Math.max(8, Math.round((currentStep / 6) * 100))
          : 0;

    return {
      ...chapter,
      missionStatus,
      currentStep,
      missionPercent,
      projectStatus: normalizeProjectStatus(latestProject),
      startedAt: latestSession?.started_at ?? null,
      completedAt: latestSession?.completed_at ?? null,
      submittedAt: latestProject?.submitted_at ?? null,
    };
  });
}
