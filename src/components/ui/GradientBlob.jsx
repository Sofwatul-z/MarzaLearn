import { motion } from "framer-motion";

const tones = {
  mint: "bg-[#CFE8DD]",
  peach: "bg-[#F4D7C5]",
  cream: "bg-[#F3F0D8]",
};

export default function GradientBlob({
  tone = "mint",
  size = 360,
  className = "",
  animate = true,
  delay = 0,
  opacity = 0.46,
}) {
  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full blur-[80px] ${
        tones[tone] ?? tones.mint
      } ${className}`}
      style={{ width: size, height: size, opacity }}
      animate={animate ? { x: [0, 18, -8, 0], y: [0, -14, 12, 0] } : undefined}
      transition={
        animate
          ? {
              duration: 13,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }
          : undefined
      }
    />
  );
}
