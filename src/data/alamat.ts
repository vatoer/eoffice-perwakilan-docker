"use server";

import { dbEdispo } from "@/lib/db-edispo";

export const getAlamat = async (search: string) => {
  const response = await dbEdispo.tbl_perwakilan.findMany({
    select: {
      perwakilan_kd: true,
      perwakilan_nama: true,
    },
    where: {
      perwakilan_nama: {
        contains: search,
      },
    },
  });
  return response;
};

export interface Perwakilan {
  perwakilan_nama: string;
  negara: string;
}
export const simpanPerwakilan = async (data: Perwakilan) => {
  try {
    const response = await dbEdispo.tbl_perwakilan.create({
      data: {
        perwakilan_nama: data.perwakilan_nama,
        negara: data.negara,
      },
    });
    return response as Perwakilan;
  } catch (err) {
    const error = err as Error;
    return new Error(error.message);
  }
};
