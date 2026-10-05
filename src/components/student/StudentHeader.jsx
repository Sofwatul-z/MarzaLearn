import { LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../common/Logo";
import Button from "../common/Button";
import { useAuth } from "../../hooks/useAuth";

function StudentNavItem({ to, label, active }) {
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

export default function StudentHeader() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const homeActive = location.pathname === "/student/dashboard";
  const chaptersActive =
    location.pathname === "/student/chapters" ||
    location.pathname.startsWith("/student/chapter/");
  const focusSession = /\/student\/chapter\/[^/]+\/session\/?$/.test(location.pathname);

  const initials = (profile?.full_name ?? "Student")
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


  if (focusSession) {
    return (
      <header className="sticky top-0 z-40 -mx-3 mb-5 border-b border-[#E8ECE9]/80 bg-[#FBFCF8]/[0.9] px-3 py-3 backdrop-blur-xl sm:-mx-5 sm:px-5 lg:-mx-7 lg:px-7">
        <div className="mx-auto flex w-full max-w-[1440px] items-center gap-3">
          <Logo to={location.pathname} />
          <div className="ml-auto flex items-center gap-2 rounded-full border border-[#D7E2DC] bg-white/75 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-[#8EBEAA]" aria-hidden="true" />
            <div className="leading-tight">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#6F7D76]">Focus session</p>
              <p className="hidden text-[10px] font-semibold text-[#98A29D] sm:block">Navigation is simplified until the mission is finished.</p>
            </div>
          </div>
        </div>
      </header>
    );
  }
  return (
    <header className="sticky top-0 z-40 -mx-3 mb-7 border-b border-[#E8ECE9]/80 bg-[#FBFCF8]/[0.82] px-3 py-3 backdrop-blur-xl sm:-mx-5 sm:px-5 lg:-mx-7 lg:px-7">
      <div className="mx-auto flex w-full max-w-[1440px] items-center gap-3">
        <Logo to="/student/dashboard" />

        <nav
          className="ml-auto hidden items-center gap-1 rounded-full border border-[#E3E9E5] bg-white/70 p-1 shadow-[0_8px_22px_rgba(36,51,45,0.04)] sm:flex"
          aria-label="Student navigation"
        >
          <StudentNavItem to="/student/dashboard" label="Home" active={homeActive} />
          <StudentNavItem to="/student/chapters" label="Chapters" active={chaptersActive} />
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:ml-3">
          <div className="hidden items-center gap-2.5 rounded-full border border-[#DDE5E0] bg-white/80 py-1.5 pl-1.5 pr-3 sm:flex">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#CFE8DD] text-[11px] font-extrabold tracking-[-0.03em] text-[#24332D]">
              {initials || "S"}
            </span>
            <div className="max-w-28 leading-tight lg:max-w-40">
              <p className="truncate text-xs font-extrabold text-[#24332D]">
                {profile?.full_name ?? "Student"}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-[#7C8983]">
                Class {profile?.class_name ?? "—"}
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
        className="mt-3 flex items-center gap-1 overflow-x-auto pb-0.5 sm:hidden"
        aria-label="Student mobile navigation"
      >
        <StudentNavItem to="/student/dashboard" label="Home" active={homeActive} />
        <StudentNavItem to="/student/chapters" label="Chapters" active={chaptersActive} />
        <span className="ml-auto whitespace-nowrap rounded-full bg-[#EAF4EF] px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#52625B]">
          {profile?.class_name ?? "Student"}
        </span>
      </nav>
    </header>
  );
}
