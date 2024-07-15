"use server";
import { dbEdispo } from "@/lib/db-edispo";
import { CustomPrismaClientError } from "@/types/custom-prisma-client-error";
import { Berita } from "@/zod/schemas/berita";

export const getBeritaTerakhir = async (prefix: string) => {
  const beritaTerakhir = await dbEdispo.tbl_berita.findFirst({
    where: {
      arsip_kd: {
        startsWith: prefix,
      },
    },
    orderBy: {
      arsip_kd: "desc",
    },
    select: {
      arsip_kd: true,
    },
  });

  console.log("beritaTerakhir", beritaTerakhir);
  return beritaTerakhir;
};

const nexArsipKd = (prefix: string, beritaTerakhir: string | undefined) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString().slice(-2);
  let nextNumberAsArsipKd;

  if (beritaTerakhir !== undefined) {
    const lastFourDigits = beritaTerakhir.slice(-4);
    const lastFourDigitsAsInt = parseInt(lastFourDigits);
    const nextNumber = lastFourDigitsAsInt + 1;
    const nextNumberAsString = nextNumber.toString().padStart(4, "0");
    nextNumberAsArsipKd = prefix + nextNumberAsString;
  } else {
    nextNumberAsArsipKd = prefix + "0001";
  }
  console.log("nextNumberAsArsipKd", nextNumberAsArsipKd);
  return nextNumberAsArsipKd;
};

/**
 *
 * @param jenis_kd
 * @returns prefix
 * @description
 * Get prefix based on jenis_kd
 * A-YY- or B-YY-
 * A for jenis_kd 1 and 8  untuk BERITA sesuai dengan table tbl_jenis_berita
 * B for jenis_kd yang lain SELAIN BERITA sesuai dengan table tbl_jenis_berita
 *
 * @remarks
 *
 * Hadcoded prefix based on jenis_kd
 *
 */
const getPrefix = (jenis_kd: number) => {
  const currentDate = new Date();
  let prefix;
  //HARCDOED
  switch (jenis_kd) {
    case 1:
    case 8:
      prefix = "A";
      break;
    default:
      prefix = "B";
      break;
  }
  return prefix + "-" + currentDate.getFullYear().toString().slice(-2) + "-";
};

export const simpanBerita = async (berita: Berita) => {
  try {
    //HARDCODED
    const prefix = getPrefix(berita.jenis_kd);
    const beritaTerakhir = await getBeritaTerakhir(prefix);
    console.log("beritaTerakhir in simpanBerita", beritaTerakhir);

    const nextArsipKd = nexArsipKd(prefix, beritaTerakhir?.arsip_kd);
    console.log("nextArsipKd in simpanBerita", nextArsipKd);

    // Extract berita_file from berita object and omit it
    const { berita_file, perwakilan_nama, ...beritaWithoutFile } = berita;

    console.log(
      "[SIMPAN BERITA] beritaWithoutFile",
      beritaWithoutFile.berita_kd
    );

    const arsip_kd = berita.arsip_kd || nextArsipKd;

    // TODO berita input user dapat darimana?
    const createOne = await dbEdispo.tbl_berita.upsert({
      where: {
        arsip_kd,
      },
      create: {
        ...beritaWithoutFile,
        tgl_diarsipkan: new Date(),
        berita_input_fungsi: berita.berita_input_fungsi || 0, //hardcoded harusnya sih dari session // TODO
        arsip_kd: nextArsipKd,
        //berita_input_user: 2, //hardcoded
      },
      update: {
        ...beritaWithoutFile,
        tgl_diarsipkan: new Date(),
        berita_input_fungsi: berita.berita_input_fungsi || 0, //hardcoded harusnya sih dari session // TODO
        arsip_kd,
        //berita_input_user: 2, //hardcoded
      },
    });

    return createOne;
  } catch (err) {
    const error = err as CustomPrismaClientError;
    throw new Error(error.message);
  }
};

export const updateBeritaFile = async (
  arsip_kd: string,
  berita_file: string
) => {
  try {
    const updateOne = await dbEdispo.tbl_berita.update({
      where: {
        arsip_kd,
      },
      data: {
        berita_file,
      },
    });

    return updateOne;
  } catch (err) {
    const error = err as CustomPrismaClientError;
    throw new Error(error.message);
  }
};
