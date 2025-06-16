import { Link } from "react-router-dom";
import HyperText from "../ui/hyper-text";
import { Separator } from "../ui/separator";

type Props = {};

export default function Works({}: Props) {
  const Projects = [
    {
      id: 1,
      title: "haash.tech",
      description:
        "This is the company portfolio of haashtechnologies pvt ltd.",
      image: "/projects/proj01.svg",
      domain: "https://haash.tech",
      isFeatured: true,
    },
    {
      id: 2,
      title: "uracca.com",
      description: "This is the ecommerce platform for fashion trends.",
      image: "/projects/www.uracca.com.png",
      // image: "/projects/proj02.svg",
      domain: "https://uracca.com",
      isFeatured: false,
    },
    {
      id: 3,
      title: "uracca.com",
      description: "This is the ecommerce platform for fashion trends.",
      image: "/projects/www.uracca.com_products_03.png",
      domain: "https://admin.uracca.com",
      isFeatured: false,
    },
    {
      id: 4,
      title: "ayaboo.com",
      description: "This is a b2b platform for business related fashions.",
      image: "/projects/proj03.svg",
      domain: "https://ayaboo.com",
      isFeatured: false,
    },
    {
      id: 5,
      title: "ayaboo.com",
      description: "This is the main page for ayaboo.com after register",
      image: "/projects/proj04.svg",
      domain: "https://ayaboo.com",
      isFeatured: false,
    },
    {
      id: 6,
      title: "admin.ayaboo.com",
      description: "This is a admin panel for ayaboo team.",
      image: "/projects/proj08.png",
      domain: "https://admin.ayaboo.com",
      isFeatured: false,
    },
  ];
  return (
    <div className="min-h-[calc(100vh-7rem)] w-full flex  flex-col ">
      <div className="">
        <HyperText
          className="text-4xl font-bold text-black dark:text-white"
          text="Show Case"
          duration={500}
        />
      </div>
      <Separator orientation="horizontal" className="w-full " />

      <div className="grid xl:grid-cols-3 grid-cols-2 my-10 gap-3 mx-2">
        {Projects.map((project,index) => (
          <div
          key={index}
            className=" h-[300px] min-w-[250px] p-4 animated-bg overflow-hidden shadow-md group rounded-lg cursor-pointer relative"
            style={{
              backgroundImage: `url(${project.image})`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              
            }}
          >
            
            <div className="flex flex-col text-center items-center justify-center absolute top-0 left-0 w-full h-full  bg-foreground/50 text-white dark:text-black backdrop-blur-sm -translate-y-full group-hover:translate-y-0 duration-300 transition-all">
              <Link to={project.domain} target="_blank" className="text-xs underline">{project.title}</Link>
              <span className="text-sm break-words">{project.description}</span>

            </div>
          </div> // End of project card
        ))}
      </div>
    </div>
  );
}
