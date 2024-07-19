"use client";
import PdfPreview from "@/components/pdf-preview";
import { useSuratId } from "@/hooks/use-surat-id";

const PdfPreviewContainer = () => {
  const { suratId } = useSuratId();
  if (!suratId) {
    return (
      <div className="hidden md:block md:w-full h-[calc(100vh-125px)] bg-gray-400">
        Silakan klik surat untuk melihat berkas PDF
      </div>
    );
  }
  return (
    <div className="w-full h-full">
      <PdfPreview
        fileUrl={`/api/files?id=${suratId}&inout=keluar`}
        className="md:block md:w-full h-[calc(100vh-125px)]"
      />
    </div>
  );
};

export default PdfPreviewContainer;
