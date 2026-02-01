import { useEffect, useRef, useState } from "react";
import Nav_V02_Avatar from "./Avatar_V02";
import { useAuth } from "@/provider/context/AuthContext";

const AvatarMenu_V02 = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn, login, logout } = useAuth();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <Nav_V02_Avatar name="Muhammed" onClick={() => setOpen(!open)} />

      {open && (
        <div
          className="absolute  right-0 mt-3 w-[90vw]
max-w-[400px]
sm:w-[400px] overflow-auto bg-[#e9eef6] rounded-3xl shadow-2xl p-6 z-50 transition-all duration-200"
        >
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-500">msafvankv786@gmail.com</p>

            <div className="flex justify-center">
              <Nav_V02_Avatar name="Muhammed" size={80} />
            </div>

            <h2 className="text-xl font-medium">Hi, Muhammed!</h2>

            <button className="px-6 py-2 border rounded-full text-blue-600 border-gray-400 hover:bg-gray-100 transition">
              Manage your Google Account
            </button>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <button className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition">
                Add account
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isLoggedIn) {
                    logout();
                  } else {
                    login();
                  }
                }}
                className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
              >
                {isLoggedIn ? "Sign out" : "Log in"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarMenu_V02;
