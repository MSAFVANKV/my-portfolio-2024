import { IconCloudSection } from "@/components/Cloud/Icon-Cloud";
import PagesLayouts from "@/layouts/PagesLayouts";
import { FaReact, FaNodeJs, FaDatabase } from "react-icons/fa";
import { SiMongodb, SiExpress, SiTypescript } from "react-icons/si";

const skills = [
  {
    name: "React.js",
    icon: <FaReact size={28} />,
    iconColor:"text-pink-600",
    description:
      "Building interactive UI with hooks, context, and reusable components.",
  },
  {
    name: "Node.js",
    icon: <FaNodeJs size={28} />,
    iconColor:"text-green-600",
    description: "REST APIs, authentication, scalable backend architecture.",
  },
  {
    name: "Express.js",
    icon: <SiExpress size={28} />,
    iconColor:"text-yellow-700",
    description: "Middleware, routing, JWT authentication.",
  },
  {
    name: "MongoDB",
    icon: <SiMongodb size={28} />,
    iconColor:"text-green-700",
    description: "Schema design, aggregation, optimized queries.",
  },
  {
    name: "TypeScript",
    icon: <SiTypescript size={28} />,
    iconColor:"text-blue-500",
    description: "Strong typing for scalable and maintainable applications.",
  },
];

export default function MernSkillsPage() {
  return (
    <PagesLayouts className="min-h-screen ">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          MERN Stack Developer
        </h1>
        <p className="text-gray-600 mb-10 max-w-2xl">
          I specialize in building scalable, high-performance full-stack web
          applications using modern MERN technologies.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition duration-300 border border-gray-100 hover:-translate-y-2"
            >
              <div className={`${skill?.iconColor} mb-3`}>{skill.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{skill.name}</h3>
              <p className="text-gray-500 text-sm">{skill.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="md:w-1/2 w-full mx-auto">
        <IconCloudSection />
      </div>
    </PagesLayouts>
  );
}
