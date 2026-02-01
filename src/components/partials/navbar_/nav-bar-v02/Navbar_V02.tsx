import { Link } from "react-router-dom";
import { CgMenuGridO } from "react-icons/cg";

import AvatarMenu_V02 from "../../avatar/v02/AvatarMenu_V02";
import { useAuth } from "@/provider/context/AuthContext";
import SearchBarV02 from "@/pages/Home/Home_V02/Search-Bar-V02";
import { cn } from "@/lib/utils";
import SubNavbarV02 from "./sub-navbar";

const Navbar_V02 = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="fixed left-0 right-0 top-0 z-50 w-full sm:pt-0 pt-5 bg-white">
      <div className="flex flex-col gap-3 max-w-screen-2xl mx-auto ">
        {/* ================= HEADER ================= */}
        <header className="h-[100px] flex flex-col items-center justify-center px-4">
          <nav
            className={cn(
              "flex sm:items-center items-end w-full gap-3",
              isLoggedIn ? "justify-between" : "justify-end",
            )}
          >
            {/* ================= LEFT SIDE (Only if Logged In) ================= */}
            {isLoggedIn && (
              <div className="flex items-center sm:gap-10 gap-3 w-full">
                <h2 className="text-3xl  select-none text-neutral-600 font-medium">
                  Safvan
                </h2>

                <div className="w-full sm:block hidden max-w-">
                  <SearchBarV02 />
                </div>
              </div>
            )}

            {/* ================= RIGHT SIDE ================= */}
            <div className="flex items-center gap-4">
              {/* Email */}
              <Link
                to="mailto:msafvankv786@gmail.com"
                className="text-sm text-neutral-600 hover:underline"
              >
                Email
              </Link>

              {/* Images */}
              <Link
                to="https://wa.link/j9cr5h"
                className="text-sm text-neutral-600 hover:underline"
              >
                Phone
              </Link>

              {/* App Grid Icon */}
              <CgMenuGridO
                size={24}
                className="text-neutral-600 cursor-pointer hover:text-black transition"
              />

              {/* Avatar */}
              <AvatarMenu_V02 />
            </div>
          </nav>
          {isLoggedIn && (
            <div className="w-full mt-3 sm:hidden block max-w-">
              <SearchBarV02 />
            </div>
          )}
        </header>

        {/* ================= SUB NAVBAR ================= */}
        {isLoggedIn && <SubNavbarV02 />}
      </div>
    </div>
  );
};

export default Navbar_V02;
