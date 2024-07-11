"use server";

import { dbPenomoran } from "@/lib/db-penomoran";
import { DokumenKeluar } from "@/zod/schemas/penomoran";
import { Prisma, tbl_sppd } from "@prisma-dbpenomoran/client";

export const getSPPD = () => {
  return true;
};

export const generateNomorSPPD = async (
  dokumen: DokumenKeluar,
  year: number,
  monthInRome: string
  //kd_fungsi: string // kd_fungsi ini adalah kd_fungsi dari dokumen yang akan di-generate nomor SPPD-nya di dapat dari table fungsi
) => {
  //get the last sppd
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

    const lastSPPD = await getLastSPPDOfYear(year);
    let lastSPPDNomor = 0;
    if (lastSPPD) {
      lastSPPDNomor = parseInt(lastSPPD.nomor.split("/")[0]);
    }
    const nomor = `${
      lastSPPDNomor + 1
    }/SPPD/${kd_fungsi}/${monthInRome}/${year}`;
    console.log("[generateNomorSPPD] nomor: ", nomor);

    const sppd: tbl_sppd = {
      id: dokumen.id ?? 0,
      tanggal: dokumen.tanggalDokumen,
      nomor,
      fungsi: dokumen.fungsi.toString(),
      perihal: dokumen.perihal,
      input_by: dokumen.createdBy ?? 0, // TODO CHECK
      input_date: new Date(),
    };

    const newSPPD = await upsertSPPD(sppd);
    console.log("[generateNomorSPPD] newSPPD: ", newSPPD);

    return nomor;
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

export const getLastSPPDOfYear = async (year: number) => {
  try {
    const query = Prisma.sql`
      SELECT id, tanggal, nomor,fungsi, perihal, input_by, input_date
      FROM tbl_sppd
      WHERE YEAR(tanggal) = ${year}
      ORDER BY id DESC
      LIMIT 1
  `;
    const sppd = await dbPenomoran.$queryRaw<tbl_sppd[]>(query);
    if (sppd.length === 0) {
      return null;
    }
    return sppd[0];
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

const upsertSPPD = async (sppd: tbl_sppd) => {
  const { id, ...rest } = sppd;
  try {
    const result = await dbPenomoran.tbl_sppd.upsert({
      where: { id: sppd.id, nomor: sppd.nomor },
      update: { ...rest },
      create: { ...rest },
    });
    return result;
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

export const getDaftarSPPD = async () => {
  try {
    const query = Prisma.sql`
      SELECT id, tanggal as tanggalDokumen, nomor,fungsi, perihal, input_by, input_date
      FROM tbl_sppd     
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

export default getSPPD;
