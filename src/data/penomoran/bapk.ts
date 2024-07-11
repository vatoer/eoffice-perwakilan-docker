"use server";

import { dbPenomoran } from "@/lib/db-penomoran";
import { DokumenKeluar } from "@/zod/schemas/penomoran";
import { Prisma, tbl_bapk } from "@prisma-dbpenomoran/client";

export const getBapk = () => {
  return true;
};

export const generateNomorBapk = async (
  dokumen: DokumenKeluar,
  year: number,
  monthInRome: string
) => {
  //get the last bapk
  try {
    const lastBapk = await getLastBapkOfYear(year);
    let lastBapkNomor = 0;
    if (lastBapk) {
      lastBapkNomor = parseInt(lastBapk.nomor.split("/")[0]);
    }
    const nomor = `${lastBapkNomor + 1}/BAPK/03/${monthInRome}/${year}`;
    console.log("[generateNomorBapk] nomor: ", nomor);

    const bapk: tbl_bapk = {
      id: dokumen.id ?? 0,
      tanggal: dokumen.tanggalDokumen,
      nomor,
      fungsi: dokumen.fungsi,
      perihal: dokumen.perihal,
      input_by: dokumen.createdBy ?? 0, // TODO CHECK
      input_date: new Date(),
    };

    const newBapk = await upsertBapk(bapk);
    console.log("[generateNomorBapk] newBapk: ", newBapk);

    return nomor;
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

export const getLastBapkOfYear = async (year: number) => {
  try {
    const query = Prisma.sql`
      SELECT id, tanggal, nomor,fungsi, perihal, input_by, input_date
      FROM tbl_bapk
      WHERE YEAR(tanggal) = ${year}
      ORDER BY id DESC
      LIMIT 1
  `;
    const bapk = await dbPenomoran.$queryRaw<tbl_bapk[]>(query);
    if (bapk.length === 0) {
      return null;
    }
    return bapk[0];
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

const upsertBapk = async (bapk: tbl_bapk) => {
  const { id, ...rest } = bapk;
  try {
    const result = await dbPenomoran.tbl_bapk.upsert({
      where: { id: bapk.id, nomor: bapk.nomor },
      update: { ...rest },
      create: { ...rest },
    });
    return result;
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

export const getDaftarBapk = async () => {
  try {
    const query = Prisma.sql`
      SELECT id, tanggal as tanggalDokumen, nomor,fungsi, perihal, input_by, input_date
      FROM tbl_bapk      
      ORDER BY id DESC      
  `;
    const bapk: DokumenKeluar[] = await dbPenomoran.$queryRaw<DokumenKeluar[]>(
      query
    );
    //console.log("[getDaftarBapk] bapk: ", bapk);
    return bapk;
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

export default getBapk;
