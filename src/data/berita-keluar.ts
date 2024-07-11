"use server";
import { dbEdispo } from "@/lib/db-edispo";
import { CustomPrismaClientError } from "@/types/custom-prisma-client-error";
import {
  BeritaKeluar,
  BeritaKeluarEditMode,
} from "@/zod/schemas/berita-keluar";

const getPrefix = (berita_kd: string) => {
  const currentDate = new Date();
  const firstChar = berita_kd.charAt(0);
  const prefix =
    "K" +
    firstChar +
    "-" +
    currentDate.getFullYear().toString().slice(-2) +
    "-";
  console.log("prefix", prefix);
  return prefix;
};

const nexArsipKd = (
  prefix: string,
  beritaKeluarTerakhir: string | undefined
) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString().slice(-2);
  let nextNumberAsArsipKd;

  if (beritaKeluarTerakhir !== undefined) {
    const lastFourDigits = beritaKeluarTerakhir.slice(-4);
    const lastFourDigitsAsInt = parseInt(lastFourDigits);
    const nextNumber = lastFourDigitsAsInt + 1;
    const nextNumberAsString = nextNumber.toString().padStart(4, "0");
    nextNumberAsArsipKd = prefix + nextNumberAsString;
  } else {
    nextNumberAsArsipKd = prefix + "0001";
  }
  console.log("beritaKeluarTerakhir", beritaKeluarTerakhir);
  console.log("nextNumberAsArsipKd", nextNumberAsArsipKd);
  return nextNumberAsArsipKd;
};

