"use client";
import { Button } from "@/components/ui/button";
import { Inbox } from "@/data/inbox";
import { useInbox } from "@/hooks/use-surat";
import { useSuratId } from "@/hooks/use-surat-id";
import { cn } from "@/lib/utils";
import { format, formatDistance, isSameDay, isThisYear } from "date-fns";
import { Eye, Paperclip } from "lucide-react";
import Link from "next/link";
import MailListItemStatus from "./mail-list-item-status";

interface IMailListItemProps<T> {
  mail: T;
  user_kd?: number;
  fungsi_kd?: number;
}

function formatDate(date: Date): string {
  if (isSameDay(date, new Date())) {
    return formatDistance(date, new Date(), { addSuffix: true });
  } else if (isThisYear(date)) {
    return format(date, "dd MMM");
  } else {
    return format(date, "yyyy-MM-dd");
  }
}

const MailListItem = ({
  mail,
  user_kd,
  fungsi_kd,
}: IMailListItemProps<Inbox>) => {
  const { setSuratId, suratId } = useSuratId();
  const { setInbox } = useInbox();
  const handleClick = () => {
    setSuratId(mail.arsip_kd);
    setInbox(mail);
    console.log(mail.arsip_kd);
  };

  return (
    <div
      className={cn(
        "py-1 px-2 hover:bg-slate-100 hover:cursor-pointer border-b-2 border-b-slate-50",
        suratId === mail.arsip_kd && "bg-blue-200 hover:bg-blue-100"
      )}
      onClick={handleClick}
    >
      <div className="flex flex-col text-sm relative">
        <div className="text-blue-500">
          <div className="font-semibold text-xs">
            {mail.perwakilan_nama.trim()}
          </div>
          <div className="text-xs flex-auto flex gap-1">
            {mail.berita_kd.trim()}
          </div>
        </div>
        <div>
          <div className="flex flex-col">
            <p
              className={cn(
                "line-clamp-2 md:line-clamp-3 text-primary ",
                mail.berita_disposisikan === "Y" &&
                  mail.status_disposisi !== "Y"
                  ? "font-bold"
                  : "font-normal"
              )}
            >
              {mail.perihal_berita}
            </p>
          </div>
          <div className="text-xs my-1 flex flex-row">
            <span className="flex-grow">{mail.arsip_kd}</span>
            <div className="flex flex-col">
              <div className="flex flex-row">
                <MailListItemStatus
                  berita_disposisikan={mail.berita_disposisikan}
                  status_disposisi={mail.status_disposisi}
                  isByFungsi={mail.disposisi_fungsi_kd === fungsi_kd}
                  disposisi_fungsi_nama={mail.disposisi_fungsi_nama}
                />
              </div>
              <div className="flex justify-end items-end">
                <span>{formatDate(mail.tgl_diarsipkan)}</span>
              </div>
            </div>
          </div>
        </div>
        {suratId === mail.arsip_kd && (
          <div
            className={cn(
              "flex flex-row absolute bg-gray-300 grow",
              "right-0 -top-1 -bottom-1 md:hidden justify-start gap-0",
              "border-l-0 border-b-slate-50 animate-in"
            )}
          >
            <Button
              variant="ghost"
              className="flex flex-col items-center justify-center w-20 h-full bg-red-500 p-2 text-white rounded-none"
            >
              <Eye size={24} />
              <span>Dispo</span>
            </Button>
            <Link
              href={`/api/files?id=${mail.arsip_kd}`}
              target="_blank"
              className="flex flex-col items-center justify-center w-20 h-full bg-fuchsia-400 p-2 text-white"
            >
              <Paperclip size={24} />
              <span>Download</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MailListItem;
