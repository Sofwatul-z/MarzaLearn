import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import TeacherNavbar from "../../components/teacher/TeacherNavbar";
import TeacherLab from "../../components/teacher/TeacherLab";
import TeacherJourney from "../../components/teacher/TeacherJourney";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const stats = [
    {
      label: "Students",
      value: "1",
    },
    {
      label: "Pending Review",
      value: "0",
    },
    {
      label: "Average Score",
      value: "-",
    },
    {
      label: "Notifications",
      value: "0",
    },
  ];

  return (
    <section className="min-h-screen bg-white relative overflow-hidden">

      <div className="
        absolute
        -top-40
        -right-40
        w-96
        h-96
        rounded-full
        bg-[#dff3e8]/50
        blur-3xl
      " />

      <TeacherNavbar />

      <main className="max-w-6xl mx-auto px-8 py-10 relative z-10">

        <section className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-8
          items-center
        ">

          <div>

            <p className="
              text-[11px]
              uppercase
              tracking-[0.2em]
              font-semibold
              text-slate-400
              mb-5
            ">
              Teacher Workspace • MarzaLearn
            </p>


            <h1 className="
              text-[64px]
              md:text-[76px]
              leading-[0.92]
              tracking-[-0.06em]
              font-bold
              text-[#23332e]
            ">
              Guide your
              <br />
              classroom
              <br />
              <span className="relative inline-block">
                forward
                <span className="
                  absolute
                  left-0
                  right-0
                  bottom-2
                  h-3
                  rounded-full
                  bg-[#f3dcd2]
                  -z-10
                " />
              </span>
              .
            </h1>


            <p className="
              mt-5
              max-w-md
              text-[15px]
              leading-relaxed
              text-slate-500
            ">
              Welcome back,{" "}
              <span className="font-semibold text-[#23332e]">
                {profile?.full_name || "Teacher"}
              </span>
              . Monitor student progress, review submissions,
              and manage your MarzaLearn classroom journey.
            </p>


            <div className="
              flex
              gap-3
              mt-7
            ">

              <button
                onClick={() => navigate("/teacher/students")}
                className="
                  rounded-full
                  bg-[#23332e]
                  px-6
                  py-3
                  text-sm
                  font-medium
                  text-white
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-md
                "
              >
                Student Management →
              </button>


              <button
                onClick={() => navigate("/teacher/analytics")}
                className="
                  rounded-full
                  border
                  border-slate-200
                  bg-white
                  px-6
                  py-3
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
                View Analytics
              </button>

            </div>

          </div>


          <div className="flex justify-center">

            <TeacherLab />

          </div>

        </section>



        <section className="
          mt-10
          grid
          grid-cols-2
          md:grid-cols-4
          border-y
          border-slate-100
        ">

          {stats.map((item) => (
            <div
              key={item.label}
              className="
                py-7
                px-5
                border-r
                border-slate-100
                last:border-r-0
              "
            >

              <p className="
                text-[11px]
                uppercase
                tracking-widest
                text-slate-400
              ">
                {item.label}
              </p>


              <p className="
                mt-2
                text-3xl
                font-bold
                text-[#23332e]
              ">
                {item.value}
              </p>

            </div>
          ))}

        </section>


        <TeacherJourney />

      </main>

    </section>
  );
}