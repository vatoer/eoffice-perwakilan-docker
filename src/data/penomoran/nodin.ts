"use server";

import { dbPenomoran } from "@/lib/db-penomoran";
import { DokumenKeluar } from "@/zod/schemas/penomoran";
import { Prisma, tbl_nota } from "@prisma-dbpenomoran/client";

export const getNodin = () => {
  return true;
};

export const generateNomorNodin = async (
  dokumen: DokumenKeluar,
  year: number,
  monthInRome: string
) => {
  //get the last nodin
  try {
    const lastNodin = await getLastNodinOfYear(year);
    let lastNodinNomor = 0;
    if (lastNodin) {
      lastNodinNomor = parseInt(lastNodin.nomor.split("/")[0]);
    }
    const nomor = `${lastNodinNomor + 1}/ND/${monthInRome}/${year}`;
    console.log("[generateNomorNodin] nomor: ", nomor);

    const nodin: tbl_nota = {
      id: dokumen.id ?? 0,
      tanggal: dokumen.tanggalDokumen,
      nomor,
      fungsi: dokumen.fungsi.toString(),
      perihal: dokumen.perihal,
      input_by: dokumen.createdBy ?? 0, // TODO CHECK
      input_date: new Date(),
    };

    const newNodin = await upsertNodin(nodin);
    console.log("[generateNomorNodin] newNodin: ", newNodin);

    return nomor;
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

export const getLastNodinOfYear = async (year: number) => {
  try {
    const query = Prisma.sql`
      SELECT id, tanggal, nomor,fungsi, perihal, input_by, input_date
      FROM tbl_nota
      WHERE YEAR(tanggal) = ${year}
      ORDER BY id DESC
      LIMIT 1
  `;
    const nodin = await dbPenomoran.$queryRaw<tbl_nota[]>(query);
    if (nodin.length === 0) {
      return null;
    }
    return nodin[0];
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

const upsertNodin = async (nodin: tbl_nota) => {
  const { id, ...rest } = nodin;
  try {
    const result = await dbPenomoran.tbl_nota.upsert({
      where: { id: nodin.id, nomor: nodin.nomor },
      update: { ...rest },
      create: { ...rest },
    });
    return result;
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

export const getDaftarNodin = async () => {
  try {
    const query = Prisma.sql`
      SELECT id, tanggal as tanggalDokumen, nomor,fungsi, perihal, input_by, input_date
      FROM tbl_nota      
      ORDER BY id DESC      
  `;
    const nodin: DokumenKeluar[] = await dbPenomoran.$queryRaw<DokumenKeluar[]>(
      query
    );
    //console.log("[getDaftarNodin] nodin: ", nodin);
    return nodin;
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

export default getNodin;
