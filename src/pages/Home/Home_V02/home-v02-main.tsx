import SearchBarV02 from "../../../components/Home/home-v02/Search-Bar-V02";
import { useAuth } from "@/provider/context/AuthContext";
import AuthorizedHomePage_V02 from "./authorized-pages/authorized-home-page-v02";

const googleColors = [
  "#4285F4", // Blue
  "#EA4335", // Red
  "#FBBC05", // Yellow
  "#4285F4", // Blue
  "#34A853", // Green
  "#EA4335", // Red
];

const HomeV02HomePage = () => {
  const { isLoggedIn } = useAuth();

  const name = "Safvan";
  if (isLoggedIn) {
    return (
      <div className="">
        <AuthorizedHomePage_V02 />
      </div>
    );
  }

  return (
    <div className=" w-full h-[90%] flex mt-20 justify-center bg-white">
      <div className="flex flex-col gap-10 w-full items-center">
        {/* Google Style Name */}
        <h1 className="text-8xl font-semibold space-x-1 tracking-tight">
          {name.split("").map((letter, index) => (
            <span
              key={index}
              style={{ color: googleColors[index % googleColors.length] }}
              className="hover:scale-110 transition-transform duration-200 inline-block"
            >
              {letter}
            </span>
          ))}
        </h1>

        {/* === Search bar section ==== */}
        <SearchBarV02 />
      </div>
    </div>
  );
};

export default HomeV02HomePage;
