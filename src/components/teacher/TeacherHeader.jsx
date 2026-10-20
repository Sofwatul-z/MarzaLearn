import { LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../common/Logo";
import Button from "../common/Button";
import { useAuth } from "../../hooks/useAuth";

function TeacherNavItem({ to, label, active }) {
  return (
    <Link
      to={to}
      className={`relative rounded-full px-4 py-2 text-sm font-bold transition-colors ${
        active
          ? "bg-[#EAF4EF] text-[#24332D]"
          : "text-[#6C7973] hover:bg-white/70 hover:text-[#24332D]"
      }`}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );
}

export default function TeacherHeader() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const homeActive = location.pathname === "/teacher/dashboard";
  const chaptersActive =
    location.pathname === "/teacher/chapters" ||
    location.pathname.startsWith("/teacher/chapters/");
  const studentsActive = location.pathname === "/teacher/students";
  const reviewActive = location.pathname === "/teacher/review";
  const analyticsActive = location.pathname === "/teacher/analytics";

  const initials = (profile?.full_name ?? "Teacher")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  async function handleLogout() {
    await signOut();
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-40 -mx-3 mb-7 border-b border-[#E8ECE9]/80 bg-[#FBFCF8]/[0.82] px-3 py-3 backdrop-blur-xl sm:-mx-5 sm:px-5 lg:-mx-7 lg:px-7">
      <div className="mx-auto flex w-full max-w-[1440px] items-center gap-3">
        <Logo to="/teacher/dashboard" />

        <nav
          className="ml-auto hidden items-center gap-1 rounded-full border border-[#E3E9E5] bg-white/70 p-1 shadow-[0_8px_22px_rgba(36,51,45,0.04)] md:flex"
          aria-label="Teacher navigation"
        >
          <TeacherNavItem to="/teacher/dashboard" label="Home" active={homeActive} />
          <TeacherNavItem to="/teacher/chapters" label="Chapters" active={chaptersActive} />
          <TeacherNavItem to="/teacher/students" label="Students" active={studentsActive} />
          <TeacherNavItem to="/teacher/review" label="Review" active={reviewActive} />
          <TeacherNavItem to="/teacher/analytics" label="Analytics" active={analyticsActive} />
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-3">
          <div className="hidden items-center gap-2.5 rounded-full border border-[#DDE5E0] bg-white/80 py-1.5 pl-1.5 pr-3 sm:flex">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#CFE8DD] text-[11px] font-extrabold tracking-[-0.03em] text-[#24332D]">
              {initials || "T"}
            </span>
            <div className="max-w-28 leading-tight lg:max-w-40">
              <p className="truncate text-xs font-extrabold text-[#24332D]">
                {profile?.full_name ?? "Teacher"}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-[#7C8983]">
                Teacher · Workspace
              </p>
            </div>
          </div>

          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="h-10 w-10 px-0 sm:h-auto sm:w-auto sm:px-4"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut size={16} />
            <span className="hidden lg:inline">Sign out</span>
          </Button>
        </div>
      </div>

      <nav
        className="mt-3 flex items-center gap-1 overflow-x-auto pb-0.5 md:hidden"
        aria-label="Teacher mobile navigation"
      >
        <TeacherNavItem to="/teacher/dashboard" label="Home" active={homeActive} />
        <TeacherNavItem to="/teacher/chapters" label="Chapters" active={chaptersActive} />
        <TeacherNavItem to="/teacher/students" label="Students" active={studentsActive} />
        <TeacherNavItem to="/teacher/review" label="Review" active={reviewActive} />
        <TeacherNavItem to="/teacher/analytics" label="Analytics" active={analyticsActive} />
      </nav>
    </header>
  );
}
