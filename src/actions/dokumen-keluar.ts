"use server";
import { ActionResponse, ErrorResponse } from "@/actions/response";
import {
  getBeritaKeluarForEditing,
  simpanBeritaKeluar,
  updateBeritaKeluarFile,
} from "@/data/berita-keluar";
import { uploadFile } from "@/lib/legacy-edispo/upload-file";
import { setPassword } from "@/lib/pdf";
import { BASE_PATH_UPLOAD, saveFile } from "@/lib/save-file";
import {
  BeritaKeluar,
  BeritaKeluarEditMode,
} from "@/zod/schemas/berita-keluar";
import fs from "fs";
import { revalidatePath } from "next/cache";
import path from "path";

interface SimpanDokumenKeluarResult extends BeritaKeluar {
  saved_file: string;
}
export const simpanDokumenKeluar = async (
  formData: FormData
): Promise<ActionResponse<SimpanDokumenKeluarResult>> => {
  // JIKA EDIT BOLEH TIDAK ADA FILE
  // SYARATNYA HARUSNYA ADA arsip_kd
  // klo tidak ada arsip_kd berarti ini data baru dan harus upload file
  const file = formData.get("file") as File;
  const beritaKeluar: BeritaKeluar = JSON.parse(
    formData.get("berita_keluar") as string
  );

  // Save the file first before saving the data
  // tmp path = path.join(process.cwd(), "files","tmp");

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

    //const session = await auth();

    // pada berita keluar tidak mencatat siapa yang membuat berita / create by
    // mungkin saat app edispo dibikin asumsinya hanya admin yang bisa membuat berita keluar

    const beritaKeluarbaru = await simpanBeritaKeluar(beritaKeluar);
    console.log("simpan", beritaKeluarbaru);

    // Move the file to the final destination
    // DO NOT PROCESS THE FILE IF THERE IS NO FILE
    if (!isFile) {
      revalidatePath("/mailbox/inbox");

      return {
        success: true,
        message: "Data saved successfully, No file updated",
        data: {
          ...beritaKeluar,
          arsip_kd: beritaKeluarbaru.arsip_kd,
          saved_file: beritaKeluarbaru.berita_file || "",
        },
      };
    }

    const currentDate = new Date();
    const year = currentDate.getFullYear();

    const BRPath = beritaKeluarbaru.sifat_kd === 1 ? "RAHASIA" : "BIASA";

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
      beritaKeluarbaru.arsip_kd + "_" + path.basename(savedFilePath);

    const finalPath = path.join(yearlyFolder, newFileName);

    // if Berita Rahasia then encrypt the file by password

    if (beritaKeluarbaru.sifat_kd === 1) {
      const passwordedPdf = await setPassword(savedFilePath, finalPath);
      if (!passwordedPdf.success) {
        //jika tidak bs di password gmn ? upload ulang ? krn sdh terlanjur di save
        return passwordedPdf;
      }
    } else {
      // if Berita Biasa then move the file to the final destination
      fs.renameSync(savedFilePath, finalPath);
    }

    // LEGACY EDISPO
    // if LEGACY_EDISPO_ENABLED is true, upload the file to the legacy edispo
    const inout = "keluar";
    const fileData = await fs.promises.readFile(finalPath);
    const id = beritaKeluarbaru.arsip_kd;
    const upload = await uploadFile(newFileName, fileData, year, id, inout);

    if (!upload.success) {
      upload.error += " | File gagal diupload ke server edispo";
      return upload;
    }

    const updateBeritaKeluar = await updateBeritaKeluarFile(
      beritaKeluarbaru.arsip_kd,
      newFileName
    );

    revalidatePath("/mailbox/outbox");

    return {
      success: true,
      message: "Berhasil menyimpan dokumen keluar",
      data: {
        ...beritaKeluar,
        arsip_kd: beritaKeluarbaru.arsip_kd,
        saved_file: savedFilePath,
      },
    };
  } catch (err) {
    const error = err as Error;
    return {
      success: false,
      error: error.message,
    };
  }
};

export const getDokumenKeluarForEditing = async (
  arsip_kd: string
): Promise<ActionResponse<BeritaKeluarEditMode | null>> => {
  const data = await getBeritaKeluarForEditing(arsip_kd);

  if (!data) {
    return {
      success: false,
      error: "Data not found",
    };
  }

  return {
    success: true,
    message: "Data fetched successfully",
    data: data,
  };
};
