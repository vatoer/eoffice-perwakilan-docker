import { ActionResponse } from "@/actions";
import { fileTypeFromBuffer } from "file-type";
import fs from "fs";
import path from "path";

export const BASE_PATH_UPLOAD = process.env.BASE_PATH_UPLOAD;

type SaveFileOptions = {
  file: File;
  filesFolder?: string;
  allowedMimeTypes?: string[];
};

interface SaveFileResult {
  path: string;
}

const sanitizeFilename = (filename: string) => {
  //allow only alphanumeric characters and underscores and dot and replace other characters with underscores
  return filename.replace(/[^a-z0-9_.]/gi, "_");
};

export const saveFile = async ({
  file,
  filesFolder,
  allowedMimeTypes = ["application/pdf", "image/jpeg", "image/png"],
}: SaveFileOptions): Promise<ActionResponse<SaveFileResult>> => {
  try {
    const filename = sanitizeFilename(path.basename(file.name));

    // check if file is not empty
    if (!file) {
      return { success: false, error: "File is required" };
    }

    // check if fileFolder is defined
    if (!filesFolder) {
      filesFolder = path.join(process.cwd(), "files");
    }
    //const filesFolder = path.join(process.cwd(), "files");
    if (!fs.existsSync(filesFolder)) {
      fs.mkdirSync(filesFolder);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine the file type
    const fileType = await fileTypeFromBuffer(buffer);
    //const allowedMimeTypes = ["application/pdf", "image/jpeg", "image/png"];
    console.log("fileType", fileType);

    if (!fileType || !allowedMimeTypes.includes(fileType.mime)) {
      return { success: false, error: "Invalid file type" };
    }

    // Write the file to the /files folder
    const fullPath = path.join(filesFolder, filename);
    fs.writeFileSync(fullPath, buffer);

    return {
      success: true,
      message: "file saved",
      data: { path: fullPath },
    };
  } catch (error) {
    console.error("Failed to save file:", error);
    return { success: false, error: "Failed to save data" };
  }
};
