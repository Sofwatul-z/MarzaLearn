import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "../components/common/Logo";
import GradientBlob from "../components/ui/GradientBlob";

import loginCharacter from "../assets/chapter 1/step 1/assets/card-character.png";
import loginShoes from "../assets/chapter 1/step 1/assets/decoration-shoes.png";
import loginShuttle from "../assets/chapter 1/step 1/assets/decoration-racket-shuttle.png";

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

      <div className="relative z-10 w-full max-w-[920px]">
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

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-center">
          <div>
            {children}
          </div>

          {/* Right Showcase Column with floating illustration */}
          <div className="hidden lg:flex flex-col items-center text-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-full bg-[#CFE8DD]/60 blur-2xl -z-10" />
              <img
                src={loginCharacter}
                alt="MarzaLearn Mascot"
                className="w-56 h-auto object-contain drop-shadow-[0_24px_50px_rgba(36,51,45,0.22)] select-none pointer-events-none"
              />

              {/* Floating accessories */}
              <motion.img
                src={loginShuttle}
                alt=""
                animate={{ y: [0, 8, 0], rotate: [0, 8, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="absolute -top-3 -right-4 w-14 h-14 object-contain drop-shadow-md select-none pointer-events-none"
              />

              <motion.img
                src={loginShoes}
                alt=""
                animate={{ y: [0, -6, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 5.0, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                className="absolute -bottom-2 -left-4 w-14 h-14 object-contain drop-shadow-md select-none pointer-events-none"
              />
            </motion.div>

            <div className="mt-7 max-w-[280px] rounded-2xl border border-[#D7E3DC] bg-white/80 p-4 shadow-sm backdrop-blur-sm">
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-[#597165]">
                <Sparkles size={12} className="text-yellow-500" /> Marzano Method
              </span>
              <p className="mt-1 text-xs font-semibold leading-relaxed text-[#4A5D54]">
                Learn English vocabulary with 6 connected activities and create real-world video projects!
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs font-medium leading-relaxed text-[#89958F]">
          MarzaLearn · English learning for Class XC & XD
        </p>
      </div>
    </div>
  );
}
