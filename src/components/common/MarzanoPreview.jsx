import {motion}
from "framer-motion";


const steps=[

"Provide",

"Restate",

"Visualize",

"Engage",

"Discuss",

"Play"

];


export default function MarzanoPreview(){


return(


<section id="journey" className="
py-32
px-12
bg-[#24332D]
">


<h2 className="
text-4xl
font-bold
text-white
text-center
">

Your Learning Journey


</h2>



<div className="
mt-20
flex
flex-wrap
justify-center
gap-6
">


{

steps.map((step,index)=>(


<motion.div

whileHover={{

scale:1.1

}}

key={step}

className="
bg-white
rounded-full
px-10
py-5
font-bold
text-[#24332D]
shadow-xl
"

>


{index+1}. {step}


</motion.div>


))

}


</div>


</section>


)

}
