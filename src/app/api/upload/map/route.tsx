import { dbEdispo } from "@/lib/db-edispo";
import {
  fixPdf,
  getOutputFilePath,
  setPasswordForPDF,
} from "@/utils/pdf-utils";
import { FILESERVER_URL, JWT } from "@api/files/_utils/fetcher";
import axios from "axios";
import fs from "fs";
import https from "https";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

/**
 * R = rahasia, B = biasa
 */
type TKlasifikasiKerahasiaan = "B" | "R";

interface EncKey {
  user_key: string;
  admin_key: string;
}

interface FileResult {
  filename: string;
}

interface CuxData {
  kd_berita: string;
  perihal_berita: string;
  map_to: string | null;
}

export interface MappedResult {
  message: string;
  error?: string | null;
  mapppedFiles: MapFile[];
  unmapppedFiles: MapFile[];
}

export interface MapFile {
  filename: string;
  error: string | null;
  newFilename?: string;
  nomorBerita?: string;
  perihal?: string;
}

export const POST = async (
  req: NextRequest
): Promise<NextResponse<MappedResult>> => {
  let mapppedFiles: MapFile[] = [];
  let unmapppedFiles: MapFile[] = [];

  try {
    if (!JWT) {
      throw new Error("JWT token not found");
    }

    const jwt = JWT;

    const data = await req.formData();
    const nameOfFiles = data.get("nameOfFiles") as string;
    const nameOfFilesArray = JSON.parse(nameOfFiles);
    console.log(nameOfFilesArray);

    const filesFolder = path.join(process.cwd(), "files");

    await processFiles(
      filesFolder,
      nameOfFilesArray,
      jwt,
      mapppedFiles,
      unmapppedFiles
    );

    console.log("File upload complete");

    return NextResponse.json({
      message: "automap complete",
      mapppedFiles,
      unmapppedFiles,
    });
  } catch (err) {
    const error = err as Error;
    console.error("Error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error.message,
        mapppedFiles,
        unmapppedFiles,
      },
      { status: 500 }
    );
  } finally {
    console.log("Mapping complete");
  }
};

const checkFileExists = (
  directory: string,
  filename: string
): FileResult | null => {
  const filePath = path.join(directory, filename);
  return fs.existsSync(filePath) ? { filename } : null;
};

const processFiles = async (
  filesDirectory: string,
  fileNames: string[],
  jwtToken: string,
  mapppedFiles: MapFile[],
  unmapppedFiles: MapFile[]
): Promise<void> => {
  const activeKey = await getActiveKeyForToday();

  for (const filename of fileNames) {
    try {
      // Check table tbl_cux
      const cuxData = await checkCuxTable(filename, 2024);

      if (!cuxData) {
        console.error(`Data not found in tbl_cux for file '${filename}'`);
        unmapppedFiles.push({ filename, error: "Data not found in tbl_cux" });
        continue;
      }

      if (!cuxData.map_to) {
        console.error(`'map_to' column is empty for file '${filename}'`);
        unmapppedFiles.push({ filename, error: "'map_to' column is empty" });
        continue;
      }

      const fileResult = checkFileExists(filesDirectory, filename);
      if (fileResult) {
        let fileData: Buffer;
        try {
          // set password for rahasia PDF
          if (cuxData.kd_berita.slice(0, 1) === "R") {
            if (!activeKey) {
              console.error("No active key found for today");
              unmapppedFiles.push({
                filename,
                error: "No active key found for today",
              });
              continue; // Skip to next file
            }

            const filePath = path.join(filesDirectory, filename);
            const outputFilePath = getOutputFilePath(filePath);
            // const outputFilePath = path.join(
            //   filesDirectory,
            //   `${filename}_protected.pdf`
            // );
            await setPasswordDokumenRahasia(
              filePath,
              outputFilePath,
              activeKey
            );
            fileData = await fs.promises.readFile(outputFilePath);
          } else {
            console.log("File is not rahasia");
            fileData = await fs.promises.readFile(
              path.join(filesDirectory, filename)
            );
          }

          const newFilename = formatFileName(filename, cuxData.map_to);

          const uploaded = await uploadFile(
            newFilename,
            fileData,
            2024,
            "1234",
            jwtToken
          );

          if (uploaded.error) {
            unmapppedFiles.push(uploaded);
          } else {
            await updateTblBerita(
              cuxData,
              filename,
              uploaded.filename,
              mapppedFiles
            );
          }
        } catch (err) {
          const error = err as Error;
          console.error(`Error reading file '${filename}':`, error);
          unmapppedFiles.push({ filename, error: error.message });
        }
      } else {
        console.error(`File '${filename}' does not exist.`);
        unmapppedFiles.push({ filename, error: "File does not exist" });
      }
    } catch (err) {
      const error = err as Error;
      console.error(`Error processing file '${filename}':`, error);
      unmapppedFiles.push({ filename, error: error.message });
    }
  }
};

