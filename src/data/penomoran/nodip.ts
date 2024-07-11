"use server";

import { dbPenomoran } from "@/lib/db-penomoran";
import { DokumenKeluar } from "@/zod/schemas/penomoran";
import { Prisma, tbl_notadiplomatik } from "@prisma-dbpenomoran/client";

export const getNodip = () => {
  return true;
};

export const generateNomorNodip = async (
  dokumen: DokumenKeluar,
  year: number,
  monthInRome: string
) => {
  //get the last nodip
  try {
    const lastNodip = await getLastNodipOfYear(year);
    let lastNodipNomor = 0;
    if (lastNodip) {
      lastNodipNomor = parseInt(lastNodip.nomor.split("/")[0]);
    }
    const nomor = `${lastNodipNomor + 1}/NV/${monthInRome}/${year}`;
    console.log("[generateNomorNodip] nomor: ", nomor);

    const nodip: tbl_notadiplomatik = {
      id: dokumen.id ?? 0,
      tanggal: dokumen.tanggalDokumen,
      nomor,
      fungsi: dokumen.fungsi,
      perihal: dokumen.perihal,
      input_by: dokumen.createdBy ?? 0, // TODO CHECK
      input_date: new Date(),
    };

    const newNodip = await upsertNodip(nodip);
    console.log("[generateNomorNodip] newNodip: ", newNodip);

    return nomor;
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

export const getLastNodipOfYear = async (year: number) => {
  try {
    const query = Prisma.sql`
      SELECT id, tanggal, nomor,fungsi, perihal, input_by, input_date
      FROM tbl_notadiplomatik
      WHERE YEAR(tanggal) = ${year}
      ORDER BY id DESC
      LIMIT 1
  `;
    const nodip = await dbPenomoran.$queryRaw<tbl_notadiplomatik[]>(query);
    if (nodip.length === 0) {
      return null;
    }
    return nodip[0];
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

const upsertNodip = async (nodip: tbl_notadiplomatik) => {
  const { id, ...rest } = nodip;
  try {
    const result = await dbPenomoran.tbl_notadiplomatik.upsert({
      where: { id: nodip.id, nomor: nodip.nomor },
      update: { ...rest },
      create: { ...rest },
    });
    return result;
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

export const getDaftarNodip = async () => {
  try {
    const query = Prisma.sql`
      SELECT id, tanggal as tanggalDokumen, nomor,fungsi, perihal, input_by, input_date
      FROM tbl_notadiplomatik      
      ORDER BY id DESC      
  `;
    const nodip: DokumenKeluar[] = await dbPenomoran.$queryRaw<DokumenKeluar[]>(
      query
    );
    //console.log("[getDaftarNodip] nodip: ", nodip);
    return nodip;
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

export default getNodip;
