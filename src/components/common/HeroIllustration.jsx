import {motion} from "framer-motion";


export default function HeroIllustration(){


return (

<div className="
relative
h-[500px]
flex
items-center
justify-center
">


{/* Background Circle */}

<div className="
absolute
w-[420px]
h-[420px]
bg-[#B8DFF5]
rounded-full
blur-2xl
opacity-50
"/>



{/* Book */}

<motion.div

animate={{

y:[0,-20,0]

}}

transition={{

duration:4,

repeat:Infinity

}}

className="
absolute
top-20
left-20
bg-white
rounded-[30px]
shadow-xl
p-8
text-6xl
"

>

📚


</motion.div>




{/* Headphone */}


<motion.div

animate={{

rotate:[-5,5,-5]

}}

transition={{

duration:3,

repeat:Infinity

}}

className="
absolute
right-20
top-32
bg-[#BDE8D3]
rounded-[30px]
p-8
text-6xl
shadow-xl
"

>

🎧


</motion.div>




{/* Art */}


<motion.div

animate={{

y:[0,15,0]

}}

transition={{

duration:3,

repeat:Infinity

}}

className="
absolute
bottom-20
right-32
bg-[#FFE7A8]
rounded-[30px]
p-8
text-6xl
shadow-xl
"

>

🎨


</motion.div>



{/* Student */}

<div className="
text-9xl
z-10
">

👩‍🎓


</div>


</div>

)


}
