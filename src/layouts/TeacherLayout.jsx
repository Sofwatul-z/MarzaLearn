import { Outlet } from "react-router-dom";
import GradientBlob from "../components/ui/GradientBlob";

export default function TeacherLayout() {
  return (
    <div className="ml-app-shell">
      <a
        href="#teacher-content"
        className="sr-only z-[100] rounded-lg bg-[#24332D] px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <GradientBlob
        tone="mint"
        size={380}
        className="-right-40 top-10 -z-20"
        opacity={0.34}
      />
      <GradientBlob
        tone="peach"
        size={360}
        className="-left-52 top-[46%] -z-20"
        opacity={0.25}
        delay={1}
      />

      <main
        id="teacher-content"
        className="ml-page-container relative z-10 py-5 sm:py-7 lg:py-9"
      >
        <Outlet />
      </main>
    </div>
  );
}
