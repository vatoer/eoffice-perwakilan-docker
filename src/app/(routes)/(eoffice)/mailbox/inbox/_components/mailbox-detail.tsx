"use client";
import { PdfPreview } from "@/components/pdf-preview";
import { useSuratId } from "@/hooks/use-surat-id";
import { useToggleFormDispo } from "@/hooks/use-toggle-form-dispo";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const MailboxDetail = () => {
  const { suratId } = useSuratId();
  const { onOff, toggle } = useToggleFormDispo();

  const [isLoading, setIsLoading] = useState(true);

  console.log("MailboxDetail " + suratId);

  useEffect(() => {
    if (suratId) {
      setIsLoading(true);
    }
  }, [suratId]);

  if (!suratId) {
    return (
      <div
        className={cn(
          onOff ? "md:hidden lg:flex" : "md:flex",
          "flex flex-row w-full h-full"
        )}
      >
        Silakan klik surat untuk melihat berkas PDF
      </div>
    );
  }

  return (
    <div
      className={cn(
        onOff ? "md:hidden lg:flex" : "md:flex",
        "flex flex-row w-full h-full"
      )}
    >
      <div className="flex flex-col w-full">
        <PdfPreview
          fileUrl={`/api/files?id=${suratId}`}
          className="h-[calc(100vh-100px)]"
        />
      </div>
    </div>
  );
};

export default MailboxDetail;
