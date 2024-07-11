import { dbEdispo } from "@/lib/db-edispo";
import { Prisma, tbl_berita_keluar } from "@prisma-dbedispo/client";

export interface Outbox extends tbl_berita_keluar {}

/**
 * 
 * @param fungsi_kd 
 * @returns 
 * 
 * @remarks
 * 
 * add indexing
 * 
CREATE INDEX idx_tbl_berita_keluar_pembuat_kd ON tbl_berita_keluar(pembuat_kd);
CREATE INDEX idx_tbl_berita_keluar_fungsi_kd_arsip_kd ON tbl_berita_keluar_fungsi_kd(fungsi_kd, arsip_kd);
 */
export const getOutbox = async (fungsi_kd: number): Promise<Outbox[]> => {
  const query = Prisma.sql`
  SELECT 
  tbk.arsip_kd,
  tbk.berita_kd,
  tbk.pembuat_kd,
  tbk.tgl_berita,
  tbk.perihal_berita ,
  tbk.sifat_kd 
FROM tbl_berita_keluar tbk
WHERE 
  tbk.pembuat_kd = ${fungsi_kd}
  OR EXISTS (
    SELECT 1
    FROM tbl_berita_keluar_fungsi_kd tbkfk
    WHERE tbk.arsip_kd = tbkfk.arsip_kd 
      AND tbkfk.fungsi_kd = ${fungsi_kd}
  )
ORDER BY tbk.tgl_berita DESC, tbk.arsip_kd DESC;
`;

  const outbox = await dbEdispo.$queryRaw<Outbox[]>(query);
  return outbox;
};

export const getOutboxAdmin = async (): Promise<Outbox[]> => {
  const outbox = await dbEdispo.tbl_berita_keluar.findMany({
    orderBy: [{ tgl_berita: "desc" }, { arsip_kd: "desc" }],
  });
  return outbox;
};

export const getOutboxByArsipKd = async (
  arsip_kd: string
): Promise<Outbox | null> => {
  const outbox = await dbEdispo.tbl_berita_keluar.findFirst({
    where: {
      arsip_kd,
    },
  });
  return outbox;
};
