"use server";

import { isExistDisposisi } from "@/data/disposisi/disposisi";
import {
  disposisiCreate,
  disposisiUpdate,
} from "@/data/disposisi/simpan-disposisi";
import { dbEdispo } from "@/lib/db-edispo";
import { auth } from "@auth/auth";
import { revalidatePath } from "next/cache";

export const simpanDisposisi = async (
  arsipKd: string,
  instruksi: { [key: number]: number },
  fungsi: { [key: number]: number },
  catatan?: string
) => {
  console.log("arsipKd", arsipKd);
  console.log("instruksi", instruksi);
  console.log("fungsi", fungsi);

  const session = await auth();

  if (!session) {
    return new Error("Unauthorized");
  }

  const userFungsiKd = session.user.fungsi_kd;
  const userKd = session.user.user_kd;
  const isExist = await isExistDisposisi(arsipKd);

  if (isExist) {
    const { disposisi_kd } = isExist;
    const updatedDisposisi = await disposisiUpdate({
      arsipKd,
      instruksi,
      fungsi,
      catatan,
      disposisiOleh: userKd,
      disposisiKd: disposisi_kd,
    });
    // update disposisi
    return updatedDisposisi;
  } else {
    // insert disposisi
    const newDisposisi = await disposisiCreate({
      arsipKd,
      instruksi,
      fungsi,
      catatan,
      disposisiOleh: userKd,
    });
    return newDisposisi;
  }
};

//export const tanggapiDisposisi = async () => {};

export const terimaDisposisi = async (
  arsip_kd: string,
  disposisi_kd: number,
  disposisi_detail_kd: number,
  tanggapan?: string
) => {
  try {
    // check user permission

    const session = await auth();

    if (
      !session ||
      !session.user.permissions.includes("read:disposisi") ||
      !session.user.fungsi_kd
    ) {
      return new Error("Unauthorized");
    }

    const fungsi_kd = session.user.fungsi_kd;
    const nama_lengkap = session.user.nama_lengkap;

    // Start transaction
    const disposisi = await dbEdispo.$transaction(async (db) => {
      await db.tbl_disposisi_detail.update({
        where: {
          disposisi_kd: disposisi_kd,
          disposisi_detail_kd,
          detail_fungsi_kd: fungsi_kd,
        },
        data: {
          detail_terima: "Y",
          detail_waktu: new Date(),
        },
      });

      await db.tbl_korespondensi.create({
        data: {
          arsip_kd: arsip_kd,
          user_nama: nama_lengkap,
          korespondensi_komentar: tanggapan || "Telah diterima",
          korespondensi_datetime: new Date(),
        },
      });

      revalidatePath("/mailbox/disposisi");

      return true;
    });
    return disposisi;
  } catch (err) {
    const error = err as Error;
    console.error("Transaction rolled back:", error);
    return error;
  }
};

export const telahDilaksanakan = async (
  arsip_kd: string,
  disposisi_kd: number,
  disposisi_detail_kd: number,
  tanggapan?: string
) => {
  try {
    // check user permission

    const session = await auth();

    if (
      !session ||
      !session.user.permissions.includes("read:disposisi") ||
      !session.user.fungsi_kd
    ) {
      return new Error("Unauthorized");
    }

    const fungsi_kd = session.user.fungsi_kd;
    const nama_lengkap = session.user.nama_lengkap;

    // Start transaction
    const disposisi = await dbEdispo.$transaction(async (db) => {
      const updateDetail = await db.tbl_disposisi_detail.updateMany({
        where: {
          disposisi_kd: disposisi_kd,
          disposisi_detail_kd,
          detail_fungsi_kd: fungsi_kd,
          detail_perhatian: "Y",
          AND: {
            OR: [
              { berita_status_pengerjaan: null },
              { berita_status_pengerjaan: { not: "Y" } },
            ],
          },
        },
        data: {
          detail_terima: "Y",
          detail_waktu: new Date(),
          berita_status_pengerjaan: "Y",
          detail_korespondensi: tanggapan || "Telah dilaksanakan",
        },
      });

      if (updateDetail.count === 0) {
        console.error(
          "Failed to update disposisi detail",
          new Date(Date.now()).toLocaleString()
        );
        return false;
      }

      await db.tbl_korespondensi.create({
        data: {
          arsip_kd: arsip_kd,
          user_nama: nama_lengkap,
          korespondensi_komentar: tanggapan || "Telah dilaksanakan",
          korespondensi_datetime: new Date(),
        },
      });

      revalidatePath("/mailbox/disposisi");

      return true;
    });
    return disposisi;
  } catch (err) {
    const error = err as Error;
    console.error("Transaction rolled back:", error);
    return error;
  }
};
