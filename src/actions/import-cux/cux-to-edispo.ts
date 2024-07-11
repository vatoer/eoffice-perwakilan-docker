import { dbEdispo } from "@/lib/db-edispo";
import { tbl_berita, tbl_cux, tbl_perwakilan } from "@prisma-dbedispo/client";

import { env } from "process";
import { any } from "zod";
import { ReturnType } from "./types";

// lihat tabel tabel berikut
// tbl_jenis_berita
/* 
  
    1	Berita Biasa (Kom)
    2	Surat (Sekre Dubes)
    3	Email (Sekre Dubes)
    4	Undangan (Sekre Dubes)
    5	Faksimil
    6	Nota Dinas (Sekre Dubes)
    7	Lain-lain
    8	Berita Rahasia (Kom)
    9	Email (Sekre DCM)
    10	Nota Dinas (Sekre DCM)
    11	Surat (Sekre DCM)
    12	Undangan (Sekre DCM)
    13	Email (Sekre UNESCO)
    14	Nota Dinas (Sekre UNESCO)
    15	Surat (Sekre UNESCO)
    16	Undangan (Sekre UNESCO)
    17	Nota Dinas Rahasia (Kom)
*/
// tbl_sifat
/*
  2	Rahasia
  1	Biasa
*/

interface IAlamatSimbra {
  nama_perwakilan: string;
  kode_pengirim: string;
}

// tbl_perwakilan tbl_perwakilan_bridge_cux
// cari apakah kode_pengirim sudah ada di tbl_perwakilan_bridge_cux
// jika belum ada maka insert ke tbl_perwakilan dan tbl_perwakilan_bridge_cux
// jika sudah ada maka skip
const filterPengirimFromCux = async (
  data: Omit<tbl_cux, "id">[]
): Promise<IAlamatSimbra[]> => {
  //find unique only from data
  const unique = data.filter(
    (v, i, a) => a.findIndex((t) => t.kode_pengirim === v.kode_pengirim) === i
  );

  // check if kode_pengirim already exist in tbl_perwakilan_bridge_cux
  const mappedData = await Promise.all(
    unique.map(async (item) => {
      const isExist = await dbEdispo.tbl_perwakilan_bridge_cux.findUnique({
        where: {
          kode_pengirim: item.kode_pengirim!,
        },
      });
      if (!isExist) {
        const x: IAlamatSimbra = {
          kode_pengirim: item.kode_pengirim,
          nama_perwakilan: item.nama_perwakilan,
        };
        return x;
      }
    })
  );

  //www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
  const filtered = mappedData.filter(
    (item): item is IAlamatSimbra => item !== undefined
  );

  return filtered;
};

// tbl_perwakilan

const insertToTblPerwakilan = async (data: IAlamatSimbra[]) => {
  const insertedPwk = Promise.all(
    data.map(async (item) => {
      const createOneOnTblPerwakilan = await dbEdispo.tbl_perwakilan.create({
        data: {
          perwakilan_nama: item.nama_perwakilan,
          tbl_perwakilan_bridge_cux: {
            create: {
              kode_pengirim: item.kode_pengirim,
            },
          },
        },
      });
      return createOneOnTblPerwakilan;
    })
  );
  return insertedPwk;
};

// buat tabel untuk mapping  dari cux.kode_pengirim ke edispo.tbl_perwakilan.perwakilan_kd
export const mapCuxKodePengirimToTblPerwakilan = async (
  data: Omit<tbl_cux, "id">[]
) => {
  try {
    const newPwkNeedToInsertToTblPerwakilan = await filterPengirimFromCux(data);
    console.log(
      "newPwkNeedToInsertToTblPerwakilan",
      newPwkNeedToInsertToTblPerwakilan
    );
    const insertedPwk = await insertToTblPerwakilan(
      newPwkNeedToInsertToTblPerwakilan
    );
    console.log("insertedPwk", insertedPwk);
  } catch (error: any) {
    //console.log("mapCuxKodePengirimToTblPerwakilan error: ", error);
    throw new Error(
      "mapCuxKodePengirimToTblPerwakilan error: " + error.message
    );
  }
};

