"use server";
import { dbEdispo } from "@/lib/db-edispo";
import { BeritaWithoutFile } from "@/zod/schemas/berita";
import { Prisma, tbl_berita, tbl_cux } from "@prisma-dbedispo/client";

export interface Inbox extends tbl_berita {
  perwakilan_nama: string;
  input_fungsi_nama: string;
  input_user_nama: string;
  disposisi_fungsi_nama: string;
  disposisi_fungsi_kd: number;
  disposisi_kd?: string;
  catatan?: string;
  disposisi_oleh?: number;
}

export interface EximcuxInbox extends tbl_cux {}

const SELECT_INBOX = Prisma.sql`
  SELECT tb.*,
    tp.perwakilan_nama,
    tf1.nama_fungsi AS input_fungsi_nama,
    tf2.nama_fungsi AS disposisi_fungsi_nama,
    tf2.fungsi_kd AS disposisi_fungsi_kd,
    tu.user_nama AS input_user_nama,
    td.disposisi_kd ,
    td.catatan, 
    td.disposisi_oleh 
  FROM tbl_berita tb
    INNER JOIN tbl_perwakilan tp ON tb.perwakilan_kd = tp.perwakilan_kd
    INNER JOIN tbl_fungsi tf1 ON tb.berita_input_fungsi = tf1.fungsi_kd
    INNER JOIN tbl_fungsi tf2 ON tb.berita_fungsi_disposisi = tf2.fungsi_kd
    INNER JOIN tbl_user tu ON tb.berita_input_user = tu.user_kd
    LEFT JOIN tbl_disposisi td ON tb.arsip_kd = td.arsip_kd
  `;

const ORDER_INBOX = Prisma.sql`
  ORDER BY tb.berita_disposisikan DESC, tb.status_disposisi ASC,tb.tgl_diarsipkan DESC
  `;

export const getInbox = async (user_kd: number, fungsi_kd: number) => {
  // cari inbox yang diinput oleh user atau didisposisikan oleh fungsi user
  const query = Prisma.sql`
  ${SELECT_INBOX}
  WHERE 
    tb.berita_fungsi_disposisi = ${fungsi_kd} 
    OR tb.berita_input_fungsi = ${fungsi_kd} 
    OR tb.berita_input_user = ${user_kd}
  ${ORDER_INBOX}
  `;
  const inbox = await dbEdispo.$queryRaw<Inbox[]>(query);
  return inbox;
};

export const getInboxAdmin = async () => {
  // cari inbox yang diinput oleh user atau didisposisikan oleh fungsi user
  const query = Prisma.sql`
  ${SELECT_INBOX}
  ${ORDER_INBOX}
  `;
  const inbox = await dbEdispo.$queryRaw<Inbox[]>(query);
  return inbox;
};

export const getEximcuxInbox = async () => {
  const inbox = await dbEdispo.tbl_cux.findMany({
    where: {
      map_to: {
        not: null,
      },
    },
    orderBy: {
      tanggal: "desc",
    },
  });
  return inbox;
};

export interface InboxCuxImported extends tbl_berita {
  no_agenda: string;
  iddistribusi: string;
  rahasia: string;
  nama_perwakilan: string;
  created_at: Date;
}

export const getInboxCuxImported = async () => {
  const query = Prisma.sql`SELECT tb.*,tc.iddistribusi, tc.no_agenda, tc.rahasia, tc.nama_perwakilan, tc.created_at  FROM tbl_berita tb inner join tbl_cux tc on tb.arsip_kd = tc.map_to order by tb.tgl_diarsipkan desc, tb.status_disposisi asc`;

  const inbox = await dbEdispo.$queryRaw<InboxCuxImported[]>(query);
  return inbox;
};

export const getInboxByArsipKd = async (arsip_kd: string) => {
  const inbox = await dbEdispo.tbl_berita.findFirst({
    include: {
      tbl_perwakilan: true,
    },
    where: {
      arsip_kd,
    },
  });
  return inbox;
};

export const getInboxForEditing = async (
  arsip_kd: string
): Promise<BeritaWithoutFile | null> => {
  const berita = await dbEdispo.tbl_berita.findFirst({
    include: {
      tbl_perwakilan: true,
    },
    where: {
      arsip_kd,
    },
  });

  if (!berita) {
    return null;
  }

  const { berita_file, ...inbox } = berita;

  const inboxForEditing: BeritaWithoutFile = {
    ...inbox,
    perwakilan_nama: berita.tbl_perwakilan.perwakilan_nama,
  };

  return inboxForEditing;
};
