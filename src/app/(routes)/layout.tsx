import TopBar from "@/components/navigation/tobbar";
import MailboxSidebarContariner from "@eoffice/mailbox/_components/mailbox-sidebar-container";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <TopBar />

      {/* <div className="hidden lg:flex h-full w-56 flex-col fixed inset-y-0 z-50 shadow-lg">
        <Sidebar>
          <MailboxSidebar />
        </Sidebar>
      </div> */}
      <div className="flex flex-row pt-[76px] lg:h-[calc(100vh-86px)] h-auto">
        <div>
          <MailboxSidebarContariner />
        </div>
        <main className="w-full">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
