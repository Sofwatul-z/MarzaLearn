import { Outlet } from "react-router-dom";
import GradientBlob from "../components/ui/GradientBlob";
import StudentHeader from "../components/student/StudentHeader";

export default function StudentLayout() {
  return (
    <div className="ml-app-shell">
      <a
        href="#student-content"
        className="sr-only z-[100] rounded-lg bg-[#24332D] px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <GradientBlob
        tone="mint"
        size={430}
        className="-right-44 top-16 -z-20 sm:-right-28"
        opacity={0.4}
      />
      <GradientBlob
        tone="peach"
        size={330}
        className="-left-48 bottom-8 -z-20"
        opacity={0.28}
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
