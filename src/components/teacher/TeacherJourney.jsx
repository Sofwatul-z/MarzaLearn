import { useNavigate } from "react-router-dom";


export default function TeacherJourney() {


  const navigate = useNavigate();



  const items = [

    {
      number:"01",
      title:"Chapter Management",
      description:
        "Create, organize, and manage learning materials for your classroom.",
      route:"/teacher/chapters"
    },


    {
      number:"02",
      title:"Student Review",
      description:
        "Review submissions and provide feedback for student progress.",
      route:"/teacher/students"
    },


    {
      number:"03",
      title:"Class Analytics",
      description:
        "Understand classroom performance and learning development.",
      route:"/teacher/analytics"
    }

  ];




  return (

    <section
      className="
      mt-24
      pb-10
      "
    >



      {/* heading */}

      <div
        className="
        mb-12
        "
      >

        <p
          className="
          text-[11px]
          uppercase
          tracking-[0.2em]
          font-semibold
          text-slate-400
          "
        >
          Teacher Journey
        </p>



        <h2
          className="
          mt-3
          text-3xl
          md:text-[32px]
          leading-tight
          font-bold
          tracking-tight
          text-[#23332e]
          "
        >

          Manage your classroom,
          <br/>
          one step at a time.

        </h2>


      </div>





      {/* list */}


      <div>


        {
          items.map((item,index)=>(


            <div

              key={item.number}

              className="
              group
              flex
              items-center
              gap-6
              py-8
              border-b
              border-slate-100
              "

            >



              {/* number */}


              <div

                className="
                shrink-0
                w-12
                h-12
                rounded-full
                bg-[#edf6f1]
                flex
                items-center
                justify-center
                text-sm
                font-semibold
                text-[#23332e]
                group-hover:bg-[#dceee7]
                transition
                "

              >

                {item.number}

              </div>






              {/* content */}



              <div

                className="
                flex-1
                "

              >


                <h3

                  className="
                  text-lg
                  md:text-xl
                  font-semibold
                  text-[#23332e]
                  "

                >

                  {item.title}

                </h3>




                <p

                  className="
                  mt-2
                  text-sm
                  leading-relaxed
                  text-slate-500
                  max-w-xl
                  "

                >

                  {item.description}

                </p>


              </div>






              {/* button */}



              <button

                onClick={()=>
                  navigate(item.route)
                }

                className="
                hidden
                sm:block
                rounded-full
                border
                border-slate-200
                px-5
                py-2.5
                text-sm
                text-[#23332e]
                opacity-70
                group-hover:opacity-100
                group-hover:bg-slate-50
                transition
                "

              >

                Open →

              </button>



            </div>


          ))
        }


      </div>



    </section>

  );

}