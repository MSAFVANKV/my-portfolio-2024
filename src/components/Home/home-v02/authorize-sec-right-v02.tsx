import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Code,
} from "lucide-react";
import { Link } from "react-router-dom";

// type Props = {};

const AuthorizeSecRight_V02 = () => {
  return (
    <div className="w-full  dark:text-white sm:p-6 space-y-6 sm:border-l border-neutral-100">
      {/* ================= PROFILE HEADER ================= */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Muhammed Safvan KV</h2>

        <p className="text-blue-400 text-sm">Full Stack Developer (MERN)</p>

        <p className="text-neutral-400 text-sm">
          React • Next.js • Node.js • MongoDB • TypeScript
        </p>
      </div>

      <div className="border-t border-neutral-800" />

      {/* ================= CONTACT ================= */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-3">
          <Mail size={16} className="text-neutral-400" />
          <Link
            to="mailto:msafvankv786@gmail.com"
            className="text-sm text-neutral-600 hover:underline"
          >
            <span>msafvankv786@gmail.com</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Phone size={16} className="text-neutral-400" />
          <Link
            to="https://wa.link/j9cr5h"
            className="text-sm text-neutral-600 hover:underline"
          >
            <span>+91 7034359330</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <MapPin size={16} className="text-neutral-400" />
          <Link
            to="https://maps.app.goo.gl/4MShd9u7c9YghnmK8"
            className="text-sm text-neutral-600 hover:underline"
          >
            <span>kozhikode ,Kerala, India</span>
          </Link>
        </div>
      </div>

      <div className="border-t border-neutral-800" />

      {/* ================= EXPERIENCE ================= */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Briefcase size={18} />
          Experience
        </div>

        <div className="text-sm space-y-1">
          <p className="font-medium">Full Stack Developer</p>
          <p className="text-neutral-400">
            Haash Technologies Pvt Ltd (2024 – Present)
          </p>

          <p className="font-medium mt-3">MERN Stack Intern</p>
          <p className="text-neutral-400">
            Self Stack, Hilite Business Park (2023 – 2024)
          </p>
        </div>
      </div>

      <div className="border-t border-neutral-800" />

      {/* ================= SKILLS ================= */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Code size={18} />
          Technical Skills
        </div>

        <div className="text-sm text-neutral-500 space-y-1">
          <p>• React.js / Next.js</p>
          <p>• Node.js / Express.js</p>
          <p>• MongoDB</p>
          <p>• TypeScript</p>
          <p>• Tailwind CSS / ShadCN UI / MUI</p>
          <p>• Redux Toolkit / React Query</p>
          <p>• Razorpay Integration</p>
        </div>
      </div>

      <div className="border-t border-neutral-800" />

      {/* ================= EDUCATION ================= */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <GraduationCap size={18} />
          Education
        </div>

        <div className="text-sm space-y-1">
          <p className="font-medium">MERN Full Stack Development</p>
          <p className="text-neutral-400">Self Stack Kerala (2023 – 2024)</p>

          <p className="font-medium mt-3">Tool & Die Engineering</p>
          <p className="text-neutral-400">AWH Engineering College (2022)</p>
        </div>
      </div>
    </div>
  );
};

export default AuthorizeSecRight_V02;
