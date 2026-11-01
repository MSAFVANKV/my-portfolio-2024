import NavbarMainContainer from "@/components/partials/navbar_/navbar-main";
import React from "react";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

const MainLayout = ({ children, className }: Props) => {
  return (
    <div className={className}>
      <NavbarMainContainer />

      <div className="pt-[150px] pb-10">{children}</div>
    </div>
  );
};

export default MainLayout;
