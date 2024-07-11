import { auth } from "@/app/(auth)/auth";
import { Outbox, getOutbox, getOutboxAdmin } from "@/data/outbox";
import OutboxList from "./_components/outbox-list";
import PdfPreviewContainer from "./_components/preview-container";

const OutboxPage = async () => {
  const session = await auth();
  if (!session) return null;
  const fungsi_kd = session.user.fungsi_kd;
  const user_role = session.user.role;

  let outbox: Outbox[] = [];

  // ini fungsi untuk mengambil data outbox
  // untuk admin fungsi_kd = 2 (admin) KOMUNIKASI
  // terpaksa di hardcode karena belum ada role untuk admin
  if (fungsi_kd === 2) {
    outbox = await getOutboxAdmin();
  } else {
    outbox = await getOutbox(fungsi_kd);
  }

  return (
    <div className="flex flex-row">
      <div className="w-full md:w-1/3 border-r border-2">
        <OutboxList outbox={outbox} userRole={user_role} />
      </div>
      <div className="flex-grow hidden md:block ">
        <PdfPreviewContainer />
      </div>
    </div>
  );
};

export default OutboxPage;
