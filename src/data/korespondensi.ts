"use server";
import { dbEdispo } from "@/lib/db-edispo";

export const getKorespondensi = async (arsip_kd: string) => {
  const korespondensi = await dbEdispo.tbl_korespondensi.findMany({
    where: {
      arsip_kd: arsip_kd,
    },
    orderBy: {
      korespondensi_datetime: "desc",
    },
  });
  return korespondensi;
};
