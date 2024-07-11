import { dbEdispo } from "@/lib/db-edispo";
import { Prisma, tbl_cux } from "@prisma-dbedispo/client";
import { revalidatePath } from "next/cache";
import { env } from "process";
import {
  //cuxToEdispo,
  insertToEdispo,
  mapCuxKodePengirimToTblPerwakilan,
} from "./cux-to-edispo";
import { ReturnType } from "./types";

/**
 * @description remap property name case dari uppercase ke lowercase
 * @param data
 * @returns
 */
export const remapPropertyName = (data: any[]): Omit<tbl_cux, "id">[] => {
  const remappedData = data.map((item) => {
    const newItem: any = {};
    for (const key in item) {
      newItem[key.toLowerCase()] = item[key];
    }
    delete newItem["id"];
    return newItem;
  });
  return remappedData;
};

export const handler = async (importData: any[]): Promise<ReturnType> => {
  let createMany: any;
  let inserted = 0;
  let processed = 0;
  let remapedData: Omit<tbl_cux, "id">[];

  //make sure EDISPO_JENIS_KD_R and EDISPO_JENIS_KD_B is defined in .env
  if (
    typeof env.EDISPO_JENIS_KD_R === "undefined" ||
    env.EDISPO_JENIS_KD_B === "undefined"
  )
    throw new Error("EDISPO_JENIS_KD_R is undefined");

  try {
    remapedData = remapPropertyName(importData);
    const newInsertedPerwakilan = await mapCuxKodePengirimToTblPerwakilan(
      remapedData
    );
  } catch (error: any) {
    return {
      error: "mapCuxKodePengirimToTblPerwakilan",
      data: {
        uploaded: importData.length,
        processed: 0,
        imported: 0,
        inserted: 0,
      },
    };
  }

  try {
    //data di import ke cux
    createMany = await dbEdispo.tbl_cux.createMany({
      data: remapedData,
      skipDuplicates: true,
    });

    //asumsi bahwa jika ada data yg diimport ke tbl_cux, maka data tersebut akan di proses ke edispo
    //meskipun demikian, jika data yang diimport sudah ada di tbl_berita maka data tersebut tidak akan diinsert ke tbl_berita
    if (createMany.count > 0) {
      const insertedToEdispo = await insertToEdispo(remapedData);
      inserted = insertedToEdispo.inserted.length;
      processed = insertedToEdispo.processed.length;
    }
  } catch (e: Prisma.PrismaClientKnownRequestError | any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === "P2002") {
        console.log(
          "There is a unique constraint violation, a new user cannot be created with this email"
        );
      }
    } else {
      console.error("[IMPORT-CUX ERROR UNKNOWN]");
    }
    //throw e;
    //throw new Error("Error importing cux" + e.message);

    return {
      error: e.message,
      data: {
        uploaded: importData.length,
        processed: 0,
        imported: 0,
        inserted: 0,
      },
    };
  }
  revalidatePath("/exim");
  return {
    error: null,
    data: {
      uploaded: importData.length,
      processed: processed || 0,
      imported: createMany?.count || 0,
      inserted: inserted || 0,
    },
  };
};

export { handler as importCux };
