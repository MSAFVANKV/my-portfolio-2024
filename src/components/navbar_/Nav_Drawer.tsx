import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { useTheme } from "@/provider/theme-provider";

function NavDrawer() {
  const [dateTime, setDateTime] = useState({ date: "", time: "" });
  const [battery, setBattery] = useState<number | null>(null);
  const { setTheme, theme } = useTheme()

  const drawerItems = [
    {
      id: 1,
      title: "Home",
      icon: "solar:home-angle-outline",
      action:()=>{}
    },
    {
      id: 2,
      title: "Projects",
      icon: "si:projects-line",
      action:() => {}

    },
    {
      id: 3,
      title: "About",
      icon: "mdi:about-circle-outline",
      action:() => {}

    },
    {
      id: 4,
      title: "Dark",
      icon: theme === "dark"?  "noto:full-moon":"twemoji:sun",
      action:() =>{
        if(theme === "dark"){
          setTheme("light")
        }else{
          setTheme("dark")}
        }
       
    }
  ];

  // Update date and time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        month: "short",
        day: "numeric",
      };
      setDateTime({
        date: now.toLocaleDateString("en-US", options),
        time: now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000); // Update every second
    return () => clearInterval(interval);
  }, []);

  // Get and update battery status
  useEffect(() => {
    const fetchBatteryStatus = async () => {
      if ("getBattery" in navigator) {
        const batteryStatus = await (navigator as any).getBattery();

        const updateBatteryLevel = () => {
          setBattery(Math.floor(batteryStatus.level * 100));
        };

        // Update battery level initially
        updateBatteryLevel();

        // Listen for battery level changes
        batteryStatus.addEventListener("levelchange", updateBatteryLevel);

        // Clean up the event listener on component unmount
        return () => {
          batteryStatus.removeEventListener("levelchange", updateBatteryLevel);
        };
      }
    };
    fetchBatteryStatus();
  }, []);

  const getBatteryColor = (battery: number | null) => {
    if (battery === null) return "bg-gray-300"; // Default color if battery is not available
    if (battery >= 75) return "bg-green-500"; // Green for high battery
    if (battery >= 50) return "bg-yellow-500"; // Yellow for medium battery
    if (battery >= 25) return "bg-orange-500"; // Orange for low battery
    return "bg-red-500"; // Red for critical battery
  };

  return (
    <Drawer direction="top">
      <DrawerTrigger>
        <Icon icon="arcticons:drawer-alt-2" fontSize={25} />
      </DrawerTrigger>
      <DrawerContent className="bg-background/10 text-foreground max-w-screen-2xl mx-auto p-4 gap-6">
        <DrawerHeader className="text-center flex justify-between items-center">
         <div className="">
         <p className="sm:text-lg text-sm text-white font-semibold text-start">{dateTime.date}</p>
         <p className="sm:text-sm text-xs text-white text-start">{dateTime.time}</p>
         </div>
          {battery !== null && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-3 rounded-full bg-gray-300">
                <div
                  className={`h-full rounded-full flex items-center justify-center ${getBatteryColor(
                    battery
                  )}`}
                  style={{ width: `${battery}%` }}
                >
                  {battery > 50 && (
                    <p className="text-[10px] text-white">{battery}%</p>
                  )}
                </div>
              </div>
              {battery < 50 && (
                <p className="text-[10px] text-white">{battery}%</p>
              )}
            </div>
          )}
        </DrawerHeader>
        <DrawerDescription className="grid md:grid-cols-5 grid-cols-3 gap-4 w-[40%] h-16 mx-auto">
          {drawerItems.map((item) => (
            <Toggle
              aria-label="Toggle bold"
              className="h-full bg-black/40"
              key={item.id}
              onClick={item.action}
            >
              <Icon icon={item.icon} fontSize={25} />
            </Toggle>
          ))}
        </DrawerDescription>
        <DrawerFooter>
          <DrawerClose className="btn btn-primary">Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default NavDrawer;
