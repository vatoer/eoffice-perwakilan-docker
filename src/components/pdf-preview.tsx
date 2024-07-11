"use client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface PdfViewerSkeletonProps {
  placeholder?: string;
  className?: string;
}

const PdfViewerSkeleton = ({
  placeholder,
  className,
}: PdfViewerSkeletonProps) => (
  <div
    className={cn(
      "pdf-viewer-skeleton w-full h-full bg-gray-200 animate-pulse",
      className && className
    )}
  >
    <div className="h-full flex items-center justify-center text-gray-500">
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
  // Reset isLoading state when fileUrl changes
  useEffect(() => {
    setIsLoading(true); // Set loading state to true when a new fileUrl is set
  }, [fileUrl]);

  if (!fileUrl) {
    return (
      <div className="w-full h-full border-2 border-t-0">
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
  };
  return (
    <div className="w-full h-full border-2 border-t-0">
      {isLoading && <PdfViewerSkeleton className={className} />}
      <iframe
        src={fileUrl}
        className={cn(
          `w-full h-full`,
          className && className,
          isLoading && "hidden"
        )}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

export default PdfPreview;
