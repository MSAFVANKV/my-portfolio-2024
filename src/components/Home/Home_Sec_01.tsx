import { IconCloudSection } from "@/components/Cloud/Icon-Cloud";
import HyperText from "@/components/ui/hyper-text";

type Props = {};

export default function HomeSec01({}: Props) {
  return (
    <div className="md:h-[calc(100vh-7rem)] h-[calc(100vh-10rem)] scrollbar-none overflow-y-auto flex md:flex-row flex-col justify-between">
      <div className="md:w-1/2 flex flex-col md:gap-6 gap-3 justify-center md:items-start items-center">
        <HyperText
          className="text-4xl font-bold "
          text="Muhammed Safvan Kv"
          duration={500}
        />
        <span className="text-xs md:text-justify text-center">
          I am a passionate Web Developer with a strong focus on creating
          user-friendly and efficient digital experiences. With expertise in
          modern web technologies, I specialize in building responsive, dynamic,
          and visually appealing websites and applications.
        </span>

        <div className="bg-[#D3B8AA] overflow-hidden rounded-full w-[250px] h-[250px] shadow border ">
          <img
            src="/pr_img_02.png"
            alt=""
            className="object-cover w-full h-full scale-150"
            draggable={false}
          />
        </div>
      </div>
      <div className="md:w-1/2 w-full">
        <IconCloudSection />
      </div>
    </div>
  );
}
