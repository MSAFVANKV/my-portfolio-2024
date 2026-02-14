import PagesLayouts from "@/layouts/PagesLayouts";
import { FaReact, FaHtml5, FaCss3Alt } from "react-icons/fa";
import { SiNextdotjs, SiTailwindcss } from "react-icons/si";

const frontendSkills = [
  { name: "React.js", level: 90, icon: <FaReact /> },
  { name: "Next.js", level: 85, icon: <SiNextdotjs /> },
  { name: "HTML5", level: 95, icon: <FaHtml5 /> },
  { name: "CSS3", level: 90, icon: <FaCss3Alt /> },
  { name: "Tailwind CSS", level: 92, icon: <SiTailwindcss /> },
];

export default function FrontendSkills() {
  return (
    <PagesLayouts className="min-h-screen bg-white px-6 ">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-10">Frontend Technologies</h1>

        <div className="space-y-6">
          {frontendSkills.map((skill, index) => (
            <div
              key={index}
              className="p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-blue-600">{skill.icon}</span>
                  <span className="font-medium">{skill.name}</span>
                </div>
                <span className="text-sm text-gray-500">{skill.level}%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PagesLayouts>
  );
}
