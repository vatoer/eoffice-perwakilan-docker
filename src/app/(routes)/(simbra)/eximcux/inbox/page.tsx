import { getInboxCuxImported } from "@/data/inbox";
import MailboxList from "./_components/mailbox-list";
import PreviewContainer from "./_components/preview-container";

const InboxPage = async () => {
  const inbox = await getInboxCuxImported();

  return (
    <div className="flex flex-row gap-1 mailbox-container">
      <div className="w-full md:w-2/3 mailbox-container__left border-r border-2">
        <MailboxList inbox={inbox} />
      </div>
      <div className="hidden md:block w-full h-full">
        <PreviewContainer />
      </div>
    </div>
  );
};

export default InboxPage;
