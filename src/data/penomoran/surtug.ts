"use server";

import { dbPenomoran } from "@/lib/db-penomoran";
import { DokumenKeluar } from "@/zod/schemas/penomoran";
import { Prisma, tbl_tugas } from "@prisma-dbpenomoran/client";

export const getSurtug = () => {
  return true;
};

export const generateNomorSurtug = async (
  dokumen: DokumenKeluar,
  year: number,
  monthInRome: string
) => {
  //get the last surtug
  try {
    const lastSurtug = await getLastSurtugOfYear(year);
    let lastSurtugNomor = 0;
    if (lastSurtug) {
      lastSurtugNomor = parseInt(lastSurtug.nomor.split("/")[0]);
    }
    const nomor = `${lastSurtugNomor + 1}/ST/${monthInRome}/${year}`;
    console.log("[generateNomorSurtug] nomor: ", nomor);

    const surtug: tbl_tugas = {
      id: dokumen.id ?? 0,
      tanggal: dokumen.tanggalDokumen,
      nomor,
      fungsi: dokumen.fungsi.toString(),
      perihal: dokumen.perihal,
      input_by: dokumen.createdBy ?? 0, // TODO CHECK
      input_date: new Date(),
    };

    const newSurtug = await upsertSurtug(surtug);
    console.log("[generateNomorSurtug] newSurtug: ", newSurtug);

    return nomor;
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

export const getLastSurtugOfYear = async (year: number) => {
  try {
    const query = Prisma.sql`
      SELECT id, tanggal, nomor,fungsi, perihal, input_by, input_date
      FROM tbl_tugas
      WHERE YEAR(tanggal) = ${year}
      ORDER BY id DESC
      LIMIT 1
  `;
    const surtug = await dbPenomoran.$queryRaw<tbl_tugas[]>(query);
    if (surtug.length === 0) {
      return null;
    }
    return surtug[0];
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

const upsertSurtug = async (surtug: tbl_tugas) => {
  const { id, ...rest } = surtug;
  try {
    const result = await dbPenomoran.tbl_tugas.upsert({
      where: { id: surtug.id, nomor: surtug.nomor },
      update: { ...rest },
      create: { ...rest },
    });
    return result;
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

export const getDaftarSurtug = async () => {
  try {
    const query = Prisma.sql`
      SELECT id, tanggal as tanggalDokumen, nomor,fungsi, perihal, input_by, input_date
      FROM tbl_tugas      
      ORDER BY id DESC      
  `;
    const surtug: DokumenKeluar[] = await dbPenomoran.$queryRaw<
      DokumenKeluar[]
    >(query);
    //console.log("[getDaftarSurtug] surtug: ", surtug);
    return surtug;
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

export default getSurtug;
