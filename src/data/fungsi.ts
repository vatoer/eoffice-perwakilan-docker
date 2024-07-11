"use server";
import { dbEdispo } from "@/lib/db-edispo";
import {
  tbl_fungsi_group,
  tbl_fungsi_group_anggota,
} from "@prisma-dbedispo/client";

export const getFungsiByKd = async (fungsi_kd: number) => {
  const fungsi = await dbEdispo.tbl_fungsi.findFirst({
    where: {
      fungsi_kd,
    },
  });
  return fungsi;
};

export const getFungsi = async () => {
  const fungsi = await dbEdispo.tbl_fungsi.findMany({
    where: {
      fungsi_kd: {
        not: 1,
      },
    },
    orderBy: {
      fungsi_urut: "asc",
    },
  });
  return fungsi;
};

export type FungsiGroup = tbl_fungsi_group & {
  anggota: tbl_fungsi_group_anggota[];
};

export const getFungsiGroup = async (): Promise<FungsiGroup[]> => {
  const fungsiGroup = await dbEdispo.tbl_fungsi_group.findMany({
    include: {
      anggota: true,
    },
  });
  return fungsiGroup;
};

export interface FungsiPendispo {
  fungsi_kd: number;
  nama_fungsi: string;
  fungsi_urut: number;
}
export const getFungsiPendispo = async (): Promise<FungsiPendispo[]> => {
  const fungsiPendispo = await dbEdispo.tbl_fungsi.findMany({
    where: {
      disposisi_fungsi: "Y",
    },
    orderBy: {
      fungsi_urut: "asc",
    },
  });
  return fungsiPendispo;
};
