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
      if (!session?.status || session.status === "not_started" || session.status === "reset") continue;

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

export async function getStudentProgressRows(studentId) {
  if (!studentId) return [];
  return safelyLoad(
    supabase
      .from("student_progress")
      .select("*")
      .eq("student_id", studentId),
    "student_progress table"
  );
}

export async function getStudentProjectSubmissions(studentId) {
  if (!studentId) return [];

  const cloud = await safelyLoad(
    supabase
      .from("project_submissions")
      .select("*")
      .eq("student_id", studentId)
      .order("submitted_at", { ascending: false }),
    "project submissions"
  );

  let local = [];
  try {
    const all = JSON.parse(localStorage.getItem("marzalearn-all-projects") || "[]");
    local = all.filter((p) => p.student_id === studentId);
  } catch (e) {}

  const seen = new Set(cloud.map((p) => Number(p.chapter_id)));
  return [...cloud, ...local.filter((p) => !seen.has(Number(p.chapter_id)))];
}

export async function submitStudentProject({
  studentId,
  chapterId,
  studentName,
  className,
  attendanceNumber,
  scriptText,
  videoUrl,
  checklist = [],
}) {
  if (!studentId || !chapterId || !videoUrl) {
    return { ok: false, error: new Error("Missing required fields") };
  }

  const payload = {
    student_id: studentId,
    chapter_id: Number(chapterId),
    student_name: studentName || "Student",
    class_name: className || "XC",
    attendance_number: attendanceNumber || "01",
    script_text: scriptText || "",
    video_url: videoUrl,
    checklist,
    status: "submitted",
    submitted_at: new Date().toISOString(),
  };

  try {
    const key = `marzalearn-project:${studentId}:${chapterId}`;
    localStorage.setItem(key, JSON.stringify(payload));

    const allKey = "marzalearn-all-projects";
    const existing = JSON.parse(localStorage.getItem(allKey) || "[]");
    const idx = existing.findIndex(
      (p) => p.student_id === studentId && Number(p.chapter_id) === Number(chapterId)
    );
    if (idx >= 0) existing[idx] = payload;
    else existing.push(payload);
    localStorage.setItem(allKey, JSON.stringify(existing));
  } catch (e) {}

  const { data, error } = await supabase
    .from("project_submissions")
    .upsert(payload, { onConflict: "student_id,chapter_id" })
    .select()
    .single();

  if (error) {
    console.warn("Supabase project submission warning (using local fallback):", error);
    return { ok: true, isLocal: true, data: payload };
  }

  return { ok: true, data };
}

