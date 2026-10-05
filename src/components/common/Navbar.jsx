import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Button from "./Button";
import Logo from "./Logo";

const links = [
  ["Home", "#home"],
  ["Journey", "#journey"],
  ["About", "#about"],
];

export default function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-30 px-4 pt-4 sm:px-6 lg:px-10"
    >
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between rounded-[20px] border border-white/80 bg-white/72 px-4 py-3 shadow-[0_12px_40px_rgba(36,51,45,0.06)] backdrop-blur-xl sm:px-5">
        <Logo />

        <div className="hidden items-center gap-1 lg:flex">
          {links.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#68766F] transition-colors hover:bg-[#EAF4EF] hover:text-[#24332D]"
            >
              {label}
            </a>
          ))}
        </div>

        <Button as={Link} to="/login" size="sm" className="group">
          <span className="text-white">Login</span>
          <ArrowRight
            size={15}
            className="text-white transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Button>
      </nav>
    </motion.header>
  );
}
