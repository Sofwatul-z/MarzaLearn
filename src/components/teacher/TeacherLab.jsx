import { motion } from "framer-motion";

export default function TeacherLab() {
  const labels = [
    {
      text: "manage",
      position: "top-4 left-1/2 -translate-x-1/2",
    },
    {
      text: "review",
      position: "top-20 right-0",
    },
    {
      text: "analyze",
      position: "bottom-20 right-0",
    },
    {
      text: "guide",
      position: "bottom-8 left-8",
    },
    {
      text: "create",
      position: "top-20 left-0",
    },
  ];

  return (
    <motion.div
      animate={{
        y: [0, -8, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
      }}
      className="
      relative
      w-72
      h-72
      flex
      items-center
      justify-center
      "
    >

      {labels.map((item) => (
        <div
          key={item.text}
          className={`
          absolute
          ${item.position}
          rounded-full
          border
          border-slate-200
          bg-white
          px-4
          py-2
          text-[11px]
          font-medium
          text-slate-500
          shadow-sm
          `}
        >
          {item.text}
        </div>
      ))}


      <div
        className="
        absolute
        inset-5
        rounded-full
        border
        border-dashed
        border-[#b9d8cd]
        "
      />


      <div
        className="
        absolute
        inset-12
        rounded-full
        border
        border-[#f3d7c9]
        "
      />


      <div
        className="
        relative
        w-44
        h-44
        rounded-full
        bg-[#dceee7]
        flex
        items-center
        justify-center
        "
      >

        <div
          className="
          text-center
          "
        >

          <div
            className="
            w-24
            h-24
            mx-auto
            rounded-full
            bg-white
            flex
            items-center
            justify-center
            text-5xl
            shadow-sm
            "
          >
            👩‍🏫
          </div>


          <p
            className="
            mt-4
            text-[11px]
            uppercase
            tracking-[0.22em]
            font-semibold
            text-[#527267]
            "
          >
            Teacher Lab
          </p>

        </div>

      </div>


      <div
        className="
        absolute
        bottom-5
        left-1/2
        -translate-x-1/2
        w-2
        h-2
        rounded-full
        bg-[#23332e]
        "
      />

    </motion.div>
  );
}