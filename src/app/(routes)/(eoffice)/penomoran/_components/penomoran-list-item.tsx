"use client";
import { Button } from "@/components/ui/button";
import { useSuratId } from "@/hooks/use-surat-id";
import { cn } from "@/lib/utils";
import { DokumenKeluar } from "@/zod/schemas/penomoran";
import { Eye, Paperclip } from "lucide-react";
import Link from "next/link";

interface PenomoranListItemProps<T> {
  mail: T;
}

const PenomoranListItem = ({ mail }: PenomoranListItemProps<DokumenKeluar>) => {
  const { setSuratId, suratId } = useSuratId();
  const handleClick = () => {
    setSuratId(mail.id?.toString() ?? "");
    console.log(mail.nomor);
  };
  return (
    <div
      className={cn(
        "py-1 px-2 hover:bg-slate-100 hover:cursor-pointer border-b-2 border-b-slate-50",
        suratId === mail.id?.toString() && "bg-blue-200 hover:bg-blue-100"
      )}
      onClick={handleClick}
    >
      <div className="flex flex-col text-sm relative">
        <div className="text-blue-500">
          <div className="text-lg flex-auto flex gap-1">
            {mail.nomor?.trim()}
          </div>
        </div>
        <div>
          <div className="flex flex-col">
            <p
              className={cn(
                "line-clamp-2 md:line-clamp-3 text-primary text-md "
              )}
            >
              {mail.perihal?.trim()}
            </p>
          </div>
          <div className="text-xs my-1 flex flex-row">
            <span>
              {mail.tanggalDokumen?.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
        {suratId === mail.id?.toString() && (
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
              href={`/api/files?id=${mail.id}&inout=keluar`}
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

export default PenomoranListItem;
