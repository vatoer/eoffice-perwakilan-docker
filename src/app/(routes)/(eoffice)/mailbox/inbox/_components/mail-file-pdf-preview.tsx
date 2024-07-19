import PdfPreview from "@/components/pdf-preview";

interface MailFilePdfPreviewProps {
  inout: "keluar" | "masuk";
  suratId: string | null;
}
const MailFilePdfPreview = ({ suratId, inout }: MailFilePdfPreviewProps) => {
  if (!suratId) {
    return <p>No file selected</p>;
  }
  return (
    <div className="flex flex-col w-full">
      <PdfPreview
        fileUrl={`/api/files?id=${suratId}&inout=${inout}`}
        className="w-full h-[calc(100vh-135px)]"
      />
    </div>
  );
};

export default MailFilePdfPreview;
