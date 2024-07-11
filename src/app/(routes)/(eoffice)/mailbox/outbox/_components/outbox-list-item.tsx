"use client";
import { Button } from "@/components/ui/button";
import { Outbox } from "@/data/outbox";
import { useSuratId } from "@/hooks/use-surat-id";
import { cn } from "@/lib/utils";
import { formatDateAgo } from "@/utils/date/ago";
import { Circle, Paperclip, PencilLine } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface OutboxListItemProps<T> {
  mail: T;
  userRole: string;
}

const OutboxListItem = <T,>({
  mail,
  userRole,
}: OutboxListItemProps<Outbox>) => {
  const { setSuratId, suratId } = useSuratId();
  const [showButtons, setShowButtons] = useState(false);
  const handleClick = () => {
    setSuratId(mail.arsip_kd);
  };
  function handleOnMouseOver() {
    console.log("Mouse is over the div");
    setShowButtons(true);
    // You can add any logic you want to execute when the mouse is over the div
  }
  // Function to call when mouse leaves the div
  const handleMouseLeave = () => {
    console.log("Mouse has left the div");
    setShowButtons(false);
    // You can add any logic you want to execute when the mouse leaves the div
  };
  return (
    <div
      className={cn(
        "py-1 px-2 hover:bg-slate-100 hover:cursor-pointer border-b-2 border-b-slate-50",
        suratId === mail.arsip_kd && "bg-blue-200 hover:bg-blue-100"
      )}
      onClick={handleClick}
      onMouseOver={handleOnMouseOver}
      onMouseLeave={handleMouseLeave}
    >
      <OutboxListItemButtons
        mail={mail}
        show={showButtons}
        userRole={userRole}
      />
      <div className="flex flex-col text-sm">
        <div className={cn(" flex flex-row gap-2 text-blue-500")}>
          <div>
            <Circle
              size={14}
              fill={mail.sifat_kd === 1 ? "#A34343" : "#FBF8DD"}
            />
          </div>
          <div className="text-xs flex-auto flex gap-1">
            {mail.berita_kd?.trim()}
          </div>
        </div>
        <div>
          <div className="flex flex-col">{mail.perihal_berita}</div>
          <div className="text-xs my-1 flex flex-row">
            <span className="flex-grow">{mail.arsip_kd}</span>

            <span>{formatDateAgo(mail.tgl_berita)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface OutboxListItemButtonsProps {
  mail: Outbox;
  show: boolean;
  userRole: string;
}
const OutboxListItemButtons = ({
  mail,
  show,
  userRole,
}: OutboxListItemButtonsProps) => {
  const router = useRouter();
  const handleOnEdit = () => {
    router.push(`/mailbox/outbox/input?edit=${mail.arsip_kd}`);
  };
  return (
    <div
      className={cn(
        "flex flex-row absolute bg-gray-300 grow",
        "right-0 top-0 bottom-0 justify-start gap-0",
        "border-l-0 border-b-slate-50 animate-in",
        show ? "visible" : "hidden"
      )}
    >
      {userRole === "admin" && (
        <Button
          variant="ghost"
          className="flex flex-col items-center justify-center w-20 h-full bg-red-500 p-2 text-white rounded-none hover:opacity-80 hover:bg-red-500/90"
          onClick={handleOnEdit}
        >
          <PencilLine size={24} />
          <span>Edit</span>
        </Button>
      )}

      <Link
        href={`/api/files?id=${mail.arsip_kd}&inout=keluar`}
        target="_blank"
        className="flex flex-col items-center justify-center w-20 h-full bg-fuchsia-400 p-2 text-white"
      >
        <Paperclip size={24} />
        <span>Download</span>
      </Link>
    </div>
  );
};

export default OutboxListItem;
