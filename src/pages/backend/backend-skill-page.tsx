import PagesLayouts from "@/layouts/PagesLayouts";

const backendSkills = [
  "Node.js",
  "Express.js",
  "MongoDB",
  "REST APIs",
  "Authentication (JWT, NextAuth)",
  "Razorpay Integration",
];

export default function BackendSkills() {
  return (
    <PagesLayouts className="min-h-screen bg-gray-50 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Backend Technologies</h1>

        <div className="grid sm:grid-cols-2 gap-6">
          {backendSkills.map((skill, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-lg shadow-sm border hover:border-blue-500 transition"
            >
              <h3 className="font-medium text-gray-800">{skill}</h3>
            </div>
          ))}
        </div>
      </div>
    </PagesLayouts>
  );
}
