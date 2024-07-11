"use server";
import { ActionResponse, ErrorResponse } from "@/actions/response";
import { simpanBerita, updateBeritaFile } from "@/data/berita";
import { getInboxForEditing } from "@/data/inbox";
import { uploadFile } from "@/lib/legacy-edispo/upload-file";
import { setPassword } from "@/lib/pdf";
import { BASE_PATH_UPLOAD, saveFile } from "@/lib/save-file";
import { Berita, BeritaWithoutFile } from "@/zod/schemas/berita";
import { auth } from "@auth/auth";
import fs from "fs";
import { revalidatePath } from "next/cache";
import path from "path";

interface simpanResponse {
  success: boolean;
  message: string;
  data?: Berita & { saved_file?: string };
}

interface SimpanDokumenMasukResult extends Berita {
  saved_file: string;
}

export const simpanDokumenMasuk = async (
  formData: FormData
): Promise<ActionResponse<SimpanDokumenMasukResult>> => {
  //console.log(" formData:", formData);
  //console.log("Simpan Data:", berita);

  // JIKA EDIT BOLEH TIDAK ADA FILE
  // SYARATNYA HARUSNYA ADA arsip_kd
  // klo tidak ada arsip_kd berarti ini data baru dan harus upload file

  const file = formData.get("file");
  const berita: Berita = JSON.parse(formData.get("berita") as string);
  console.log("berita", berita);
  //berita.berita_file = file;

  try {
    // ===================================================
    // WARNING
    // ===================================================
    // perbedaan di tbl_berita dan tbl_berita_keluar
    // jika di tbl_berita sifat_kd = 2 maka berita rahasia
    // jika di tbl_berita_keluar sifat_kd = 1 maka berita rahasia
    //

    // ===================================================
    // WARNING
    // SAVE FILE FIRST BEFORE SAVING THE DATA
    // ===================================================
    const tmpPath = path.join(process.cwd(), "files", "tmp");
    let savedFilePath = "";

    console.log("[CHECK FILE]", file);
    const isFile = file instanceof File;

    if (isFile) {
      const save = await saveFile({
        file,
        filesFolder: tmpPath,
      });
      if (!save.success) {
        return save as ErrorResponse;
      }
      savedFilePath = save.data.path;
    }

    let yearlyFolder;

    const session = await auth();

    berita.berita_input_user = session?.user.user_kd;
    berita.berita_input_fungsi = session?.user.fungsi_kd;

    const beritaBaru = await simpanBerita(berita);
    console.log("[simpanBerita]", beritaBaru);

    // Move the file to the final destination
    // DO NOT PROCESS THE FILE IF THERE IS NO FILE
    if (!isFile) {
      revalidatePath("/mailbox/inbox");

      return {
        success: true,
        message: "Data saved successfully, No file updated",
        data: {
          ...berita,
          arsip_kd: beritaBaru.arsip_kd,
          saved_file: "",
        },
      };
    }

    //====================================================
    // WARNING
    // PROSES FILE
    //====================================================
    const currentDate = new Date();
    const year = currentDate.getFullYear();

    const BRPath = beritaBaru.sifat_kd === 2 ? "RAHASIA" : "BIASA";

    if (!BASE_PATH_UPLOAD || !fs.existsSync(BASE_PATH_UPLOAD)) {
      console.warn("BASE_PATH_UPLOAD not found, using process.cwd()");
      yearlyFolder = path.join(process.cwd(), "files", BRPath, year.toString());
    } else {
      // BASE_PATH_UPLOAD must exist before creating child folders
      yearlyFolder = path.join(BASE_PATH_UPLOAD, BRPath, year.toString());
    }

    if (!fs.existsSync(yearlyFolder)) {
      fs.mkdirSync(yearlyFolder, { recursive: true });
    }
    // new name for the file
    const newFileName =
      beritaBaru.arsip_kd + "_" + path.basename(savedFilePath);

    const finalPath = path.join(yearlyFolder, newFileName);
    // if Berita Rahasia then encrypt the file by password

    if (beritaBaru.sifat_kd === 2) {
      const passwordedPdf = await setPassword(savedFilePath, finalPath);
      if (!passwordedPdf.success) {
        //jika tidak bs di password gmn ? upload ulang ? krn sdh terlanjur di save
        return passwordedPdf;
      }
    } else {
      fs.renameSync(savedFilePath, finalPath);
    }

    // LEGACY EDISPO
    // if LEGACY_EDISPO_ENABLED is true, upload the file to the legacy edispo
    const inout = "masuk";
    const fileData = await fs.promises.readFile(finalPath);
    const id = beritaBaru.arsip_kd;
    const upload = await uploadFile(newFileName, fileData, year, id, inout);

    if (!upload.success) {
      upload.error += " | File gagal diupload ke server edispo";
      return upload;
    }

    const updateBerita = await updateBeritaFile(
      beritaBaru.arsip_kd,
      newFileName
    );

    revalidatePath("/mailbox/inbox");

    return {
      success: true,
      message: "Data saved successfully",
      data: {
        ...berita,
        arsip_kd: beritaBaru.arsip_kd,
        saved_file: newFileName,
      },
    };
  } catch (error) {
    console.error("Failed to save data:", error);
    return { success: false, error: "Failed to save data" };
  }
};

export const getDokumenMasukForEditing = async (
  arsip_kd: string
): Promise<ActionResponse<BeritaWithoutFile | null>> => {
  const data = await getInboxForEditing(arsip_kd);
  return {
    success: true,
    message: "Data fetched successfully",
    data,
  };
};
