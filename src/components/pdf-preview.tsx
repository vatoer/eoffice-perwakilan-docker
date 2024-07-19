"use client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface PdfViewerSkeletonProps {
  placeholder?: string;
  className?: string;
  isLoading?: boolean;
}

const PdfViewerSkeleton = ({
  placeholder,
  className,
  isLoading = true,
}: PdfViewerSkeletonProps) => (
  <div
    className={cn(
      "pdf-viewer-skeleton w-full bg-gray-200 ",
      isLoading && "h-96 animate-pulse",
      className && className
    )}
  >
    <div className="flex flex-col h-full items-center justify-center text-gray-500">
      {placeholder || "Loading ..."}
    </div>
  </div>
);

interface PdfPreviewProps {
  fileUrl?: string | null;
  className?: string;
}

export const PdfPreview = ({ fileUrl, className }: PdfPreviewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);

  // Reset isLoading state when fileUrl changes
  useEffect(() => {
    const loadPdf = async () => {
      if (!fileUrl) {
        handleError();
        return;
      }
      setIsLoading(true); // Set loading state to true when a new fileUrl is set
      try {
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        setIframeSrc(blobUrl);
      } catch (error) {
        handleError();
      } finally {
        setIsLoading(false);
      }
    };
    setIframeSrc(null);
    loadPdf();
  }, [fileUrl]);

  if (!fileUrl) {
    return (
      <div className="w-full  border-2 border-t-0">
        <PdfViewerSkeleton
          className={className + " animate-none "}
          placeholder="pdf preview"
        />
      </div>
    );
  }

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    // Optionally, add error handling logic here
    console.error("Failed to load PDF file");
  };

  if (!fileUrl) {
    return (
      <div className="w-full border-2 border-t-0">
        <PdfViewerSkeleton
          className={className + " animate-none "}
          placeholder="pdf preview"
        />
      </div>
    );
  }

  return (
    <div className="w-full border-2 border-t-0 h-full">
      {isLoading && <PdfViewerSkeleton className={className} />}
      {!iframeSrc && !isLoading && (
        <PdfViewerSkeleton
          className={className}
          placeholder="file not found"
          isLoading={isLoading}
        />
      )}
      {iframeSrc && !isLoading && (
        <iframe
          src={iframeSrc}
          className={cn(`w-full`, className && className)}
          onLoad={() => setIsLoading(false)}
        />
      )}
    </div>
  );
};

export default PdfPreview;
