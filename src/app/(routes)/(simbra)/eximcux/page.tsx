import { importCux } from "@/actions/import-cux";
import { ReturnType } from "@/actions/import-cux/types";

import CuxDropzone from "./_components/cux-dropzone";

const EximcuxPage = () => {
  const upload = async (parsedData: any[]): Promise<ReturnType> => {
    "use server";
    //console.log("parsedData", parsedData);
    //console.log("uploading file");
    const result = await importCux(parsedData);
    return result;
  };
  return (
    <div className="p-2">
      <CuxDropzone onUpload={upload} />
    </div>
  );
};

export default EximcuxPage;
