import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function TeacherNavbar() {
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();

  return (
    <header className="w-full border-b border-slate-100 bg-white/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">

        <button
          onClick={() => navigate("/teacher/dashboard")}
          className="flex items-center gap-3"
        >
          <div
            className="
            w-10
            h-10
            rounded-2xl
            bg-[#23332e]
            flex
            items-center
            justify-center
            text-white
            text-sm
            font-bold
            "
          >
            ML
          </div>

          <div className="text-left">
            <h1 className="text-lg font-bold tracking-tight text-[#23332e]">
              MarzaLearn
            </h1>

            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
              Teacher Workspace
            </p>
          </div>
        </button>



        <nav className="flex items-center gap-3">

          <button
            onClick={() => navigate("/teacher/dashboard")}
            className="
            rounded-full
            bg-[#eef7f3]
            px-5
            py-2.5
            text-sm
            font-medium
            text-[#23332e]
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:shadow-sm
            "
          >
            Home
          </button>


          <button
            onClick={() => navigate("/teacher/chapters")}
            className="
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
            Chapters
          </button>



          <div
            className="
            ml-3
            flex
            items-center
            gap-3
            rounded-full
            border
            border-slate-100
            bg-white
            px-3
            py-2
            "
          >

            <div
              className="
              w-9
              h-9
              rounded-full
              bg-[#dceee7]
              flex
              items-center
              justify-center
              text-xs
              font-semibold
              text-[#23332e]
              "
            >
              {profile?.full_name?.charAt(0) || "T"}
            </div>


            <div className="hidden md:block">

              <p
                className="
                text-xs
                font-semibold
                text-[#23332e]
                "
              >
                {profile?.full_name || "Teacher"}
              </p>


              <p
                className="
                text-[10px]
                uppercase
                tracking-widest
                text-slate-400
                "
              >
                Teacher
              </p>

            </div>

          </div>




          <button
            onClick={async () => {
              await signOut();
              navigate("/login", { replace: true });
            }}
            className="
            ml-2
            text-sm
            text-slate-500
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:text-[#23332e]
            "
          >
            Sign out
          </button>


        </nav>

      </div>
    </header>
  );
}