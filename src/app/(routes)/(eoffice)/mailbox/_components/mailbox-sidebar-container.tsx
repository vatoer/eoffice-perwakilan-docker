import { auth } from "@/app/(auth)/auth";
import { getAllowedRoutes } from "@/routes";
import MailboxSidebar from "./mailbox-sidebar";

const MailboxSidebarContariner = async () => {
  const session = await auth();

  if (!session) {
    return null;
  }

  const user_kd = session.user.user_kd;
  const fungsi_kd = session.user.fungsi_kd;
  const allowedRoutes = await getAllowedRoutes(session.user.permissions);

  // console.log("[MAILBOX SIDEBAR CONTAINER] allowed routes", allowedRoutes);

  // hardcoded untuk simbra
  const isKomunikasi = fungsi_kd === 2;
  console.log("fungsi_kd isKomunikasi", fungsi_kd);

  return (
    <div
      className="flex flex-col min-h-[calc(100vh-76px)] h-auto overflow-y-auto overflow-x-hidden
    bg-gray-100"
    >
      <MailboxSidebar mailboxRoutes={allowedRoutes} />
    </div>
  );
};

export default MailboxSidebarContariner;
