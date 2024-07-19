"use client";
import { PdfPreview } from "@/components/pdf-preview";
import { useSuratId } from "@/hooks/use-surat-id";
import { useToggleFormDispo } from "@/hooks/use-toggle-form-dispo";
import { cn } from "@/lib/utils";
import { useState } from "react";

const MailboxDetail = () => {
  const { suratId } = useSuratId();
  const [isLoading, setIsLoading] = useState(true);
  const { onOff, toggle } = useToggleFormDispo();

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
      <PdfPreview
        fileUrl={`/api/files?id=${suratId}`}
        className="h-[calc(100vh-135px)]"
      />
    </div>
  );
};

export default MailboxDetail;
