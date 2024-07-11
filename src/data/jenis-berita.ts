"use server";

import { dbEdispo } from "@/lib/db-edispo";

export const getJenisBerita = async () => {
  const response = await dbEdispo.tbl_jenis_berita.findMany({});
  return response;
};
