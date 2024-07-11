"use client";

import PdfPreview from "@/components/pdf-preview";
import useFileStore from "@/hooks/use-file-store";

const PdfPreviewContainer = () => {
  const fileUrl = useFileStore((state) => state.fileUrl);

  return <PdfPreview fileUrl={fileUrl} />;
};

export default PdfPreviewContainer;
