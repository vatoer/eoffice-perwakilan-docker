"use server";
import { dbEdispo } from "@/lib/db-edispo";
import {
  Prisma,
  tbl_berita,
  tbl_disposisi,
  tbl_disposisi_detail,
  tbl_disposisi_instruksi,
} from "@prisma-dbedispo/client";

export type Disposisi = tbl_disposisi & {
  tbl_disposisi_detail?: tbl_disposisi_detail[];
  instruksi?: tbl_disposisi_instruksi[];
  tbl_berita?: tbl_berita;
};

export const getDisposisi = async (
  arsip_kd: string
): Promise<Disposisi | null> => {
  const disposisi = await dbEdispo.tbl_disposisi.findFirst({
    where: {
      arsip_kd: arsip_kd,
    },
    include: {
      tbl_disposisi_detail: true,
      tbl_berita: true,
    },
  });

  if (!disposisi) {
    return null; // Handle case where no record is found
  }

  const instruksi = await dbEdispo.tbl_disposisi_instruksi.findMany({
    where: {
      arsip_kd: arsip_kd,
    },
  });

  const disposisiFull: Disposisi = { ...disposisi, instruksi: instruksi };
  return disposisiFull;
};

export interface InboxDisposisi extends tbl_berita, tbl_disposisi_detail {
  terima: "Y" | "T";
  perwakilan_nama: string;
  tgl_disposisi: Date;
  rahasia: string;
  catatan: string;
}

/**
 *
 * @param fungsi_kd
 * @returns
 *
 * This function returns the inbox disposisi for a specific fungsi_kd
 *
 * @remarks
 *
 * ada beberapa hal yang perlu diperhatikan:
 * pembersihan database karena ada beberapa field yang tidak digunakan dan tidak konsisten
 */
export const getInboxDisposisi = async (fungsi_kd: number) => {
  const query = Prisma.sql`
  SELECT 
  tdd.detail_terima as terima,
  tb.* ,
	tp.perwakilan_nama ,
	td.tgl_disposisi,
	td.catatan ,
	tdd.*
FROM tbl_berita tb 
	INNER JOIN tbl_perwakilan tp ON tb.perwakilan_kd = tp.perwakilan_kd 
	INNER JOIN tbl_disposisi td ON tb.arsip_kd = td.arsip_kd 
	INNER JOIN tbl_disposisi_detail tdd ON td.disposisi_kd = tdd.disposisi_kd 
WHERE 
  tdd.detail_fungsi_kd = ${fungsi_kd}
  AND tb.berita_disposisikan = 'Y'
ORDER BY 
  tdd.detail_terima ASC,
  td.tgl_disposisi DESC, 
  tb.tgl_diarsipkan DESC
`;

  const inbox = await dbEdispo.$queryRaw<InboxDisposisi[]>(query);
  return inbox;
};

interface counterDisposisi {
  jumlah_belum_tindak_lanjut: number;
}
/**
 *
 * @param fungsi_kd
 *
 * @remarks
 *
 * cara kerja fungsi ini adalah dengan menghitung jumlah disposisi yang belum ditindak lanjuti
 * kriteria belum tindak lanjut
 * 1. detil_terima = 'T'
 * 2. berita_disposisikan = 'Y'
 * 3. fungsi_kd = fungsi_kd
 * 4. berita_status_pengerjaan !== 'Y' untuk detail_perhatian = 'Y'
 *
 */
export const getCounterInboxDisposisiBelumTindakLanjut = async (
  fungsi_kd: number
): Promise<number> => {
  const query = Prisma.sql`
  SELECT 
    COUNT(*) as jumlah_belum_tindak_lanjut
  FROM tbl_berita tb 
    INNER JOIN tbl_disposisi td ON tb.arsip_kd = td.arsip_kd 
    INNER JOIN tbl_disposisi_detail tdd ON td.disposisi_kd = tdd.disposisi_kd 
  WHERE 
    tb.berita_disposisikan = 'Y'
    AND tdd.detail_fungsi_kd = ${fungsi_kd}
    AND (
    tdd.detail_terima != 'Y'
    OR (
      tdd.detail_perhatian = 'Y' AND tdd.berita_status_pengerjaan != 'Y'
      )
    )
    
`;
  const counter = await dbEdispo.$queryRaw<counterDisposisi[]>(query);

  if (!counter) {
    return 0;
  }

  return counter[0].jumlah_belum_tindak_lanjut;
};

/**
 *
 * @param fungsi_kd
 * @returns
 *
 * This function returns the inbox disposisi for a specific fungsi_kd oleh prisma
 * cuman kayaknya g terlalu efektif mending pake raw sql
 */

export const getInboxDisposisiX = async (fungsi_kd?: number) => {
  if (!fungsi_kd) {
    throw new Error("Fungsi_kd is required");
  }

  const january = new Date(new Date().getFullYear(), 0, 1);
  const inbox = await dbEdispo.tbl_berita.findMany({
    where: {
      tgl_berita: {
        gte: january,
      },
      berita_disposisikan: "Y",
      tbl_disposisi: {
        some: {
          tbl_disposisi_detail: {
            some: {
              detail_fungsi_kd: fungsi_kd,
            },
          },
        },
      },
    },
    include: {
      tbl_perwakilan: true,
      tbl_disposisi: {
        include: {
          tbl_disposisi_detail: {
            where: {
              detail_fungsi_kd: fungsi_kd,
            },
            orderBy: {
              detail_terima: "asc",
            },
          },
        },
      },
    },
    orderBy: [{ tgl_diarsipkan: "desc" }],
  });

  return inbox;
};

export const isExistDisposisi = async (arsip_kd: string) => {
  const disposisi = await dbEdispo.tbl_disposisi.findFirst({
    where: {
      arsip_kd: arsip_kd,
    },
  });

  return disposisi ? disposisi : false;
};
