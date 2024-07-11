import { cn } from "@/lib/utils";
import { CheckCheck, MailWarning } from "lucide-react";

interface MailListItemStatusProps {
  berita_disposisikan: string;
  disposisi_fungsi_nama: string;
  status_disposisi: string;
  isByFungsi: boolean;
}
export const MailListItemStatus = ({
  berita_disposisikan,
  disposisi_fungsi_nama,
  status_disposisi,
  isByFungsi,
}: MailListItemStatusProps) => {
  if (berita_disposisikan !== "Y") {
    return <>tidak dispo</>;
  }
  return (
    <div className={cn("ml-2  p-1 justify-center flex flex-row gap-2")}>
      {disposisi_fungsi_nama}
      {isByFungsi && (
        <div
          className={cn(
            "flex flex-row gap-2 animate-pulse",
            status_disposisi !== "Y" ? "text-red-700" : "text-blue-700"
          )}
        >
          {status_disposisi !== "Y" ? (
            <MailWarning size={18} className={cn("animate-ping-10s")} />
          ) : (
            <CheckCheck size={14} />
          )}
        </div>
      )}
    </div>
  );
};

export default MailListItemStatus;
