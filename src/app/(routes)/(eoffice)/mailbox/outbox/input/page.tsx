import PdfPreviewContainer from "@/components/pdf-preview-container";
import FormContainer from "./_components/form-container";

const OutboxInboxPage = () => {
  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex flex-col h-full w-full gap-2 p-2 text-slate-500">
        <h1 className="font-semibold text-xl px-2 md:px-4 bg-">
          Catat Berita Keluar (Komunikasi)
        </h1>
        <div className="flex lg:flex-row flex-col">
          <div className="flex w-full lg:w-1/2 mb-10">
            <FormContainer />
          </div>
          <div className="hidden md:flex md:w-full lg:w-1/2 md:h-[600px] lg:h-[calc(100vh-155px)] bg-gray-500">
            <PdfPreviewContainer className="h-[calc(100vh-135px)]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutboxInboxPage;
