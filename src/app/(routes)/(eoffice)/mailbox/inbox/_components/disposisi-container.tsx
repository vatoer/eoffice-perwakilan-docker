"use client";
import { FungsiGroup } from "@/data/fungsi";
import { useModeDisposisi } from "@/hooks/use-mode-disposisi";
import { useInbox } from "@/hooks/use-surat";
import LembarDisposisi from "@eoffice/mailbox/_components/lembar-disposisi";
import { tbl_fungsi, tbl_instruksi } from "@prisma-dbedispo/client";
import FormDisposisi from "./form-disposisi";

interface DisposisiContainerProps {
  instruksi: tbl_instruksi[];
  fungsi: tbl_fungsi[];
  fungsiGroup: FungsiGroup[];
  user_fungsi_kd: number;
}
const DisposisiContainer = ({
  instruksi,
  fungsi,
  fungsiGroup,
  user_fungsi_kd,
}: DisposisiContainerProps) => {
  const { inbox } = useInbox();
  const modeInitial = inbox?.disposisi_kd ? "R" : "C"; // jika sudah ada disposisi, maka mode read
  const { modeDisposisi, setModeDisposisi } = useModeDisposisi();
  if (!inbox) return null;

  return (
    <>
      {
        // jika fungsi yang login sama dengan fungsi disposisi, dan mode disposisi write tampilkan form disposisi
        inbox.berita_fungsi_disposisi === user_fungsi_kd &&
          (modeDisposisi === "U" || !inbox.disposisi_kd) && (
            <FormDisposisi
              instruksi={instruksi}
              fungsi={fungsi}
              fungsiGroup={fungsiGroup}
              user_fungsi_kd={user_fungsi_kd}
            />
          )
      }
      {inbox.disposisi_kd && modeDisposisi !== "U" && (
        <LembarDisposisi
          fungsi={fungsi}
          instruksi={instruksi}
          user_fungsi_kd={user_fungsi_kd}
        />
      )}
    </>
  );
};

export default DisposisiContainer;
