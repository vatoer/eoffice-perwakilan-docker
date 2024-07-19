"use client";

import PdfPreview from "@/components/pdf-preview";
import { useSuratId } from "@/hooks/use-surat-id";

const PreviewContainer = () => {
  const { suratId } = useSuratId();

  if (!suratId) return <>Silakan pilih surat untuk melihat berkas pdf</>;

  const fileUrl = `/api/files?id=${suratId}`;

  return (
    <div>
      <PdfPreview
        fileUrl={fileUrl}
        className="w-full min-h-[calc(100vh-135px)]"
      />
    </div>
  );
};

export default PreviewContainer;
