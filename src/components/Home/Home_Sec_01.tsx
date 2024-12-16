import { IconCloudSection } from "@/components/Cloud/Icon-Cloud";
import HyperText from "@/components/ui/hyper-text";

type Props = {};

export default function HomeSec01({}: Props) {
  return (
    <div className="min-h-[calc(100vh-7rem)] bg-blue- flex md:flex-row flex-col justify-between">
      <div className="md:w-1/2 flex flex-col gap-7 justify-center">
        <HyperText
          className="text-4xl font-bold text-black dark:text-white"
          text="Muhammed Safvan Kv"
          duration={500}
        />
        <span className="text-xs">
          I am a passionate Web Developer with a strong focus on creating
          user-friendly and efficient digital experiences. With expertise in
          modern web technologies, I specialize in building responsive, dynamic,
          and visually appealing websites and applications.
        </span>

        <div className="bg-[#D3B8AA] overflow-hidden rounded-full w-[250px] h-[250px] shadow border ">
          <img
            src="/WhatsApp Image 2024-12-06 at 16.57.36.png"
            alt=""
            className="object-cover"
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