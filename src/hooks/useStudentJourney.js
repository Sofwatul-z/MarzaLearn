import { useEffect, useMemo, useState } from "react";
import { getChapters } from "../services/chapter";
import {
  buildStudentChapterProgress,
  getStudentLearningSessions,
  getStudentProgressRows,
  getStudentProjectSubmissions,
} from "../services/progress";
import { useAuth } from "./useAuth";

export default function useStudentJourney() {
  const { user } = useAuth();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadJourney() {
      setLoading(true);
      setError(null);

      try {
        const chapterData = await getChapters();
        const [sessions, projects, dbProgressRows] = await Promise.all([
          getStudentLearningSessions(user?.id),
          getStudentProjectSubmissions(user?.id),
          getStudentProgressRows(user?.id),
        ]);

        if (!active) return;

        setChapters(
          buildStudentChapterProgress(
            chapterData,
            sessions,
            projects,
            dbProgressRows
          )
        );
      } catch (loadError) {
        if (!active) return;
        console.error("Failed to load student journey:", loadError);
        setError(loadError);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadJourney();

    function handleReset() {
      loadJourney();
    }
    window.addEventListener("marzalearn:session-reset", handleReset);

    return () => {
      active = false;
      window.removeEventListener("marzalearn:session-reset", handleReset);
    };
  }, [user?.id]);

  const summary = useMemo(() => {
    const completedMissions = chapters.filter(
      (chapter) => chapter.missionStatus === "completed"
    ).length;
    const submittedProjects = chapters.filter((chapter) =>
      ["submitted", "reviewed"].includes(chapter.projectStatus)
    ).length;
    const reviewedProjects = chapters.filter(
      (chapter) => chapter.projectStatus === "reviewed"
    ).length;

    const currentChapter =
      chapters.find((chapter) => chapter.missionStatus === "in_progress") ??
      chapters.find((chapter) => chapter.missionStatus === "not_started") ??
      chapters.at(-1) ??
      null;

    return {
      completedMissions,
      submittedProjects,
      reviewedProjects,
      currentChapter,
      totalChapters: chapters.length,
    };
  }, [chapters]);

  return { chapters, summary, loading, error };
}
