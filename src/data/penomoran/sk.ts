"use server";

import { dbPenomoran } from "@/lib/db-penomoran";
import { DokumenKeluar } from "@/zod/schemas/penomoran";
import { Prisma, tbl_keputusan } from "@prisma-dbpenomoran/client";

export const getSK = () => {
  return true;
};

export const generateNomorSK = async (
  dokumen: DokumenKeluar,
  year: number,
  monthInRome: string
) => {
  //get the last sk
  try {
    const lastSK = await getLastSKOfYear(year);
    let lastSKNomor = 0;
    if (lastSK) {
      lastSKNomor = parseInt(lastSK.nomor.split("/")[0]);
    }
    const nomor = `${lastSKNomor + 1}/SK/${monthInRome}/${year}`;
    console.log("[generateNomorSK] nomor: ", nomor);

    const sk: tbl_keputusan = {
      id: dokumen.id ?? 0,
      tanggal: dokumen.tanggalDokumen,
      nomor,
      perihal: dokumen.perihal,
      input_by: dokumen.createdBy ?? 0, // TODO CHECK
      input_date: new Date(),
    };

    const newSK = await upsertSK(sk);
    console.log("[generateNomorSK] newSK: ", newSK);

    return nomor;
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

export const getLastSKOfYear = async (year: number) => {
  try {
    const query = Prisma.sql`
      SELECT id, tanggal, nomor, perihal, input_by, input_date
      FROM tbl_keputusan
      WHERE YEAR(tanggal) = ${year}
      ORDER BY id DESC
      LIMIT 1
  `;
    const sk = await dbPenomoran.$queryRaw<tbl_keputusan[]>(query);
    if (sk.length === 0) {
      return null;
    }
    return sk[0];
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

const upsertSK = async (sk: tbl_keputusan) => {
  const { id, ...rest } = sk;
  try {
    const result = await dbPenomoran.tbl_keputusan.upsert({
      where: { id: sk.id, nomor: sk.nomor },
      update: { ...rest },
      create: { ...rest },
    });
    return result;
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

export const getDaftarSK = async () => {
  try {
    const query = Prisma.sql`
      SELECT id, tanggal as tanggalDokumen, nomor, perihal, input_by, input_date
      FROM tbl_keputusan      
      ORDER BY id DESC      
  `;
    const sk: DokumenKeluar[] = await dbPenomoran.$queryRaw<DokumenKeluar[]>(
      query
    );
    //console.log("[getDaftarSK] sk: ", sk);
    return sk;
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

export default getSK;
