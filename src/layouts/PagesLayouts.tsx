import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const PagesLayouts = ({ children, className }: Props) => {
  return (
    <div className={cn(" sm:pt-[160px] pt-[180px]", className)}>{children}</div>
  );
};

export default PagesLayouts;