const nexArsipKd = (beritaTerakhir: string | undefined) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString().slice(-2);
  let nextNumberAsArsipKd;

  try {
    //hardcoded start with A-yy-

    if (beritaTerakhir !== undefined) {
      const lastFourDigits = beritaTerakhir.slice(-4);
      const lastFourDigitsAsInt = parseInt(lastFourDigits);
      const nextNumber = lastFourDigitsAsInt + 1;
      const nextNumberAsString = nextNumber.toString().padStart(4, "0");
      nextNumberAsArsipKd = "A-" + year + "-" + nextNumberAsString;
      //console.log("nextNumberAsArsipKd", nextNumberAsArsipKd);
    } else {
      nextNumberAsArsipKd = "A-" + year + "-" + "0001";
      //console.log("nextNumberAsArsipKd", nextNumberAsArsipKd);
    }
    return nextNumberAsArsipKd;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const insertToEdispo = async (data: Omit<tbl_cux, "id">[]) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString().slice(-2);
  let insertedBerita: any = [];

  const beritaTerakhir = await dbEdispo.tbl_berita.findFirst({
    where: {
      arsip_kd: {
        startsWith: "A-" + year + "-",
      },
    },
    orderBy: {
      arsip_kd: "desc",
    },
    select: {
      arsip_kd: true,
    },
  });

  var next = beritaTerakhir?.arsip_kd;

  //https://advancedweb.hu/how-to-use-async-functions-with-array-map-in-javascript/
  const processed = await Promise.all(
    data.map(async (item) => {
      if (!item.is_disposisi) return;
      const jenisKd =
        item.rahasia === "1"
          ? parseInt(env.EDISPO_JENIS_KD_R!)
          : parseInt(env.EDISPO_JENIS_KD_B!);

      const sifatKd = item.rahasia === "1" ? 2 : 1;

      try {
        const pengirim = await dbEdispo.tbl_perwakilan_bridge_cux.findUnique({
          where: {
            kode_pengirim: item.kode_pengirim!,
          },
          select: {
            perwakilan_kd: true,
          },
        });

        const formattedDate = new Date(item.tanggal?.slice(0, 10)!);

        // disini kita gunakan find first karena berita_kd tidak unique di tabel tbl_berita, jika unik harusnya findUnique
        const isExist = await dbEdispo.tbl_berita.findFirst({
          where: {
            berita_kd: item.kd_berita!,
          },
        });

        if (isExist) {
          return;
        }

        //hardcoded jika tidak ada pendispo maka set ke 2 , biasanya 2 adalah komunikasi
        if (!item.pendispo || item.pendispo === undefined) {
          item.pendispo = "2";
        }

        next = nexArsipKd(next);

        const updateCux = async (kdBerita: string, mapTo: string) => {
          await dbEdispo.tbl_cux.update({
            where: {
              kd_berita: kdBerita,
            },
            data: {
              map_to: mapTo,
            },
          });
        };

        const createOne = await dbEdispo.tbl_berita.create({
          data: {
            arsip_kd: next,
            berita_kd: item.kd_berita!,
            jenis_kd: jenisKd!,
            sifat_kd: sifatKd,
            perwakilan_kd: pengirim?.perwakilan_kd!,
            jabatan_pengirim: item.nama_perwakilan!,
            derajat_kd: item.derajat!,
            tgl_berita: formattedDate,
            tgl_diarsipkan: currentDate,
            perihal_berita: item.perihal_berita!,
            berita_disposisikan: item.is_disposisi ? "Y" : "T",
            berita_fungsi_disposisi: parseInt(item.pendispo),
            berita_input_fungsi: 2, //hardcoded
            berita_input_user: 2, //hardcoded,
            // tbl_derajat: {
            //   connect: {
            //     derajat_kd: item.derajat!,
            //   },
            // },
            // tbl_jenis_berita: {
            //   connect: {
            //     jenis_kd: jenisKd,
            //   },
            // },
            // tbl_perwakilan: {
            //   connect: {
            //     perwakilan_kd: pengirim?.perwakilan_kd!,
            //   },
            // },
          },
        });
        // .then((res) => {
        //   insertedBerita.push(res);
        //   //map to tbl_cux
        // });

        await updateCux(createOne.berita_kd, createOne.arsip_kd);
        insertedBerita.push(createOne);

        return createOne;
      } catch (error: any) {
        throw new Error(error.message);
      }
    })
  );
  //console.log("insertedBerita", insertedBerita.length);
  //console.log("processed", processed.length);

  return {
    processed: processed,
    inserted: insertedBerita,
  };
};

// export const cuxToEdispo = async (importData: Omit<tbl_cux, "id">[]) => {
//   let newAlamat: any;
//   let inserted: any;

//   try {
//     newAlamat = mapCuxKodePengirimToTblPerwakilan(importData);
//     inserted = insertToEdispo(importData);
//   } catch (error: any) {
//     throw new Error(error);
//   }

//   return {
//     type: "CUX_TO_EDISPO",
//     data: newAlamat,
//     inserted: inserted,
//   };
// };

// export default cuxToEdispo;
