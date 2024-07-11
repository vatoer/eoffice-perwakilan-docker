"use server";

import { dbPenomoran } from "@/lib/db-penomoran";
import { DokumenKeluar } from "@/zod/schemas/penomoran";
import { Prisma, tbl_keterangan } from "@prisma-dbpenomoran/client";

export const getSuket = () => {
  return true;
};

export const generateNomorSuket = async (
  dokumen: DokumenKeluar,
  year: number,
  monthInRome: string
) => {
  //get the last suket
  try {
    // get kd_fungsi dr table fungsi

    const fungsi = await dbPenomoran.tbl_fungsi.findFirst({
      where: {
        id_fungsi: dokumen.fungsi,
      },
    });

    if (!fungsi) {
      throw new Error("Fungsi not found");
    }

    const kd_fungsi = fungsi.kd_fungsi;

    const lastSuket = await getLastSuketOfYear(year);
    let lastSuketNomor = 0;
    if (lastSuket) {
      lastSuketNomor = parseInt(lastSuket.nomor.split("/")[0]);
    }
    const nomor = `${
      lastSuketNomor + 1
    }/KET/${kd_fungsi}/${monthInRome}/${year}`;
    console.log("[generateNomorSuket] nomor: ", nomor);

    const suket: tbl_keterangan = {
      id: dokumen.id ?? 0,
      tanggal: dokumen.tanggalDokumen,
      nomor,
      fungsi: dokumen.fungsi.toString(),
      perihal: dokumen.perihal,
      kepada: dokumen.tujuan,
      input_by: dokumen.createdBy ?? 0, // TODO CHECK
      input_date: new Date(),
    };

    const newSuket = await upsertSuket(suket);
    console.log("[generateNomorSuket] newSuket: ", newSuket);

    return nomor;
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

export const getLastSuketOfYear = async (year: number) => {
  try {
    const query = Prisma.sql`
      SELECT id, tanggal, nomor,fungsi, perihal, input_by, input_date
      FROM tbl_keterangan
      WHERE YEAR(tanggal) = ${year}
      ORDER BY id DESC
      LIMIT 1
  `;
    const suket = await dbPenomoran.$queryRaw<tbl_keterangan[]>(query);
    if (suket.length === 0) {
      return null;
    }
    return suket[0];
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

const upsertSuket = async (suket: tbl_keterangan) => {
  const { id, ...rest } = suket;
  try {
    const result = await dbPenomoran.tbl_keterangan.upsert({
      where: { id: suket.id, nomor: suket.nomor },
      update: { ...rest },
      create: { ...rest },
    });
    return result;
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

export const getDaftarSuket = async () => {
  try {
    const query = Prisma.sql`
      SELECT id, tanggal as tanggalDokumen, nomor,fungsi, perihal, input_by, input_date
      FROM tbl_keterangan      
      ORDER BY id DESC      
  `;
    const suket: DokumenKeluar[] = await dbPenomoran.$queryRaw<DokumenKeluar[]>(
      query
    );
    //console.log("[getDaftarSuket] suket: ", suket);
    return suket;
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

export default getSuket;
