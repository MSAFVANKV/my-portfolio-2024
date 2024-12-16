import HomeSec01 from "../../components/Home/Home_Sec_01";
import Works from "../../components/Home/Works";
import Journey from "../../components/Home/Journey";
import { useState, useRef, useEffect, useCallback } from "react";

type Props = {};

export default function Home({}: Props) {
  const ids = {
    home: "home",
    journey: "journey",
    works: "works",
  };

  const [currentSection, setCurrentSection] = useState(ids.home);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleClickNext = useCallback(() => {
    const sections = Object.values(ids);
    const currentIndex = sections.indexOf(currentSection);
    const nextSection = sections[currentIndex + 1];

    if (nextSection && scrollContainerRef.current) {
      const nextElement = document.getElementById(nextSection);
      if (nextElement) {
        nextElement.scrollIntoView({ behavior: "smooth" });
        setCurrentSection(nextSection); // Update the current section
      }
    }
  }, [currentSection, ids]);

  const handleClickPrev = useCallback(() => {
    const sections = Object.values(ids);
    const currentIndex = sections.indexOf(currentSection);
    const prevSection = sections[currentIndex - 1];

    if (prevSection && scrollContainerRef.current) {
      const prevElement = document.getElementById(prevSection);
      if (prevElement) {
        prevElement.scrollIntoView({ behavior: "smooth" });
        setCurrentSection(prevSection); // Update the current section
      }
    }
  }, [currentSection, ids]);

  // const handleClickPrev = () => {
  //   const sections = Object.values(ids);
  //   const currentIndex = sections.indexOf(currentSection);
  //   const prevSection = sections[currentIndex - 1];

  //   if (prevSection && scrollContainerRef.current) {
  //     const prevElement = document.getElementById(prevSection);
  //     if (prevElement) {
  //       prevElement.scrollIntoView({ behavior: "smooth" });
  //       setCurrentSection(prevSection); // Update the current section
  //     }
  //   }
  // };

  const handleSectionChange = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCurrentSection(entry.target.id); // Update the current section when the target is in view
        }
      });
    },
    []
  );

  useEffect(() => {
    // Set up IntersectionObserver to track section visibility
    const options = {
      root: scrollContainerRef.current, // Use the scroll container as the root
      threshold: 0.5, // Trigger when 50% of the section is visible
    };

    const observer = new IntersectionObserver(handleSectionChange, options);

    // Observe each section
    const sections = Object.values(ids).map((id) =>
      document.getElementById(id)
    );
    sections.forEach((section) => section && observer.observe(section));

    // Clean up the observer when the component unmounts
    return () => {
      observer.disconnect();
    };
  }, []); // Run once when the component mounts

  return (
    <div className="relative">
      <div className="absolute z-50 bottom-10 left-0 transform -translate-y-1/2">
        {/* Prev Button */}
        {currentSection !== ids.home && (
          <button
            onClick={handleClickPrev}
            className="bg-gray-500 text-white h-10 w-10 rounded-full"
          >
            P
          </button>
        )}
      </div>

      <div className="absolute z-50 bottom-10 right-0 transform -translate-y-1/2">
        {/* Next Button */}
        {currentSection !== ids.works && (
          <button
            onClick={handleClickNext}
            className="bg-black text-white h-10 w-10 rounded-full"
          >
            N
          </button>
        )}
      </div>

      {/* ====== */}

      <div
        ref={scrollContainerRef}
        className="scroll-container flex overflow-auto scrollbar-none scroll-smooth snap-x snap-mandatory "
      >
        {/* Full-width section */}
        <div id={ids.home} className="min-w-full snap-start ">
          <HomeSec01 />
        </div>

        <div
          id={ids.journey}
          className="flex flex-row gap-6 min-w-full snap-start"
        >
          <Journey />
        </div>
        {/* Horizontal scroll sections */}
        <div
          id={ids.works}
          className="flex flex-row gap-6 min-w-full snap-start"
        >
          <Works />
        </div>
      </div>
    </div>
  );
}
