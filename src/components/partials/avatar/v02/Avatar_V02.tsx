import React from "react";

type Props = {
  name?: string;
  size?: number; // size in px
  onClick?: () => void;
};

const Nav_V02_Avatar: React.FC<Props> = ({
  name = "M",
  size = 38,
  onClick,
}) => {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer flex items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        background:
          "conic-gradient(#ea4335, #fbbc05, #34a853, #4285f4, #ea4335)",
        padding: "3px",
      }}
    >
      {/* Inner White Circle */}
      <div
        className="flex items-center justify-center rounded-full border-2 border-white bg-[#669f38]"
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <span
          className="font-medium text-white"
          style={{
            fontSize: size / 2.2,
          }}
        >
          {initial}
        </span>
      </div>
    </div>
  );
};

export default Nav_V02_Avatar;
