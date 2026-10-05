import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Logo from "../components/common/Logo";
import GradientBlob from "../components/ui/GradientBlob";

export default function AuthLayout({ children }) {
  return (
    <div className="ml-app-shell flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <GradientBlob
        tone="mint"
        size={440}
        className="-right-44 -top-24 -z-20"
        opacity={0.48}
      />
      <GradientBlob
        tone="peach"
        size={340}
        className="-bottom-28 -left-36 -z-20"
        opacity={0.32}
        delay={1.4}
      />

      <div className="relative z-10 w-full max-w-[480px]">
        <div className="mb-7 flex items-center justify-between px-1">
          <Logo />
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-[#6C7973] transition-colors hover:bg-white/70 hover:text-[#24332D]"
          >
            <ArrowLeft size={16} />
            Home
          </Link>
        </div>

        {children}

        <p className="mt-6 text-center text-xs font-medium leading-relaxed text-[#89958F]">
          MarzaLearn · English learning for Class XC & XD
        </p>
      </div>
    </div>
  );
}
