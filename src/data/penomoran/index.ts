"use server";
import { stripHtmlTags } from "@/utils/strip-html-tags";
import { DokumenKeluar } from "@/zod/schemas/penomoran";
import { generateNomorBapk, getDaftarBapk } from "./bapk";
import { generateNomorNodin, getDaftarNodin } from "./nodin";
import { generateNomorNodip, getDaftarNodip } from "./nodip";
import { generateNomorSK, getDaftarSK } from "./sk";
import { generateNomorSPPD, getDaftarSPPD } from "./sppd";
import { generateNomorSuket, getDaftarSuket } from "./suket";
import { generateNomorSuratKeluar, getDaftarSuratKeluar } from "./surat-keluar";
import { generateNomorSurtug, getDaftarSurtug } from "./surtug";

export interface Option {
  value: string;
  label: string;
}
export const getOptions = async () => {
  const options: Option[] = [
    { value: "bapk", label: "BAPK" },
    { value: "nodin", label: "Nota Dinas - nodin" },
    { value: "nodip", label: "Nota Diplomatik - nodip" },
    { value: "sk", label: "Surat Keputusan - SK" },
    { value: "sppd", label: "Surat Perintah Perjalanan Dinas - SPPD" },
    { value: "suket", label: "Surat keterangan - suket" },
    { value: "surat-keluar", label: "Surat Keluar" },
    { value: "surtug", label: "Surat Tugas - surtug" },
  ];
  return options;
};

const monthToRome = (month: number) => {
  switch (month) {
    case 1:
      return "I";
    case 2:
      return "II";
    case 3:
      return "III";
    case 4:
      return "IV";
    case 5:
      return "V";
    case 6:
      return "VI";
    case 7:
      return "VII";
    case 8:
      return "VIII";
    case 9:
      return "IX";
    case 10:
      return "X";
    case 11:
      return "XI";
    case 12:
      return "XII";
    default:
      return "";
  }
};

// bapk, nodin, nodip, sk, sppd, suket, surat-keluar, surtug
// beberapa table memiliki field yang sama, seperti nomor, perihal, tujuan, dll
// untuk itu, kita bisa membuat satu fungsi untuk generate nomor dokumen
// dengan parameter dokumen yang akan di-generate nomor dokumennya
// dan return dokumen yang sudah di-generate nomor dokumennya
// kita bisa menggunakan switch case untuk menentukan jenis dokumen
// dan memanggil fungsi generateNomorDokumen yang sesuai
// namun ada bbrp field yang beda misal sama-sama fungsi tp ada yg string ada yg number
// untuk compatibility, kita bisa menggunakan toString() atau parseInt() jika diperlukan

const generateNomorDokumen = async (dokumen: DokumenKeluar) => {
  const today = new Date();
  const year = today.getFullYear();
  const monthOfDokumen = dokumen.tanggalDokumen.getMonth() + 1;
  const monthOfDokumenInRome = monthToRome(monthOfDokumen);
  let nomor = "";

  const strip = stripHtmlTags("test");

  // stripHtmlTags for all text fields
  dokumen.nomor = stripHtmlTags(dokumen.nomor);
  dokumen.perihal = stripHtmlTags(dokumen.perihal);
  dokumen.tujuan = stripHtmlTags(dokumen.tujuan);

  try {
    switch (dokumen.jenis) {
      case "bapk":
        nomor = await generateNomorBapk(dokumen, year, monthOfDokumenInRome);
        break;
      case "nodin":
        nomor = await generateNomorNodin(dokumen, year, monthOfDokumenInRome);
        break;
      case "nodip":
        nomor = await generateNomorNodip(dokumen, year, monthOfDokumenInRome);
        break;
      case "sk":
        nomor = await generateNomorSK(dokumen, year, monthOfDokumenInRome);
        break;
      case "sppd":
        nomor = await generateNomorSPPD(dokumen, year, monthOfDokumenInRome);
        break;
      case "suket":
        nomor = await generateNomorSuket(dokumen, year, monthOfDokumenInRome);
        break;
      case "surat-keluar":
        nomor = await generateNomorSuratKeluar(
          dokumen,
          year,
          monthOfDokumenInRome
        );
        break;
      case "surtug":
        nomor = await generateNomorSurtug(dokumen, year, monthOfDokumenInRome);
        break;
      default:
        break;
    }

    dokumen.nomor = nomor;
    return dokumen;
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

export const getDaftarNomorDokumen = async (
  jenis: string
): Promise<DokumenKeluar[]> => {
  let dokumen: DokumenKeluar[] = [];
  try {
    switch (jenis) {
      case "bapk":
        dokumen = await getDaftarBapk();
        break;
      case "nodin":
        dokumen = await getDaftarNodin();
        break;
      case "nodip":
        dokumen = await getDaftarNodip();
        break;
      case "sk":
        dokumen = await getDaftarSK();
        break;
      case "sppd":
        dokumen = await getDaftarSPPD();
        break;
      case "suket":
        dokumen = await getDaftarSuket();
        break;
      case "surat-keluar":
        dokumen = await getDaftarSuratKeluar();
        break;
      case "surtug":
        dokumen = await getDaftarSurtug();
        break;
      default:
        break;
    }

    return dokumen;
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

export default generateNomorDokumen;
