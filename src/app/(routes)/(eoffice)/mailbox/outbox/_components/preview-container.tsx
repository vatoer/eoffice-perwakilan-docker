"use client";
import PdfPreview from "@/components/pdf-preview";
import { useSuratId } from "@/hooks/use-surat-id";
import { cn } from "@/lib/utils";

const PdfPreviewContainer = () => {
  const { suratId } = useSuratId();
  const height = "h-[calc(100vh-82px)]";
  if (!suratId) {
    return (
      <div className={cn(height, "hidden md:block md:w-full  bg-gray-400")}>
        Silakan klik surat untuk melihat berkas PDF
      </div>
    );
  }
  return (
    <div className="w-full h-full">
      <PdfPreview
        fileUrl={`/api/files?id=${suratId}&inout=keluar`}
        className={`md:block md:w-full ${height}`}
      />
    </div>
  );
};

export default PdfPreviewContainer;
