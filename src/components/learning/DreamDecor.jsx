import { motion } from "framer-motion";

const BLOB_TONES = {
  lavender: "rgba(196, 181, 253, 0.55)",
  pink: "rgba(251, 207, 232, 0.5)",
  violet: "rgba(167, 139, 250, 0.42)",
  cream: "rgba(253, 230, 138, 0.35)",
  white: "rgba(255, 255, 255, 0.7)",
};

export default function DreamDecor({
  src,
  alt = "",
  className = "",
  imgClassName = "h-auto w-full object-contain",
  blob = "lavender",
  blobScale = 1.15,
  rotate = 0,
  opacity = 1,
  float = true,
  duration = 6.2,
  delay = 0,
}) {
  const blobColor = BLOB_TONES[blob] || BLOB_TONES.lavender;

  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
      style={{ opacity }}
      animate={
        float
          ? { y: [0, -10, 0], rotate: [rotate - 2.4, rotate + 2.4, rotate - 2.4] }
          : { rotate }
      }
      transition={
        float
          ? { duration, delay, repeat: Infinity, ease: "easeInOut" }
          : undefined
      }
    >
      <span className="relative block">
        <span
          className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
          style={{
            width: `${blobScale * 100}%`,
            height: `${blobScale * 78}%`,
            backgroundColor: blobColor,
          }}
        />
        <span
          className="absolute left-[18%] top-[22%] -z-10 h-[38%] w-[38%] rounded-[42%] opacity-70 blur-xl"
          style={{ backgroundColor: BLOB_TONES.white }}
        />
        <img src={src} alt={alt} className={`relative z-10 ${imgClassName}`} />
      </span>
    </motion.div>
  );
}