const updateTblBerita = async (
  cuxData: CuxData,
  filename: string,
  beritaFile: string,
  mapppedFiles: MapFile[]
): Promise<void> => {
  if (!cuxData.map_to) {
    console.error("map_to is empty");
    return;
  }

  try {
    const arsipKd = cuxData.map_to;
    const data = await dbEdispo.tbl_berita.update({
      where: {
        arsip_kd: arsipKd,
      },
      data: {
        berita_file: beritaFile,
      },
    });
    console.log("Updated table berita:", data);
    mapppedFiles.push({
      nomorBerita: cuxData.kd_berita,
      perihal: cuxData.perihal_berita,
      filename: filename,
      newFilename: beritaFile,
      error: null,
    });
  } catch (err) {
    const error = err as Error;
    console.error("Error updating table berita:", error);
  }
};

const checkCuxTable = async (
  filename: string,
  tahun: number
): Promise<CuxData | null> => {
  const splitFileName = filename.split(" ");
  const noAgenda = splitFileName[0];
  const noBerita = splitFileName[1];
  const br: TKlasifikasiKerahasiaan = splitFileName[2].slice(
    0,
    1
  ) as TKlasifikasiKerahasiaan;
  const tahun2Digit = tahun.toString().slice(-2);

  try {
    const cuxData = await dbEdispo.tbl_cux.findFirst({
      where: {
        kd_berita: {
          startsWith: `${br}-${noBerita}`,
          contains: `/${tahun2Digit}`,
        },
        no_agenda: noAgenda,
        map_to: {
          not: null,
        },
      },
    });
    console.log(filename);
    console.log(cuxData);
    return cuxData;
  } catch (err) {
    const error = err as Error;
    console.error("Error:", error);
    return null;
  }
};

const formatFileName = (filename: string, arsipKd: string): string => {
  const filenameUnderscore = filename.replace(/ /g, "_");
  return `${arsipKd}_${filenameUnderscore}`;
};

const uploadFile = async (
  newFilename: string,
  fileData: Buffer,
  year: number,
  id: string,
  jwtToken: string
): Promise<MapFile> => {
  const formData = new FormData();
  formData.append("file", new Blob([fileData]), newFilename);
  formData.append("year", year.toString());
  formData.append("id", id);
  formData.append("inout", "masuk");

  try {
    const response = await axios.post(
      `${FILESERVER_URL}/upload.php`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${jwtToken}`,
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
      return { filename: newFilename, error: null };
    } else {
      console.error("Invalid response received:", response);
      return { filename: newFilename, error: "Invalid response received" };
    }
  } catch (err) {
    const error = err as Error;
    console.error(`Error uploading file '${newFilename}':`, error);
    return { filename: newFilename, error: error.message };
  }
};

const setPasswordDokumenRahasia = async (
  inputFilePath: string,
  outputFilePath: string,
  activeKey: EncKey
) => {
  if (!activeKey) {
    console.error("No active key found for today");
    return;
  }

  const userPassword = activeKey.user_key;
  const ownerPassword = activeKey.admin_key;
  const maxRetries = 1;
  let tryFixCount = 0;
  try {
    const passwordedPdf = await setPasswordForPDF(
      inputFilePath,
      outputFilePath,
      userPassword,
      ownerPassword
    );
    return passwordedPdf;
  } catch (error) {
    if (tryFixCount < maxRetries) {
      tryFixCount++;
      console.log("Trying to fix the PDF file...");
      await fixPdf(inputFilePath);
      return setPasswordForPDF(
        inputFilePath,
        outputFilePath,
        userPassword,
        ownerPassword
      );
    }
  }
};

const getActiveKeyForToday = async (): Promise<EncKey | null> => {
  const today = new Date();
  try {
    const activeKey = await dbEdispo.tbl_enc_key.findFirst({
      where: {
        AND: [
          {
            start_date: {
              lte: today, // start_date is less than or equal to today
            },
          },
          {
            end_date: {
              gte: today, // end_date is greater than or equal to today
            },
          },
        ],
      },
    });

    if (!activeKey) {
      //console.error("No active key found for today");
      return null;
    }

    if (!activeKey.user_key || !activeKey.admin_key) {
      console.error("User or admin key not found");
      return null;
    }

    const { user_key, admin_key } = activeKey;

    return { user_key, admin_key };
  } catch (error) {
    console.error("Error retrieving active key:", error);
    throw error;
  } finally {
    await dbEdispo.$disconnect();
  }
};
