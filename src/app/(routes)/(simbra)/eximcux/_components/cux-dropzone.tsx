"use client";

import { ReturnType } from "@/actions/import-cux/types";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ParseResult } from "papaparse";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { columns } from "./columns";
import CsvDropzone from "./csv-dropzone";
import { DataTable } from "./data-table";

interface CuxDropzoneProps {
  //onUpload: (result: ParseResult<unknown>) => void;
  onUpload: (data: any[]) => Promise<ReturnType>;
}

const CuxDropzone = ({ onUpload }: CuxDropzoneProps) => {
  const [data, setData] = useState([] as any);
  //const [pendispo, setPendispo] = useState<Record<string, string>[]>([]);
  const [parseResult, setParseResult] = useState<ParseResult<unknown>>();
  //const [isLoading, setLoading] = useState(true);
  const [isReadyToImport, setIsReadyToImport] = useState(false);

  const modifyResult = (result: ParseResult<unknown>): ParseResult<unknown> => {
    const modifiedData = result.data.map((row: any) => {
      const modifiedRow = { ...row };
      modifiedRow["IS_DISPOSISI"] = true;
      modifiedRow["PENDISPO"] = null;
      return modifiedRow;
    });
    result.data = modifiedData;
    //console.log("modify", modifiedData);
    return result;
  };

  const handleOnCompleteParse = (result: ParseResult<unknown>) => {
    //console.log("on complete parse [CUX DROPZONE]");
    setParseResult(modifyResult(result));
    setIsReadyToImport(true);
    //setData(result);
  };

  const handleOnChange = (data: any) => {
    //console.log("on update [CUX DROPZONE]", data);
    setData(data);
  };

  const handleOnUpload = async (data: any) => {
    //console.log("on upload [CUX DROPZONE]", data);

    await onUpload(data).then((result) => {
      if (!result?.error) {
        toast.success(
          "Import " +
            result?.data?.imported +
            " data ke tbl_cux , dari " +
            result?.data?.uploaded +
            " data yang diupload"
        );
        toast.success(
          "menambahkan " +
            result?.data?.inserted +
            " data ke tbl_berita, dari " +
            result?.data?.processed +
            " data"
        );
        setData([]);
        setParseResult(undefined);
        setIsReadyToImport(false);
      }
      console.log("result", result);
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 max-w-full justify-between">
      <CsvDropzone
        //onUpload={onUpload}
        //onModify={modifyResult}
        onCompleteParse={handleOnCompleteParse}
      />

      <div className="flex items-end w-full">
        {isReadyToImport && (
          <Button
            onClick={() => {
              console.log("data", data);
              handleOnUpload(data);
            }}
          >
            Upload Data
          </Button>
        )}
      </div>
      {parseResult?.errors.length === 0 && (
        <div className="w-full">
          <DataTable
            onChange={handleOnChange}
            columns={columns as ColumnDef<unknown, unknown>[]}
            data={parseResult.data}
          />
        </div>
      )}
    </div>
  );
};

export default CuxDropzone;
