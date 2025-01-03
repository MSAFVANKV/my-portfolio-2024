import IconCloud from "@/components/ui/icon-cloud";

const slugs = [
  "typescript",
  "javascript",
//   "dart",
//   "java",
  "react",
//   "flutter",
//   "android",
  "html5",
  "css3",
  "nodedotjs",
  "express",
  "nextdotjs",
//   "prisma",
//   "amazonaws",
//   "postgresql",
//   "firebase",
//   "nginx",
  "vercel",
//   "testinglibrary",
//   "jest",
//   "cypress",
  "docker",
  "git",
  "jira",
  "github",
//   "gitlab",
  "visualstudiocode",
//   "androidstudio",
//   "sonarqube",
  "figma",
];

export function IconCloudSection() {
  return (
    <div className="relative flex size-full md:max-w-lg md:items-start items-center justify-center overflow-hidden  bg-background px-20 pb-20 pt-8 ">
      <IconCloud iconSlugs={slugs} />
    </div>
  );
}
