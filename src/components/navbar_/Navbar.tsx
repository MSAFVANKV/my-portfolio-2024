import  { useState } from "react";
import NavDrawer from "./Nav_Drawer";

type Props = {};

export default function Navbar({}: Props) {
  const fullName = "Safvan"; // The full name
  const [displayedName, setDisplayedName] = useState(fullName[0]); // Initially show the first letter
  const [isHovered, setIsHovered] = useState(false); // Track hover state

  const handleMouseEnter = () => {
    setIsHovered(true);
    let index = 0;

    const expandInterval = setInterval(() => {
      if (index < fullName.length) {
        setDisplayedName(fullName.slice(0, index + 1)); // Incrementally show letters
        index++;
      } else {
        clearInterval(expandInterval);
      }
    }, 100); // Adjust speed of expansion
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    let index = fullName.length;

    const contractInterval = setInterval(() => {
      if (index > 1) {
        setDisplayedName(fullName.slice(0, index - 1)); // Incrementally hide letters
        index--;
      } else {
        clearInterval(contractInterval);
        setDisplayedName(fullName[0]); // Reset to first letter
      }
    }, 100); // Adjust speed of contraction
  };

  return (
    <header className="flex justify-between items-center fixed left-0 right-0 top-0 z-50 section_container">
      <nav className="py-8 flex justify-between w-full items-center">
        {/* Logo Section */}
        <div
          className={`text-3xl font-bold uppercase cursor-pointer h-12  flex items-center justify-center bg-black rounded-full overflow-hidden`}
          style={{
            transition: "width 0.1s ease", // Smooth transition for width
            // width: `${displayedName.length * 1.5}ch`, // Dynamic width based on text length
            width: isHovered
              ? `${displayedName.length * 1.5}ch` // Width expands based on text length
              : "3rem",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span
            className={`transition-all duration-500   flex items-center rounded-full ${
              isHovered ? "inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent" : "text-white"
            }`}
          >
            {displayedName}
          </span>
        </div>

        {/* Pages Section */}
        <div className="">
            <NavDrawer />
        </div>
      </nav>
    </header>
  );
}
