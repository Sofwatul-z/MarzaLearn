import { useNavigate } from "react-router-dom";

export default function BackDashboard() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/teacher/dashboard")}
      className="
        inline-flex
        items-center
        gap-2
        rounded-full
        border
        border-slate-200
        bg-white
        px-5
        py-2.5
        text-sm
        font-medium
        text-[#23332e]
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:bg-slate-50
        hover:shadow-sm
      "
    >
      <span>
        ←
      </span>

      Back to Dashboard
    </button>
  );
}