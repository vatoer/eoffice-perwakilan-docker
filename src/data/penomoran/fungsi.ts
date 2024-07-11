"use server";
import { dbPenomoran } from "@/lib/db-penomoran";
import { Prisma } from "@prisma-dbpenomoran/client";

interface Fungsi {
  id_fungsi: number;
  nama_fungsi: string;
  kd_fungsi: string;
}
export const getFungsi = async () => {
  try {
    const query = Prisma.sql`
      SELECT 
      id_fungsi,
      nama_fungsi,
      kd_fungsi 
      FROM tbl_fungsi tf 
  `;
    const fungsi = await dbPenomoran.$queryRaw<Fungsi[]>(query);
    return fungsi;
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

export default getFungsi;
