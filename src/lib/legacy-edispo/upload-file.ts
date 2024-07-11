import { OperationResult } from "@/types/operation-result";
import axios from "axios";
import https from "https";
import { FILESERVER_URL, JWT } from ".";

export interface MapFile {
  filename: string;
  newFilename?: string;
  nomorBerita?: string;
  perihal?: string;
}

export const uploadFile = async (
  newFilename: string,
  fileData: Buffer,
  year: number,
  id: string,
  inout: string
): Promise<OperationResult<MapFile>> => {
  const formData = new FormData();
  formData.append("file", new Blob([fileData]), newFilename);
  formData.append("year", year.toString());
  formData.append("id", id);
  formData.append("inout", inout);

  try {
    const response = await axios.post(
      `${FILESERVER_URL}/upload.php`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${JWT}`,
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Allow self-signed certificates
      }
    );

    if (response && response.data && response.status) {
      const { message } = response.data;
      const statusCode = response.status;
      console.log("Status Code:", statusCode);
      console.log(
        `File '${newFilename}' uploaded successfully. Message:`,
        message
      );
      return {
        success: true,
        data: { filename: newFilename },
      };
    } else {
      console.error("Invalid response received:", response);
      return {
        success: false,
        error: "Invalid response received",
      };
    }
  } catch (err) {
    const error = err as Error;
    console.error(`Error uploading file '${newFilename}':`, error);
    return {
      success: false,
      error: error.message,
    };
  }
};
