import { motion } from "framer-motion";

const shapes = {
  circle: "rounded-full",
  squircle: "rounded-[32%]",
  pill: "rounded-full",
};

const tones = {
  mint: "border-[#AFCFC0] bg-[#EAF4EF]",
  peach: "border-[#E8C7B4] bg-[#FBEDE4]",
  dark: "border-[#24332D] bg-[#24332D]",
};

export default function FloatingShape({
  shape = "circle",
  tone = "mint",
  size = 56,
  className = "",
  duration = 8,
  delay = 0,
  rotate = 8,
}) {
  return (
    <motion.span
      aria-hidden="true"
      className={`pointer-events-none absolute border ${shapes[shape] ?? shapes.circle} ${
        tones[tone] ?? tones.mint
      } ${className}`}
      style={{ width: size, height: shape === "pill" ? size * 0.48 : size }}
      animate={{ y: [0, -10, 0], rotate: [-rotate, rotate, -rotate] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
