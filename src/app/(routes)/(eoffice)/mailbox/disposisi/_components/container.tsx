import { auth } from "@/app/(auth)/auth";
import {
  getCounterInboxDisposisiBelumTindakLanjut,
  getInboxDisposisi,
} from "@/data/disposisi";
import { getFungsi, getFungsiGroup } from "@/data/fungsi";
import { getInstruksiAktif } from "@/data/instruksi";
import Counter from "./counter";
import LembarDisposisi from "./lembar-disposisi";
import MailActions from "./mail-actions";
import MailboxDetail from "./mailbox-detail";
import MailboxList from "./mailbox-list";

const Container = async () => {
  const session = await auth();

  if (!session) {
    return null;
  }

  const fungsi_kd = session.user.fungsi_kd;
  const instruksi = await getInstruksiAktif();
  const fungsi = await getFungsi();
  const fungsiGroup = await getFungsiGroup();
  const inbox = await getInboxDisposisi(fungsi_kd);
  const belumTindakLanjut = await getCounterInboxDisposisiBelumTindakLanjut(
    fungsi_kd
  );

  //console.log("instruksi", instruksi);

  return (
    <div className="flex flex-row gap-1 mailbox-container">
      <div className="w-full md:w-3/5 lg:w-1/3 border-r border-2">
        <MailboxList
          user_fungsi_kd={fungsi_kd}
          fungsi={fungsi}
          instruksi={instruksi}
          inbox={inbox}
        />
      </div>
      <div className="md:flex flex-col w-full hidden">
        <MailActions />
        <div className="hidden relative group md:flex flex-row md:w-full">
          <LembarDisposisi
            user_fungsi_kd={fungsi_kd}
            fungsi={fungsi}
            instruksi={instruksi}
          />
          <MailboxDetail />
        </div>
      </div>
      <Counter count={belumTindakLanjut} />
    </div>
  );
};

export default Container;
