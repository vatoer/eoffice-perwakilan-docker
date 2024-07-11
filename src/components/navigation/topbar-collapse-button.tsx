"use client";
import { useToggleSidebar } from "@/hooks/use-toggle-sidebar";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  TbLayoutSidebarLeftCollapseFilled,
  TbLayoutSidebarRightCollapseFilled,
} from "react-icons/tb";

import { GiHamburgerMenu } from "react-icons/gi";
import { Button } from "../ui/button";

const TopBarCollapseButton = () => {
  const { toggle, collapse } = useToggleSidebar();

  return (
    <div className="w-16 h-full">
      <Button
        variant={"ghost"}
        onClick={toggle}
        className={cn(
          "flex items-center gap-x-2 text-white text-sm font-[500] pl-6 pr-4 transition-all hover:text-slate-600 hover:bg-slate-300/20 w-full h-full rounded-none"
        )}
      >
        <div className="flex items-center gap-x-2 py-4">
          <GiHamburgerMenu size={22} />
        </div>
      </Button>
    </div>
  );
};

export default TopBarCollapseButton;
