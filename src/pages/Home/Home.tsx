import HomeSec01 from "../../components/Home/Home_Sec_01";
import Works from "../../components/Home/Works";
import Journey from "../../components/Home/Journey";
import { useState, useRef, useEffect, useCallback } from "react";
import ContactPage from "../contact/page";

type Props = {};

export default function Home({}: Props) {
  const ids = {
    home: "home",
    journey: "journey",
    works: "works",
    contact: "contact",

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
    <div className="relative mt-[100px] h-[calc(100vh-100px)] bg-red-">
      <div className="absolute z-50 bottom-10 left-0 transform -translate-y-1/2">
        {/* Prev Button */}
        {currentSection !== ids.home && (
          <button
            onClick={handleClickPrev}
            className="bg-neutral-500  h-10 w-10 rounded-full"
          >
            P
          </button>
        )}
      </div>

      <div className="absolute z-50 bottom-10 right-0 transform -translate-y-1/2">
        {/* Next Button */}
        {currentSection !== ids.contact && (
          <button
            onClick={handleClickNext}
            className="bg-foreground dark:text-black text-white   h-10 w-10 rounded-full"
          >
            N
          </button>
        )}
      </div>

      {/* ====== */}

      <div
        ref={scrollContainerRef}
        className="scroll-container h-full flex  overflow-auto scrollbar-none scroll-smooth snap-x snap-mandatory "
      >
        {/* Full-width section */}
        <div id={ids.home} className="min-w-full h-full snap-start ">
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
        <div
          id={ids.contact}
          className="flex flex-row gap-6 min-w-full h-full snap-start"
        >
          <ContactPage />
        </div>
      </div>
    </div>
  );
}
