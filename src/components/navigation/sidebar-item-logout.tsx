import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

interface SidebarItemLogoutProps {
  collapse?: boolean;
}
const SidebarItemLogout = ({ collapse }: SidebarItemLogoutProps) => {
  return (
    <Button
      type="button"
      variant={"ghost"}
      className={cn(
        "relative",
        "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20 w-full"
      )}
      onClick={() => signOut()}
    >
      <div className="flex items-center gap-x-2 py-4 flex-grow">
        <LogOut size={22} className={cn("hidden md:block text-slate-500")} />
        <span className={cn(collapse ? "hidden" : "block")}>LogOut</span>
      </div>
    </Button>
  );
};

export default SidebarItemLogout;