export const getBeritaKeluarTerakhir = async (prefix: string) => {
  const beritaKeluarTerakhir = await dbEdispo.tbl_berita_keluar.findFirst({
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

  console.log("beritaKeluarTerakhir", beritaKeluarTerakhir);
  return beritaKeluarTerakhir;
};

const extractTanggalYYMMDD = (berita_kd: string) => {
  const tanggalYYMMDD = berita_kd.slice(-6);

  // Extract year, month, and day components
  const year = parseInt(tanggalYYMMDD.substring(0, 2), 10);
  const month = parseInt(tanggalYYMMDD.substring(2, 4), 10) - 1; // Month is 0-indexed
  const day = parseInt(tanggalYYMMDD.substring(4, 6), 10);

  // Construct a Date object
  // Note: Years 00-49 are mapped to 2000-2049, and years 50-99 are mapped to 1950-1999
  const fullYear = year + (year < 50 ? 2000 : 1900);
  const validDate = new Date(fullYear, month, day);
  return validDate;
};

/**
 *
 * @param beritaKeluar
 * @returns
 *
 * @throws Error if copy_berita is empty
 * @throws Error if any error occurs during the transaction
 *
 * @remarks
 * This function is used to save a new record in tbl_berita_keluar and tbl_berita_keluar_fungsi_kd
 */
export const simpanBeritaKeluar = async (beritaKeluar: BeritaKeluar) => {
  try {
    // Extract berita_file and copy_berita from beritaKeluar
    // beritaKeluarWithoutFile is the data without berita_file and copy_berita
    const { berita_file, copy_berita, ...beritaKeluarWithoutFile } =
      beritaKeluar;

    // Check if copy_berita is empty
    // di edispo klo tidak ada copy berita error g tampil
    // copy berita disimpan di tbl_berita_keluar_fungsi_kd
    if (!copy_berita) {
      throw new Error("Copy berita is required");
    }

    // jika berita baru , arsip kd null atau undefined
    // check if the berita_kd is unique krn di tabel tidak pengecekan, jadi harus manual cek,// TODO update db schema biar unique, cuman skrg masih pararel jd klo mo ngubah harus liat dulu aplikasi sebelah gmn
    if (!beritaKeluar.arsip_kd) {
      const arsip_kd = beritaKeluar.arsip_kd;
      const beritaKeluarTerakhir = await dbEdispo.tbl_berita_keluar.findFirst({
        where: {
          berita_kd: beritaKeluar.berita_kd,
        },
      });
      if (beritaKeluarTerakhir) {
        throw new Error("Nomor berita sudah ada");
      }
    }

    let isBeritaLama = false;
    // jika berita lama, arsip kd sudah ada
    if (beritaKeluar.arsip_kd) {
      const beritaLama = await dbEdispo.tbl_berita_keluar.findFirst({
        where: {
          arsip_kd: beritaKeluar.arsip_kd,
        },
      });

      if (beritaLama) {
        isBeritaLama = true;
      }
    }

    // check copy berita yg lama, klo ada hapus dulu
    if (isBeritaLama) {
      // lebih mudah langsung hapus yang lama krn tidak dipake diproses yg lain
    }

    const prefix = getPrefix(beritaKeluar.berita_kd);
    const beritaKeluarTerakhir = await getBeritaKeluarTerakhir(prefix);
    const nextArsipKd = nexArsipKd(prefix, beritaKeluarTerakhir?.arsip_kd);
    console.log("nextArsipKd in simpanBeritaKeluar", nextArsipKd);

    const sifat_kd = beritaKeluar.berita_kd.slice(0, 1) === "R" ? 1 : 2;
    const validDate = extractTanggalYYMMDD(beritaKeluar.berita_kd);

    // Use transaction to ensure that both operations are successful
    // If one of the operations fails, the other operation will be rolled back
    // and the error will be thrown

    const arsipKd = beritaKeluar.arsip_kd ?? nextArsipKd;

    const [createOne, deleteCopy, newCopy] = await dbEdispo.$transaction([
      dbEdispo.tbl_berita_keluar.upsert({
        where: {
          arsip_kd: arsipKd,
        },
        create: {
          ...beritaKeluarWithoutFile,
          pembuat_kd: beritaKeluar.pembuat_kd.toString(), //pembuat_kd is a number, so it needs to be converted to string
          sifat_kd: sifat_kd,
          arsip_kd: nextArsipKd,
          tgl_berita: validDate,
        },
        update: {
          ...beritaKeluarWithoutFile,
          arsip_kd: arsipKd,
          pembuat_kd: beritaKeluar.pembuat_kd.toString(), //pembuat_kd is a number, so it needs to be converted to string
          sifat_kd: sifat_kd,
          tgl_berita: validDate,
        },
      }),
      dbEdispo.tbl_berita_keluar_fungsi_kd.deleteMany({
        where: {
          arsip_kd: arsipKd,
        },
      }),
      dbEdispo.tbl_berita_keluar_fungsi_kd.createMany({
        data: copy_berita.map((copy) => ({
          arsip_kd: arsipKd,
          fungsi_kd: copy.toString(),
        })),
      }),
    ]);

    console.log("[SIMPAN BERITA KELUAR IS NEW] : ", !isBeritaLama);
    console.log("[SIMPAN BERITA KELUAR] createOne", createOne);
    console.log("[SIMPAN BERITA KELUAR] deleteCopy", deleteCopy);
    console.log("[SIMPAN BERITA KELUAR] newCopy", newCopy);

    return createOne;
  } catch (err) {
    const error = err as CustomPrismaClientError;
    throw new Error(error.message);
  }
};

export const updateBeritaKeluarFile = async (
  arsip_kd: string,
  saved_file: string
) => {
  const updateOne = await dbEdispo.tbl_berita_keluar.update({
    where: {
      arsip_kd: arsip_kd,
    },
    data: {
      berita_file: saved_file,
    },
  });

  return updateOne;
};

export const getBeritaKeluarForEditing = async (
  arsip_kd: string
): Promise<BeritaKeluarEditMode | null> => {
  const berita = await dbEdispo.tbl_berita_keluar.findFirst({
    where: {
      arsip_kd,
    },
  });

  if (!berita) {
    return null;
  }

  const copy = await dbEdispo.tbl_berita_keluar_fungsi_kd.findMany({
    where: {
      arsip_kd,
    },
    select: {
      fungsi_kd: true,
    },
  });

  const { berita_file, ...beritaKeluar } = berita;

  // disini perlu banyak manual mapping karena di database banyak yg berbeda kadang allow null kadang tidak, kadang string kadang number
  const beritaKeluarForEditing: BeritaKeluarEditMode = {
    //...beritaKeluar,
    arsip_kd: beritaKeluar.arsip_kd,
    berita_kd: beritaKeluar.berita_kd || "",
    pembuat_kd: parseInt(beritaKeluar.pembuat_kd ?? "0"),
    perihal_berita: beritaKeluar.perihal_berita || "",
    copy_berita: copy
      .filter((c) => c.fungsi_kd !== undefined) // Filter out undefined values
      .map((c) => Number(c.fungsi_kd)), // Convert to number  };
  };

  return beritaKeluarForEditing;
};
