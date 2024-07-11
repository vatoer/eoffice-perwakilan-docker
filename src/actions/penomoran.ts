import generateNomorDokumen, { getDaftarNomorDokumen } from "@/data/penomoran";
import { DokumenKeluar } from "@/zod/schemas/penomoran";
import { ActionResponse } from "./response";

interface GenerateNomorResult {
  dokumen: DokumenKeluar;
}
export const generateNomor = async (
  dokumen: DokumenKeluar
): Promise<ActionResponse<GenerateNomorResult>> => {
  try {
    const nomor = await generateNomorDokumen(dokumen);
    return {
      success: true,
      data: {
        dokumen: nomor,
      },
    };
  } catch (error) {
    console.error("Error generating document number:", error);
    // Return or throw a standardized error response
    return {
      success: false,
      error: "Failed to generate document number.",
    };
  }
};

export const getDaftarNomor = async (
  jenis: string
): Promise<ActionResponse<DokumenKeluar[]>> => {
  try {
    const daftarNomor = await getDaftarNomorDokumen(jenis);
    return {
      success: true,
      data: daftarNomor,
    };
  } catch (error) {
    console.error("Error generating document number:", error);
    // Return or throw a standardized error response
    return {
      success: false,
      error: "Failed to generate document number.",
    };
  }
};

export default generateNomor;
