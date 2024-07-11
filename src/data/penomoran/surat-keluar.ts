"use server";

import { dbPenomoran } from "@/lib/db-penomoran";
import { DokumenKeluar } from "@/zod/schemas/penomoran";
import { Prisma, tbl_keluar } from "@prisma-dbpenomoran/client";

export const getSuratKeluar = () => {
  return true;
};

export const generateNomorSuratKeluar = async (
  dokumen: DokumenKeluar,
  year: number,
  monthInRome: string
) => {
  //get the last suratKeluar
  try {
    const fungsi = await dbPenomoran.tbl_fungsi.findFirst({
      where: {
        id_fungsi: dokumen.fungsi,
      },
    });

    if (!fungsi) {
      throw new Error("Fungsi not found");
    }

    const kd_fungsi = fungsi.kd_fungsi;

    const lastSuratKeluar = await getLastSuratKeluarOfYear(year);
    let lastSuratKeluarNomor = 0;
    if (lastSuratKeluar) {
      lastSuratKeluarNomor = parseInt(lastSuratKeluar.nomor.split("/")[0]);
    }
    const nomor = `${
      lastSuratKeluarNomor + 1
    }/${kd_fungsi}/${monthInRome}/${year}`;
    console.log("[generateNomorSuratKeluar] nomor: ", nomor);

    const suratKeluar: tbl_keluar = {
      id: dokumen.id ?? 0,
      tanggal: dokumen.tanggalDokumen,
      nomor,
      fungsi: dokumen.fungsi.toString(),
      isi_surat: dokumen.perihal,
      tujuan: dokumen.tujuan,
      input_by: dokumen.createdBy ?? 0, // TODO CHECK
      input_date: new Date(),
    };

    const newSuratKeluar = await upsertSuratKeluar(suratKeluar);
    console.log("[generateNomorSuratKeluar] newSuratKeluar: ", newSuratKeluar);

    return nomor;
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

export const getLastSuratKeluarOfYear = async (year: number) => {
  try {
    const query = Prisma.sql`
      SELECT id, tanggal, nomor,fungsi, isi_surat, input_by, input_date
      FROM tbl_keluar
      WHERE YEAR(tanggal) = ${year}
      ORDER BY id DESC
      LIMIT 1
  `;
    const suratKeluar = await dbPenomoran.$queryRaw<tbl_keluar[]>(query);
    if (suratKeluar.length === 0) {
      return null;
    }
    return suratKeluar[0];
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

const upsertSuratKeluar = async (suratKeluar: tbl_keluar) => {
  const { id, ...rest } = suratKeluar;
  try {
    const result = await dbPenomoran.tbl_keluar.upsert({
      where: { id: suratKeluar.id, nomor: suratKeluar.nomor },
      update: { ...rest },
      create: { ...rest },
    });
    return result;
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

export const getDaftarSuratKeluar = async () => {
  try {
    const query = Prisma.sql`
      SELECT id, tanggal as tanggalDokumen, nomor,fungsi,tujuan, isi_surat as perihal, input_by, input_date
      FROM tbl_keluar      
      ORDER BY id DESC      
  `;
    const suratKeluar: DokumenKeluar[] = await dbPenomoran.$queryRaw<
      DokumenKeluar[]
    >(query);
    //console.log("[getDaftarSuratKeluar] suratKeluar: ", suratKeluar);
    return suratKeluar;
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

export default getSuratKeluar;
