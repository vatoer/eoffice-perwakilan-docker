import PdfPreviewContainer from "@/components/pdf-preview-container";
import FormContainer from "./_components/form-container";

const InboxInputPage = () => {
  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex flex-col h-full w-full gap-2 p-2 text-slate-500">
        <h1 className="font-semibold text-l px-2 md:px-4">
          Catat Dokumen Masuk
        </h1>
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormContainer />
          </div>
          <div className="hidden md:flex md:w-full lg:w-1/2 md:h-[600px] lg:h-[calc(100vh-135px)] bg-gray-500">
            <PdfPreviewContainer className="lg:h-[calc(100vh-135px)] bg-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InboxInputPage;
