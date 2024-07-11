"use client";
import Sidebar from "@/components/navigation/sidebar";
import SidebarItem from "@/components/navigation/sidebar-item";
import { Separator } from "@/components/ui/separator";
import { useToggleSidebar } from "@/hooks/use-toggle-sidebar";
import { cn } from "@/lib/utils";
import { Route } from "@/routes";
import {
  Book,
  FileText,
  Inbox,
  Layout,
  LucideIcon,
  Pencil,
  Send,
  Upload,
} from "lucide-react";
import { IconType } from "react-icons/lib";
import { TbNumber } from "react-icons/tb";
import { TfiCommentAlt } from "react-icons/tfi";

const iconMap: { [key: string]: LucideIcon | IconType } = {
  Inbox,
  Pencil,
  TfiCommentAlt,
  Send,
  FileText,
  Upload,
  Layout,
  Book,
  TbNumber,
};

const eximcuxRoutes = [
  {
    label: "Import Cux",
    href: "eximcux",
    icon: Upload,
  },
  {
    label: "Cux List",
    href: "eximcux/inbox",
    icon: Layout,
  },
  {
    label: "Import Pdf",
    href: "upload-files",
    icon: Book,
  },
];

interface SimbraSidebarProps {
  mailboxRoutes?: Route[];
}

export const SimbraSidebar = ({ mailboxRoutes }: SimbraSidebarProps) => {
  const { collapse, setCollapse } = useToggleSidebar();

  return (
    <Sidebar collapse={collapse}>
      <div>
        <Separator />
        <h2
          className={cn(
            "font-normal text-lg pl-4 py-2 -mb-2 bg-gray-200 text-slate-500",
            collapse ? "hidden" : "block"
          )}
        >
          Simbra
        </h2>
      </div>
      <div>
        {eximcuxRoutes.map((route, index) => {
          return (
            <SidebarItem
              key={index}
              label={route.label}
              icon={route.icon}
              href={`/${route.href}`}
              collapse={collapse}
            />
          );
        })}
      </div>
    </Sidebar>
  );
};

export default SimbraSidebar;
