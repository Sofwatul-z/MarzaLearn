import { LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../common/Logo";
import Button from "../common/Button";
import { useAuth } from "../../hooks/useAuth";
import { getChapterTheme } from "../../data/chapterThemes";

function StudentNavItem({ to, label, active, night = false }) {
  return (
    <Link
      to={to}
      className={`relative rounded-full px-4 py-2 text-sm font-bold transition-colors ${
        active
          ? night
            ? "bg-[#5B21B6] text-white shadow-[0_8px_18px_rgba(91,33,182,0.28)]"
            : "bg-[#EAF4EF] text-[#24332D]"
          : night
            ? "text-[#7C6A99] hover:bg-violet-50 hover:text-[#5B21B6]"
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
  const isChapter4Landing = /^\/student\/chapter\/4\/?$/.test(location.pathname);
  const isChapter4Session = /^\/student\/chapter\/4\/session\/?$/.test(location.pathname);
  const isChapter4Dream = isChapter4Landing || isChapter4Session;

  const chapterMatch = location.pathname.match(/\/student\/chapter\/(\d+)/);
  const theme = getChapterTheme(chapterMatch ? Number(chapterMatch[1]) : 1);
  const headerTheme = isChapter4Dream ? theme : undefined;

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
      <header
        className={`sticky top-0 z-40 -mx-3 mb-5 px-3 py-3 backdrop-blur-xl sm:-mx-5 sm:px-5 lg:-mx-7 lg:px-7 ${
          isChapter4Session
            ? "border-b border-violet-200/70 bg-[#F5F3FF]/[0.88]"
            : "border-b border-[#E8ECE9]/80 bg-[#FBFCF8]/[0.9]"
        }`}
      >
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-3">
          <Logo to={location.pathname} theme={headerTheme} />
          
          <div className="flex items-center gap-2">
            <div
              style={{ borderColor: theme?.borderSoft || "#D7E2DC", backgroundColor: theme?.badgeBg || "rgba(255,255,255,0.75)" }}
              className="flex items-center gap-2 rounded-full border px-3 py-1.5"
            >
              <span style={{ backgroundColor: theme?.primary || "#8EBEAA" }} className="h-2 w-2 rounded-full" aria-hidden="true" />
              <div className="leading-tight">
                <p style={{ color: theme?.primaryDark || "#6F7D76" }} className="text-[10px] font-extrabold uppercase tracking-[0.12em]">Focus session</p>
                <p style={{ color: theme?.primaryMuted || "#98A29D" }} className="hidden text-[10px] font-semibold sm:block">Navigation is simplified until the mission is finished.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition active:scale-95 shadow-2xs ${
                isChapter4Session
                  ? "border-violet-300 bg-white/90 text-violet-700 hover:bg-violet-50"
                  : "border-[#DDE5E0] bg-white text-[#4A5D54] hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200"
              }`}
              aria-label="Logout"
              title="Sign out"
            >
              <LogOut size={13} className="text-[#944A40]" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>
    );
  }
  return (
    <header
      className={`sticky top-0 z-40 -mx-3 mb-7 px-3 py-3 backdrop-blur-xl sm:-mx-5 sm:px-5 lg:-mx-7 lg:px-7 ${
        isChapter4Landing
          ? "border-b border-violet-200/70 bg-[#F5F3FF]/[0.82]"
          : "border-b border-[#E8ECE9]/80 bg-[#FBFCF8]/[0.82]"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-3">
        <Logo to="/student/dashboard" theme={headerTheme} />

        <nav
          className={`hidden items-center gap-1 rounded-full border p-1 sm:flex ${
            isChapter4Landing
              ? "border-violet-200 bg-white/85 shadow-[0_8px_22px_rgba(91,33,182,0.08)]"
              : "border-[#E3E9E5] bg-white/70 shadow-[0_8px_22px_rgba(36,51,45,0.04)]"
          }`}
          aria-label="Student navigation"
        >
          <StudentNavItem to="/student/dashboard" label="Home" active={homeActive} night={isChapter4Landing} />
          <StudentNavItem to="/student/chapters" label="Chapters" active={chaptersActive} night={isChapter4Landing} />
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop profile badge */}
          <div
            className={`hidden items-center gap-2.5 rounded-full border py-1.5 pl-1.5 pr-3 sm:flex ${
              isChapter4Landing ? "border-violet-200 bg-white/90" : "border-[#DDE5E0] bg-white/80"
            }`}
          >
            <span
              className="grid h-8 w-8 place-items-center rounded-full text-[11px] font-extrabold tracking-[-0.03em]"
              style={
                isChapter4Landing
                  ? { backgroundColor: theme.primaryDark, color: "#fff" }
                  : { backgroundColor: "#CFE8DD", color: "#24332D" }
              }
            >
              {initials || "S"}
            </span>
            <div className="max-w-28 leading-tight lg:max-w-40">
              <p
                className="truncate text-xs font-extrabold"
                style={{ color: isChapter4Landing ? theme.primaryDark : "#24332D" }}
              >
                {profile?.full_name ?? "Student"}
              </p>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.11em]"
                style={{ color: isChapter4Landing ? theme.primaryMuted : "#7C8983" }}
              >
                Class {profile?.class_name ?? "—"}
              </p>
            </div>
          </div>

          {/* Logout Button (Clear, prominent, visible on BOTH Mobile and Desktop) */}
          <button
            type="button"
            onClick={handleLogout}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition active:scale-95 shadow-2xs ${
              isChapter4Landing
                ? "border-violet-300 bg-white/90 text-violet-700 hover:bg-violet-50"
                : "border-[#DDE5E0] bg-white text-[#4A5D54] hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200"
            }`}
            aria-label="Logout"
            title="Sign out"
          >
            <LogOut size={13} className="text-[#944A40]" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Row 2: Navigation Pills & Student Information Badge */}
      <nav
        className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100/80 pt-2.5 sm:hidden"
        aria-label="Student mobile navigation"
      >
        <div className="flex items-center gap-1 shrink-0">
          <StudentNavItem to="/student/dashboard" label="Home" active={homeActive} night={isChapter4Landing} />
          <StudentNavItem to="/student/chapters" label="Chapters" active={chaptersActive} night={isChapter4Landing} />
        </div>

        {/* Mobile Student Profile Badge: Displays Avatar + Full Student Name + Class */}
        <div
          className={`flex items-center gap-2 rounded-full border py-1 pl-1.5 pr-2.5 shadow-2xs min-w-0 max-w-[210px] ${
            isChapter4Landing ? "border-violet-200 bg-white/90" : "border-[#DDE5E0] bg-white/90"
          }`}
          title={`${profile?.full_name ?? "Student"} (Class ${profile?.class_name ?? "—"})`}
        >
          <span
            className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-extrabold"
            style={
              isChapter4Landing
                ? { backgroundColor: theme.primaryDark, color: "#fff" }
                : { backgroundColor: "#CFE8DD", color: "#24332D" }
            }
          >
            {initials || "S"}
          </span>
          <div className="min-w-0 leading-tight">
            <p
              className="truncate text-[11px] font-extrabold"
              style={{ color: isChapter4Landing ? theme.primaryDark : "#24332D" }}
            >
              {profile?.full_name ?? "Student"}
            </p>
            <p
              className="truncate text-[9px] font-bold uppercase tracking-[0.06em]"
              style={{ color: isChapter4Landing ? theme.primaryMuted : "#7C8983" }}
            >
              Class {profile?.class_name ?? "—"}
            </p>
          </div>
        </div>
      </nav>
    </header>
  );
}
