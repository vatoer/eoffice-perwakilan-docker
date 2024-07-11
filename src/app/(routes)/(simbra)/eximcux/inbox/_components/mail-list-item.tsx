"use client";
import { Button } from "@/components/ui/button";
import { InboxCuxImported } from "@/data/inbox";
import { useSuratId } from "@/hooks/use-surat-id";
import { cn } from "@/lib/utils";
import { formatDateAgo } from "@/utils/date/ago";
import { Circle, Paperclip } from "lucide-react";
import ButtonPrintDispo from "./button-print-dispo";

// ini g ngaruh <T> di MailListItemProps krn klo generic TS g bs check misalnya mail.berita_file itu ada di InboxCuxImported
interface IMailListItemProps<T> {
  mail: T;
}

const MailListItem = <T,>({ mail }: IMailListItemProps<InboxCuxImported>) => {
  const { setSuratId } = useSuratId();
  const handleClick = () => {
    if (!mail.berita_file) return;
    setSuratId(mail.arsip_kd);
  };
  return (
    <div className="py-2 px-2 hover:bg-slate-100 hover:cursor-pointer border-b-2 border-b-slate-50">
      <div className="flex flex-row gap-6 items-center">
        <div
          className={cn(
            "hidden md:block md:w-[20px] h-[20px] rounded-full",
            mail.rahasia.trim() === "1" ? "bg-red-500" : "bg-blue-500"
          )}
        >
          <Circle
            size={20}
            className="text-white"
            fill={mail.rahasia.trim() === "1" ? "#A34343" : "#FBF8DD"}
          />
        </div>
        <div className="flex flex-col grow">
          <div className="text-blue-600 text-sm">
            <div className="font-semibold ">{mail.nama_perwakilan}</div>
            <div className="flex flex-row">
              <span>
                {mail.berita_file && <Paperclip className="w-3 h-3" />}
              </span>
              <span className="flex-grow">
                {mail.arsip_kd} - {mail.berita_kd}
              </span>
              <span>{formatDateAgo(mail.created_at)}</span>
            </div>
          </div>
          <div>
            <div>
              <p
                className={cn(
                  "line-clamp-2 text-gray-900 font-semibold",
                  mail.status_disposisi === "Y"
                    ? "font-normal"
                    : "font-semibold"
                )}
              >
                {mail.perihal_berita}
              </p>
            </div>
            <div></div>
          </div>
          <div className="hidden justify-end w-full md:flex gap-2 mt-2">
            {mail.rahasia === "1" && <ButtonPrintDispo id={mail.arsip_kd} />}
            <Button variant={"outline"} onClick={handleClick}>
              Preview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MailListItem;
