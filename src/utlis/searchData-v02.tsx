import { useAuth } from "@/provider/context/AuthContext";

export type SearchItem = {
  title: string;
  keywords: string[];
  redirect?: string;
  action?: () => void;
  callAgain: boolean;
};

export type HistoryItem = {
  title: string;
};

// 🔥 Make this a hook
export const useSearchDataV02 = (): SearchItem[] => {
  const { login } = useAuth();

  return [
    {
      title: "About Me",
      keywords: ["about", "bio", "profile"],
      redirect: "/?search=about",
      callAgain: true,
    },
    {
      title: "Projects",
      keywords: ["project", "work", "portfolio"],
      redirect: "/?search=projects",
      callAgain: true,
    },
    {
      title: "Login",
      keywords: ["login", "signin", "auth"],
      action: () => {
        login();
      },
      callAgain: false,
    },
    {
      title: "Contact",
      keywords: ["contact", "mail", "email"],
      redirect: "/contact",
      callAgain: true,
    },
  ];
};

export type SearchResultItem = {
  title: string;
  url: string;
  description: string;
};

const base_url = import.meta.env.VITE_BASE_URL ?? "http://localhost:3001";

export const SEARCH_RESULTS: Record<string, SearchResultItem[]> = {
  // ================= ABOUT =================
  about: [
    {
      title: "Muhammed Safvan Kv - Full Stack Developer",
      url: `${base_url}/about`,
      description:
        "Full Stack Developer specializing in React, Next.js, Node.js, MongoDB, Tailwind CSS and scalable web applications.",
    },
  ],

  // ================= SKILLS =================
  skills: [
    {
      title: "Technical Skills - MERN Stack Developer",
      url: `${base_url}/skills`,
      description:
        "React, Next.js, Node.js, Express.js, MongoDB, Tailwind CSS, TypeScript, Redux Toolkit, React Query, MUI, Radix UI.",
    },
    {
      title: "Frontend Technologies",
      url: `${base_url}/skills/frontend`,
      description:
        "React.js, Next.js, HTML5, CSS3, Tailwind CSS, Bootstrap, ShadCN UI, Material UI.",
    },
    {
      title: "Backend Technologies",
      url: `${base_url}/skills/backend`,
      description:
        "Node.js, Express.js, MongoDB, REST APIs, Authentication (NextAuth), Razorpay integration.",
    },
  ],

  // ================= PROJECTS =================
  projects: [
    {
      title: "uracca.com - Fashion E-Commerce Platform",
      url: "https://uracca.com",
      description:
        "Next.js + TypeScript e-commerce platform with ShadCN UI and Tailwind CSS. SEO optimized and scalable architecture.",
    },
    {
      title: "affiliate.uracca.com - Influencer Affiliate Platform",
      url: "https://affiliate.uracca.com",
      description:
        "Next.js powered platform with Node.js backend, MongoDB database, NextAuth authentication and Razorpay integration.",
    },
    {
      title: "ayaboo.com - B2B Wholesale Platform",
      url: "https://ayaboo.com",
      description:
        "Complete React.js + Node.js wholesale business system with admin, seller, and store dashboards.",
    },
    {
      title: "haash.tech - Company Portfolio Website",
      url: "https://haash.tech",
      description:
        "React.js/Vite based portfolio website for Haash Technologies Pvt. Ltd.",
    },
  ],

  // ================= EXPERIENCE =================
  experience: [
    {
      title: "Full Stack Developer - Haash Technologies Pvt Ltd",
      url: `${base_url}/experience`,
      description:
        "Working as Full Stack Developer (2024 - Present) handling React, Next.js, Node.js and frontend/backend architecture.",
    },
    {
      title: "Internship - Self Stack (Hilite Business Park)",
      url: `${base_url}/experience/internship`,
      description:
        "MERN Stack Internship (2023 - 2024) working with React.js, Node.js, MongoDB and Express.",
    },
    {
      title: "Tool Maker - Tesin Products Pvt Ltd",
      url: `${base_url}/experience/non-it`,
      description:
        "Worked as Tool Maker and Quality Engineer (2022 - 2023) before transitioning into IT industry.",
    },
  ],

  // ================= EDUCATION =================
  education: [
    {
      title: "MERN Full Stack Development - Self Stack Kerala",
      url: `${base_url}/education`,
      description:
        "Completed MERN Full Stack Development course (2023 - 2024) at Hilite Business Park, Kerala.",
    },
    {
      title: "Tool and Die Engineering - AWH Engineering College",
      url: "${base_url}/education/engineering",
      description:
        "Completed Tool and Die Engineering in 2022 before entering software development career.",
    },
  ],

  // ================= TOOLS =================
  tools: [
    {
      title: "Development Tools & Libraries",
      url: `${base_url}/tools`,
      description:
        "Git, GitHub, Vite, ShadCN UI, Material UI, Redux Toolkit, React Hook Form, Yup, Axios, React Query.",
    },
  ],

  // ================= LANGUAGES =================
  languages: [
    {
      title: "Languages Known",
      url: `${base_url}/languages`,
      description: "English, Hindi, Malayalam.",
    },
  ],

  // ================= CONTACT =================
  contact: [
    {
      title: "Contact Muhammed Safvan",
      url: `${base_url}/contact`,
      description:
        "Email: mskvphed@gmail.com | Phone: +91-7034359330 | Portfolio available online.",
    },
  ],
};
