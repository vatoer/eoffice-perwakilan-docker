"use client";
import Sidebar from "@/components/navigation/sidebar";
import SidebarItem from "@/components/navigation/sidebar-item";
import SidebarItemLogout from "@/components/navigation/sidebar-item-logout";
import { Separator } from "@/components/ui/separator";
import { useToggleSidebar } from "@/hooks/use-toggle-sidebar";
import { Route } from "@/routes";
import {
  Book,
  FileText,
  Inbox,
  Layout,
  List,
  LucideIcon,
  Pencil,
  Send,
  Upload,
} from "lucide-react";
import { BsEnvelopeArrowDown, BsEnvelopeArrowUp } from "react-icons/bs";
import { FaMailBulk } from "react-icons/fa";
import { IconType } from "react-icons/lib";
import { MdOutlineCloudSync, MdWarning } from "react-icons/md";
import { TbNumber } from "react-icons/tb";
import { TfiCommentAlt } from "react-icons/tfi";

const iconMap: { [key: string]: LucideIcon | IconType } = {
  FaMailBulk,
  MdOutlineCloudSync,
  Inbox,
  Pencil,
  TfiCommentAlt,
  Send,
  FileText,
  Upload,
  Layout,
  Book,
  TbNumber,
  List,
  BsEnvelopeArrowUp,
  BsEnvelopeArrowDown,
};

interface MailboxSidebarProps {
  mailboxRoutes?: Route[];
}

const MailboxSidebar = ({ mailboxRoutes }: MailboxSidebarProps) => {
  const { collapse, setCollapse } = useToggleSidebar();
  if (!mailboxRoutes) {
    return null;
  }

  return (
    <Sidebar collapse={collapse}>
      <div>
        {mailboxRoutes.map((route, index) => {
          if (!route.displayAsMenu) return null; // Skip routes that are not meant to be displayed in the sidebar
          const Icon = iconMap[route.icon] || MdWarning; // Map the icon string to the actual icon component
          return (
            <SidebarItem
              key={index}
              label={route.label}
              icon={Icon}
              href={`${route.href}`}
              collapse={collapse}
              counter={route.counter}
            />
          );
        })}
        <Separator className="my-2" />
        <SidebarItemLogout collapse={collapse} />
      </div>
    </Sidebar>
  );
};

export default MailboxSidebar;
