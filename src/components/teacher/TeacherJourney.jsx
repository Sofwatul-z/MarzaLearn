import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CheckSquare, BarChart3 } from "lucide-react";
import Button from "../common/Button";

export default function TeacherJourney() {
  const navigate = useNavigate();

  const items = [
    {
      number: "01",
      title: "Chapter Management",
      icon: BookOpen,
      description:
        "Create, organize, and customize the 6-Step Marzano learning materials and project rubrics for your classes.",
      route: "/teacher/chapters",
      badge: "Curriculum",
    },
    {
      number: "02",
      title: "Student Review & Grading",
      icon: CheckSquare,
      description:
        "Review Project video submissions, evaluate scripts, verify checklists, and deliver scores with personalized feedback.",
      route: "/teacher/review",
      badge: "Evaluation",
    },
    {
      number: "03",
      title: "Classroom Analytics",
      icon: BarChart3,
      description:
        "Track completion rates across chapters, monitor student step progress, and pinpoint topics needing reinforcement.",
      route: "/teacher/analytics",
      badge: "Insights",
    },
  ];

  return (
    <section className="mt-14 pb-10">
      <div className="mb-8 max-w-2xl">
        <span className="ml-eyebrow">Teacher roadmap</span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-[#24332D] sm:text-4xl">
          Manage your classroom, one step at a time.
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#68766F] sm:text-base">
          Streamline your workflow from organizing curriculum chapters to reviewing student video creations and monitoring mastery.
        </p>
      </div>

      <div className="relative">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.number}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              className="grid grid-cols-[52px_minmax(0,1fr)] gap-4 sm:grid-cols-[68px_minmax(0,1fr)] sm:gap-6 group"
            >
              <div className="relative flex justify-center">
                {index < items.length - 1 && (
                  <span className="absolute bottom-0 top-12 w-px bg-[#DDE5E0]" aria-hidden="true" />
                )}
                <span
                  className={`relative z-10 grid h-11 w-11 place-items-center rounded-full border transition-all ${
                    index === 0
                      ? "border-[#24332D] bg-[#24332D] text-white"
                      : "border-[#D7E1DC] bg-[#FBFCF8] text-[#55675E] group-hover:border-[#9FB9AC] group-hover:bg-[#EAF4EF]"
                  }`}
                >
                  <Icon size={18} />
                </span>
              </div>

              <div className="border-b border-[#E3E9E5] pb-7 pt-0.5 last:border-b-0 sm:pb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8A9690]">
                      Phase {item.number} · {item.badge}
                    </span>
                  </div>
                  <h3 className="mt-1 text-xl font-extrabold tracking-[-0.03em] text-[#24332D] group-hover:text-emerald-900 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-xs sm:text-sm leading-6 text-[#62736B]">
                    {item.description}
                  </p>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(item.route)}
                  className="self-start sm:self-center shrink-0 group-hover:bg-[#24332D] group-hover:text-white hover:!bg-[#24332D] hover:!text-white transition-all"
                >
                  Open <ArrowRight size={15} />
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