export async function getProjectSubmission(studentId, chapterId) {
  if (!studentId || !chapterId) return null;

  const { data } = await supabase
    .from("project_submissions")
    .select("*")
    .eq("student_id", studentId)
    .eq("chapter_id", Number(chapterId))
    .maybeSingle();

  if (data) return data;

  try {
    const key = `marzalearn-project:${studentId}:${chapterId}`;
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  return null;
}

export async function getAllProjectSubmissions(className = "XC") {
  const { data } = await supabase
    .from("project_submissions")
    .select("*")
    .order("submitted_at", { ascending: false });

  let list = data || [];

  try {
    const local = JSON.parse(localStorage.getItem("marzalearn-all-projects") || "[]");
    const ids = new Set(list.map((p) => `${p.student_id}-${p.chapter_id}`));
    local.forEach((lp) => {
      if (!ids.has(`${lp.student_id}-${lp.chapter_id}`)) {
        list.push(lp);
      }
    });
  } catch (e) {}

  if (className) {
    list = list.filter(
      (p) => !p.class_name || p.class_name.toUpperCase() === className.toUpperCase()
    );
  }
  return list;
}

export async function gradeProjectSubmission({
  submissionId,
  studentId,
  chapterId,
  score,
  feedback,
}) {
  const payload = {
    score: Number(score),
    feedback: feedback || "",
    status: "reviewed",
    reviewed_at: new Date().toISOString(),
  };

  if (submissionId) {
    await supabase.from("project_submissions").update(payload).eq("id", submissionId);
  } else if (studentId && chapterId) {
    await supabase
      .from("project_submissions")
      .update(payload)
      .eq("student_id", studentId)
      .eq("chapter_id", Number(chapterId));
  }

  try {
    const allKey = "marzalearn-all-projects";
    const existing = JSON.parse(localStorage.getItem(allKey) || "[]");
    const idx = existing.findIndex(
      (p) =>
        (submissionId && p.id === submissionId) ||
        (p.student_id === studentId && Number(p.chapter_id) === Number(chapterId))
    );
    if (idx >= 0) {
      existing[idx] = { ...existing[idx], ...payload };
      localStorage.setItem(allKey, JSON.stringify(existing));
    }
  } catch (e) {}

  return { ok: true };
}

function normalizeMissionStatus(session) {
  const status = session?.status?.toLowerCase();

  if (status === "reset" || status === "not_started") return "not_started";
  if (status === "completed" || session?.completed_at) return "completed";
  if (status === "in_progress" || status === "active") return "in_progress";
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

  // Daftar langkah selesai harus tersedia.
  // Jangan menebak penyelesaian dari langkah yang sedang dibuka.
  if (!Array.isArray(state.completedSteps)) {
    return {
      ok: false,
      reason: "invalid-completed-steps",
      error: new Error("state.completedSteps harus berupa array."),
    };
  }

  const stepNames = [
    "provide",
    "restate",
    "visualize",
    "engage",
    "discuss",
    "play",
  ];

  const completedNames = new Set();

  for (const value of state.completedSteps) {
    let stepName = null;

    // Mendukung nomor urutan langkah 1–6.
    if (
      typeof value === "number" &&
      Number.isInteger(value) &&
      value >= 1 &&
      value <= 6
    ) {
      stepName = stepNames[value - 1];
    }

    // Mendukung nama langkah atau nomor urutan berupa teks.
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();

      if (/^[1-6]$/.test(normalized)) {
        stepName = stepNames[Number(normalized) - 1];
      } else {
        stepName = normalized === "games" ? "play" : normalized;
      }
    }

    if (!stepNames.includes(stepName)) {
      return {
        ok: false,
        reason: "invalid-completed-step",
        error: new Error(
          "Isi completedSteps tidak dikenali. Gunakan nama langkah " +
          "atau nomor urutan 1–6, bukan ID baris database."
        ),
      };
    }

    completedNames.add(stepName);
  }

  const catalogChapter = CHAPTER_CATALOG.find(
    (chapter) =>
      chapter.id === Number(chapterId) ||
      chapter.databaseId === Number(chapterId)
  );

  const databaseChapterId =
    catalogChapter?.databaseId ?? Number(chapterId);

  if (
    !Number.isInteger(databaseChapterId) ||
    databaseChapterId <= 0
  ) {
    return { ok: false, reason: "invalid-chapter-id" };
  }

  const payload = {
    student_id: studentId,
    chapter_id: databaseChapterId,
    provide: completedNames.has("provide"),
    restate: completedNames.has("restate"),
    visualize: completedNames.has("visualize"),
    engage: completedNames.has("engage"),
    discuss: completedNames.has("discuss"),
    play: completedNames.has("play"),
    percentage: Math.round((completedNames.size / 6) * 100),
  };

  const { error } = await supabase
    .from("student_progress")
    .upsert(payload, { onConflict: "student_id,chapter_id" });

  if (error) {
    console.warn("MarzaLearn: failed to save student progress", error);

    return {
      ok: false,
      reason: isMissingOptionalTable(error)
        ? "unavailable"
        : "error",
      error,
    };
  }

  return { ok: true };
}

export function buildStudentChapterProgress(
  chapters,
  sessions = [],
  projects = [],
  dbProgressRows = []
) {
  return chapters.map((chapter) => {
    const latestSession = sessions.find(
      (session) =>
        Number(session.chapter_id) === Number(chapter.id) ||
        Number(session.chapter_id) === Number(chapter.databaseId)
    );
    const latestProject = projects.find(
      (project) =>
        Number(project.chapter_id) === Number(chapter.id) ||
        Number(project.chapter_id) === Number(chapter.databaseId)
    );
    const dbRow = dbProgressRows.find(
      (row) =>
        Number(row.chapter_id) === Number(chapter.id) ||
        Number(row.chapter_id) === Number(chapter.databaseId)
    );

    const sessionMissionStatus = normalizeMissionStatus(latestSession);
    const sessionStep = Math.min(
      6,
      Math.max(0, Number(latestSession?.current_step ?? 0))
    );
    const sessionPercent =
      sessionMissionStatus === "completed"
        ? 100
        : sessionMissionStatus === "in_progress"
          ? Math.max(8, Math.round((sessionStep / 6) * 100))
          : 0;

    let dbPercent = 0;
    let dbStep = 0;
    if (dbRow) {
      dbPercent = Number(dbRow.percentage ?? 0);
      let count = 0;
      if (dbRow.provide) count++;
      if (dbRow.restate) count++;
      if (dbRow.visualize) count++;
      if (dbRow.engage) count++;
      if (dbRow.discuss) count++;
      if (dbRow.play) count++;
      dbStep = count;
      if (dbPercent === 0 && count > 0) {
        dbPercent = Math.round((count / 6) * 100);
      }
    }

    const missionPercent = Math.max(sessionPercent, dbPercent);
    const currentStep = Math.max(sessionStep, dbStep);
    const missionStatus =
      missionPercent >= 100 || sessionMissionStatus === "completed"
        ? "completed"
        : missionPercent > 0
          ? "in_progress"
          : "not_started";

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
