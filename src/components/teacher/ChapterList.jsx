import { useNavigate } from "react-router-dom";


export default function ChapterList({chapters=[]}) {


const navigate = useNavigate();


return (

<section className="mt-12">


<div className="
space-y-0
border-t
border-slate-100
">


{
chapters.map((chapter,index)=>(


<div

key={chapter.id}

className="
flex
items-center
gap-6
py-8
border-b
border-slate-100
group
"


>


<div
className="
w-12
h-12
rounded-full
bg-[#edf6f1]
flex
items-center
justify-center
text-sm
font-semibold
"
>

{String(index+1).padStart(2,"0")}

</div>



<div className="flex-1">


<h3 className="
text-xl
font-semibold
text-[#23332e]
">

{chapter.title}

</h3>


<p className="
text-sm
text-slate-500
mt-2
">

Manage chapter materials and exercises.

</p>


</div>



<button

onClick={()=>
navigate(`/teacher/chapters/${chapter.id}`)
}

className="
rounded-full
border
border-slate-200
px-5
py-2.5
text-sm
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

)

}