"use client";
import PdfPreview from "@/components/pdf-preview";
import useFileStore from "@/hooks/use-file-store";
import { DokumenKeluar } from "@/zod/schemas/penomoran";
import { useState } from "react";
import FormPenomoran from "./form";
import TablePenomoran from "./table-penomoran";
interface Option {
  value: string;
  label: string;
}
const FormContainer = () => {
  const fileUrl = useFileStore((state) => state.fileUrl);
  const [jenis, setJenis] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(0);

  const handleChangeJenis = (value: string) => {
    setJenis(value);
  };
  const handleOnSave = (dokumen: DokumenKeluar) => {
    const timeNow = new Date().getTime();
    setLastUpdate(timeNow);
  };

  return (
    <div className="flex flex-col h-full w-full gap-2 p-2 text-slate-500">
      <h1 className="font-semibold text-xl px-2 md:px-4">
        Penomoran Dokumen Keluar
      </h1>
      <div className="flex lg:flex-row flex-col">
        <div className="flex  flex-col w-full lg:w-1/2 mb-10">
          <FormPenomoran
            handleChangeJenis={handleChangeJenis}
            handleOnSave={handleOnSave}
          />
        </div>
        <div
          className="md:w-full lg:w-1/2 md:h-[600px] lg:h-[calc(100vh-155px)]
        overflow-auto
        "
        >
          {fileUrl && (
            <div className="hidden md:flex  md:h-full w-full lg:h-[calc(100vh-180px)] bg-gray-500">
              <PdfPreview fileUrl={fileUrl} />
            </div>
          )}
          {!fileUrl && <TablePenomoran jenis={jenis} lastUpdate={lastUpdate} />}
        </div>
      </div>
    </div>
  );
};

export default FormContainer;
