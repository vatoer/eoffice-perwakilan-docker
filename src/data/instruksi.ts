"use server";
import { dbEdispo } from "@/lib/db-edispo";

// TODO
// ini banyak sekali tabel yang tidak di relasikan dengan tabel lainnya
// sehingga tidak bisa diambil data yang dibutuhkan dari tabel lain menggunakan prisma
export const getInstruksiAktif = async () => {
  const instruksi = await dbEdispo.tbl_instruksi.findMany({
    where: {
      instruksi_status: "Aktif",
    },
    orderBy: {
      instruksi_order: "asc",
    },
  });
  return instruksi;
};
