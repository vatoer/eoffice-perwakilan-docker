import { auth } from "@/app/(auth)/auth";
import { getFungsi, getFungsiGroup } from "@/data/fungsi";
import { Inbox, getInbox, getInboxAdmin } from "@/data/inbox";
import { getInstruksiAktif } from "@/data/instruksi";
import DisposisiContainer from "./_components/disposisi-container";
import MailActions from "./_components/mail-actions";
import MailboxDetail from "./_components/mailbox-detail";
import MailboxList from "./_components/mailbox-list";

const InboxPage = async () => {
  const session = await auth();
  if (!session || !session.user) {
    return null;
  }

  let inbox: Inbox[] = [];

  const user_kd = session.user.user_kd;
  const user_fungsi_kd = session.user.fungsi_kd;
  const isAdmin = session.user.role === "admin";

  const instruksi = await getInstruksiAktif();
  const fungsi = await getFungsi();
  const fungsiGroup = await getFungsiGroup();
  if (isAdmin) {
    inbox = await getInboxAdmin();
  } else {
    inbox = await getInbox(user_kd, user_fungsi_kd);
  }
  return (
    <div className="flex flex-row gap-1">
      <div className="w-full md:w-1/3 border-r border-2">
        <MailboxList inbox={inbox} />
      </div>
      <div className="md:flex flex-col w-full hidden">
        <MailActions user_fungsi_kd={user_fungsi_kd} />
        <div className="hidden relative group md:flex flex-row md:w-full">
          <DisposisiContainer
            instruksi={instruksi}
            fungsi={fungsi}
            fungsiGroup={fungsiGroup}
            user_fungsi_kd={user_fungsi_kd}
          />
          <MailboxDetail />
        </div>
      </div>
    </div>
  );
};

export default InboxPage;
