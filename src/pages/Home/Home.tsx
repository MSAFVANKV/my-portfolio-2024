import HomeSec01 from "../../components/Home/Home_Sec_01";
import Works from "../../components/Home/Works";
import Journey from "../../components/Home/Journey";


type Props = {};

export default function Home({}: Props) {
  return (
    <div className="scroll-container flex overflow-auto scrollbar-none scroll-smooth snap-x snap-mandatory ">
      {/* Full-width section */}
      <div id="home" className="min-w-full snap-start ">
        <HomeSec01 />
      </div>

      <div id="works" className="flex flex-row gap-6 min-w-full snap-start">
        <Journey />
      </div>
      {/* Horizontal scroll sections */}
      <div id="works" className="flex flex-row gap-6 min-w-full snap-start">
        <Works />
      </div>
    </div>
  );
}

