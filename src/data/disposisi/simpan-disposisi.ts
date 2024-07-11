import { dbEdispo } from "@/lib/db-edispo";
import { tbl_disposisi_detail } from "@prisma-dbedispo/client";
import { revalidatePath } from "next/cache";

interface SimpanDisposisiProps {
  arsipKd: string;
  instruksi: { [key: number]: number };
  fungsi: { [key: number]: number };
  catatan?: string;
  disposisiOleh: number;
}
export const disposisiCreate = async (data: SimpanDisposisiProps) => {
  try {
    // Start transaction
    const disposisi = await dbEdispo.$transaction(async (db) => {
      // Insert into tbl_disposisi
      const createdDisposisi = await db.tbl_disposisi.create({
        data: {
          arsip_kd: data.arsipKd,
          disposisi_oleh: data.disposisiOleh,
          tgl_disposisi: new Date(),
          catatan: data.catatan?.trim() || "",
        },
      });

      // Prepare instruksi data for bulk insertion
      const instruksiData = Object.entries(data.instruksi).map(
        ([key, value]) => ({
          arsip_kd: data.arsipKd,
          instruksi_kd: Number(key),
          instruksi_perhatian: "Y",
        })
      );

      // Insert into tbl_disposisi_instruksi
      await db.tbl_disposisi_instruksi.createMany({
        data: instruksiData,
      });

      // (Optional) Prepare and insert into tbl_disposisi_detail or any other required table
      const fungsiData = Object.entries(data.fungsi).map(([key, value]) => ({
        disposisi_kd: createdDisposisi.disposisi_kd,
        detail_fungsi_kd: Number(key),
        detail_terima: "T",
        detail_perhatian: value === 2 ? "Y" : "T",
        status_fungsi: 0,
      }));

      await db.tbl_disposisi_detail.createMany({
        data: fungsiData,
      });

      await db.tbl_berita.update({
        where: { arsip_kd: data.arsipKd },
        data: { status_disposisi: "Y" },
      });

      revalidatePath("/mailbox/inbox");

      return createdDisposisi;
    });
    return disposisi;
  } catch (err) {
    const error = err as Error;
    console.error("Transaction rolled back:", error);
    return error;
  }
};

interface DisposisiUpdateProps extends SimpanDisposisiProps {
  disposisiKd: number;
}

export const disposisiUpdate = async (data: DisposisiUpdateProps) => {
  try {
    const disposisi = await dbEdispo.$transaction(async (db) => {
      //harusnya disposisi unik g sih ini ? atau ini emang didesain seperti itu untuk disposisi lanjutan?
      // kalo ada disposisi lanjutan dan emang bs double disposisi, harusnya ada validasi di awal
      const updatedDisposisi = await db.tbl_disposisi.updateMany({
        where: {
          arsip_kd: data.arsipKd,
        },
        data: {
          catatan: data.catatan?.trim() || "",
          disposisi_oleh: 2,
          tgl_disposisi: new Date(),
        },
      });

      // instruksi bisa langsung dihapus dan diinsert ulang
      // disini deletenya by arsip_kd krn emang binding di db nya begitu
      // kalo secara logika harusnya pake disposisi_kd
      const deleteMany = await db.tbl_disposisi_instruksi.deleteMany({
        where: {
          arsip_kd: data.arsipKd,
        },
      });

      // Prepare instruksi data for bulk insertion
      const instruksiData = Object.entries(data.instruksi).map(
        ([key, value]) => ({
          arsip_kd: data.arsipKd,
          instruksi_kd: Number(key),
          instruksi_perhatian: "Y",
        })
      );

      // Insert into tbl_disposisi_instruksi
      const createInstruksi = await db.tbl_disposisi_instruksi.createMany({
        data: instruksiData,
      });

      const existingFungsi = await db.tbl_disposisi_detail.findMany({
        where: {
          disposisi_kd: data.disposisiKd,
        },
      });
      // console.log("existingFungsi", existingFungsi);

      // (Optional) Prepare and insert into tbl_disposisi_detail or any other required table
      const fungsiData = Object.entries(data.fungsi)
        .filter(([_, value]) => value === 1 || value === 2) // Include only if value is 1 or 2
        .map(([key, value]) => ({
          disposisi_kd: data.disposisiKd,
          detail_fungsi_kd: Number(key),
          detail_terima: "T",
          detail_perhatian: value === 2 ? "Y" : "T", // "Y" for 2, "T" for 1
          status_fungsi: 0,
        }));

      console.log("fungsiDataTerbaru", fungsiData);

      // find should be deleted fungsi
      // if fungsi is in existingFungsi but not in fungsiData
      // search base on detail_fungsi_kd
      const shouldDeleteFungsi = existingFungsi.filter(
        (existingItem) =>
          !fungsiData.some(
            (fungsiItem) =>
              fungsiItem.detail_fungsi_kd === existingItem.detail_fungsi_kd
          )
      );
      console.log("shouldDeleteFungsi", shouldDeleteFungsi);

      const fungsiNotInData = existingFungsi.filter(
        (existingItem) =>
          !fungsiData.some(
            (fungsiItem) =>
              fungsiItem.detail_fungsi_kd === existingItem.detail_fungsi_kd
          )
      );

      console.log("fungsiNotInData", fungsiNotInData);
      console.log("Existing Fungsi:", JSON.stringify(existingFungsi, null, 2));
      console.log("Fungsi Data:", JSON.stringify(fungsiData, null, 2));

      // delete fungsi yang tidak ada di data
      const deleteFungsi = await db.tbl_disposisi_detail.deleteMany({
        where: {
          disposisi_kd: data.disposisiKd,
          detail_fungsi_kd: {
            in: fungsiNotInData.map((item) => item.detail_fungsi_kd),
          },
        },
      });

      // fungsi yang baru ditambahkan
      const newAddedFungsi = fungsiData.filter(
        (newItem) =>
          !existingFungsi.some(
            (existingItem) =>
              existingItem.detail_fungsi_kd === newItem.detail_fungsi_kd
          )
      );
      // create only new added fungsi krn bs jadi fungsi yg sudah ada di disposisi sdh diupdate
      const createNewAddedFungsi = await db.tbl_disposisi_detail.createMany({
        data: newAddedFungsi,
      });

      // fungsi yang tidak baru
      const notNewFungsi = existingFungsi.filter((existingItem) =>
        fungsiData.some(
          (fungsiItem) =>
            fungsiItem.detail_fungsi_kd === existingItem.detail_fungsi_kd
        )
      );
      console.log("notNewFungsi", notNewFungsi);
      // update fungsi yang tidak baru
      const updateNotNewFungsi = await Promise.all(
        notNewFungsi.map(async (existingItem: tbl_disposisi_detail) => {
          const fungsiItem = fungsiData.find(
            (item) => item.detail_fungsi_kd === existingItem.detail_fungsi_kd
          );
          if (!fungsiItem) {
            return null; // Return null or appropriate value for items that don't match
          }
          return db.tbl_disposisi_detail.update({
            where: {
              disposisi_detail_kd: existingItem.disposisi_detail_kd,
            },
            data: {
              detail_perhatian: fungsiItem.detail_perhatian,
            },
          });
        })
      );
      console.log("updateNotNewFungsi", updateNotNewFungsi);
      return updatedDisposisi;
    });

    revalidatePath("/mailbox/inbox");
  } catch (err) {
    const error = err as Error;
    console.error("Transaction rolled back:", error);
    return error;
  }
};
