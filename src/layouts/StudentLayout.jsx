import { Outlet, useLocation } from "react-router-dom";
import GradientBlob from "../components/ui/GradientBlob";
import StudentHeader from "../components/student/StudentHeader";
import { getChapterTheme } from "../data/chapterThemes";

export default function StudentLayout() {
  const location = useLocation();
  const match = location.pathname.match(/\/student\/chapter\/(\d+)/);
  const chapterId = match ? Number(match[1]) : 1;
  const theme = getChapterTheme(chapterId);

  return (
    <div className="ml-app-shell">
      <a
        href="#student-content"
        className="sr-only z-[100] rounded-lg bg-[#24332D] px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <GradientBlob
        color={theme?.primary || "#EAC3D5"}
        size={460}
        className="-right-44 top-16 -z-20 sm:-right-28"
        opacity={0.42}
      />
      <GradientBlob
        color={theme?.accent || "#F4D7C5"}
        size={350}
        className="-left-48 bottom-8 -z-20"
        opacity={0.30}
        delay={1.5}
      />

      <div className="ml-page-container relative z-10">
        <StudentHeader />
        <main id="student-content" className="pb-12 sm:pb-16 lg:pb-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
