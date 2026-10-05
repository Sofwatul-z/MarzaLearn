import {
Headphones,
Gamepad2,
Palette,
Brain
}
from "lucide-react";


const features=[

{
icon:<Headphones/>,
title:"Listen & Learn",
desc:"Improve English through interactive audio."
},


{
icon:<Brain/>,
title:"Marzano Journey",
desc:"Learn step by step using structured activities."
},


{
icon:<Gamepad2/>,
title:"Learning Games",
desc:"Practice through fun challenges."
},


{
icon:<Palette/>,
title:"Creative Project",
desc:"Show your ideas through projects."
}

];



export default function FeatureSection(){


return(

<section id="about" className="
px-12
py-32
">


<h2 className="
text-4xl
font-bold
text-center
text-[#24332D]
mb-16
">

Why MarzaLearn?


</h2>



<div className="
grid
md:grid-cols-4
gap-8
">


{

features.map((item,index)=>(


<div

key={index}

className="
bg-white
rounded-[32px]
p-8
shadow-lg
hover:-translate-y-3
transition-all
"


>


<div className="
bg-[#CFE8DD]
w-16
h-16
rounded-2xl
flex
items-center
justify-center
mb-6
">

{item.icon}


</div>



<h3 className="
text-xl
font-bold
text-[#24332D]
">

{item.title}

</h3>


<p className="
mt-3
text-[#6C7973]
">

{item.desc}

</p>


</div>


))

}



</div>


</section>

)


}
