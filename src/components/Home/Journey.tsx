import HyperText from "@/components/ui/hyper-text";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";

import { MagicCard } from "@/components/ui/magic-card";

type Props = {};

export default function Journey({}: Props) {
  const { theme } = useTheme();

  const Details = [
    {
        id:1,
        title: "PTMHSS KODIYATHOOR",
        description: "SSLC Pass Out",
        icon: "school:school-outline",
        year:"2016",
        isTraining: false
    },
    {
        id:2,
        title: "GHSS KUTTIKKATTOOR",
        description: "12 th Pass Out",
        icon: "school:school-outline",
        year:"2018",
        isTraining: false
    },
    {
        id:3,
        title: "AWH POLYTECHNIC COLLAGE",
        description: "Diploma",
        icon: "school:school-outline",
        year:"2021",
        isTraining: false
    },
    {
        id:4,
        title: "TESIN PRODUCTS PVT LTD",
        description: "tool and die engineer",
        icon: "school:school-outline",
        year:"2021 -2022",
        isTraining: true
    }
  ]

  return (
    <div className="w-full max-h-[calc(100vh-7rem)] overflow-y-auto ">
      <div className="">
        <HyperText
          className="text-4xl font-bold text-black dark:text-white"
          text="My Life Journey"
          duration={500}
        />
      </div>
      <Separator orientation="horizontal" className="w-full " />

      <div className="grid xl:grid-cols-4 grid-cols-2 my-10 gap-3">
        {
            Details.map((items,i)=>(
                  <div className={" h-[200px] w-full  lg:h-[250px] "} key={i}>
          <MagicCard
            className={`cursor-pointer flex-col items-center justify-center whitespace- text-2xl ${items.isTraining ? "bg-black text-white" : "bg-slate-100"} `}
            gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
          >
            <h1 className="text-lg">{items.title}</h1>
            <span className="text-sm">{items.description} - </span>
            <span className="text-sm">{items.year}</span>

          </MagicCard>
        </div>
            ))
        }
      
      </div>
    </div>
  );
}
