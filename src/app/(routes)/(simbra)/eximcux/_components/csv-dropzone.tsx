"use client";
import Dropzone from "@/components/dropzone";
import { parse, ParseResult } from "papaparse";
import { use, useCallback, useEffect, useState } from "react";
import { DropzoneOptions, FileRejection } from "react-dropzone";

interface CsvDropzoneProps {
  onCompleteParse?: (result: ParseResult<unknown>) => void;
}

const CsvDropzone = ({ onCompleteParse }: CsvDropzoneProps) => {
  const [errorCount, setErrorCount] = useState(0);
  const [isAcceptedFile, setIsAcceptedFile] = useState(false);
  const [acceptedFile, setAcceptedFile] = useState<File>();
  const [parseResult, setParseResult] = useState<ParseResult<unknown>>();

  const handleOnDrop = useCallback(
    (acceptedFiles: File[]) => {
      console.log("on drop called");
      setErrorCount(0);
      if (acceptedFiles.length > 0) {
        setIsAcceptedFile(true);
        setAcceptedFile(acceptedFiles[0]);
        const reader = new FileReader();
        reader.readAsText(acceptedFiles[0]);
        reader.onload = function () {
          const csvData = reader.result;
          const parsedData = parse(csvData as string, {
            header: true,
            skipEmptyLines: true,
            delimiter: "||",
            complete(results) {
              if (results.errors.length > 0) {
                setErrorCount(results.errors.length);
              } else {
                setParseResult(results);
                onCompleteParse && onCompleteParse(results);
              }
            },
            error(err: any, file: any) {
              console.log(err);
              console.log(file);
            },
          });
        };
      }
    },
    [onCompleteParse]
  );

  const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    console.log("on drop called");
    setErrorCount(0);
    if (acceptedFiles.length > 0) {
      handleOnDrop(acceptedFiles);
    }
  };

  const handleUpload = async () => {
    if (parseResult?.errors.length == 0) {
      console.log("uploading file");
      //onUpload(parseResult);
    }
  };

  const option: DropzoneOptions = {
    onDrop,
    accept: {
      "text/csv": [".csv", ".cux"],
      "application/vnd.ms-excel": [".csv"],
    },
    noClick: true,
    noKeyboard: true,
  };

  return (
    <div className="w-full">
      <Dropzone
        options={option}
        className="w-full h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center"
      >
        <p className="text-muted-foreground">
          Drag and drop some files here, or click to select files
        </p>
      </Dropzone>
      {errorCount > 0 && (
        <div className="error-message">
          <p>
            There are {errorCount} errors in the file. Please fix them before
            uploading.
          </p>

          <ul>
            {parseResult?.errors.map((error, idx) => (
              <li key={idx}>
                {"row: " + error.row + ", error: " + error.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CsvDropzone;
