import { z } from "zod";
import { berkasSchema, fileSchema } from "./common";

const maxsize = 90485760 as const;

export const beritaKeluarSchema = z.object({
  arsip_kd: z.string().max(20).nullable().optional(), //
  berita_kd: z
    .string()
    .min(1, "isi dengan tanda - jika tidak ada nomor")
    .max(50)
    .refine((val) => checkPattern(val), {
      message:
        "Format harus sesuai dengan B|R-XXXXX/[a-zA-Z]+/YYMMDD, cth B-00001/PARIS/210101",
    })
    .refine(
      (val) => {
        const datePart = val.slice(-6);
        return isValidDate(datePart);
      },
      {
        message: "Tanggal tidak valid",
      }
    ),
  //sifat_kd: z.coerce.number().int(), // 1 biasa dan 2 rahasia akan didapatkan dari nomor berita
  pembuat_kd: z.number().int(),
  //tgl_berita: z.coerce.date(), // akan didapatkan dari nomor berita
  perihal_berita: z.string().max(255),
  berita_file: berkasSchema(maxsize),
  // no_agenda: z.string().max(10).nullable().optional(), didapatkan dari nama file
  // jml_hal: z.number().int().nullable().optional(), // g terlalu penting
  copy_berita: z.array(z.number()),
});

export const beritaKeluarEditModeSchema = beritaKeluarSchema.extend({
  berita_file: fileSchema(maxsize),
});
export type BeritaKeluarEditMode = z.infer<typeof beritaKeluarEditModeSchema>;
export type BeritaKeluar = z.infer<typeof beritaKeluarSchema>;

export default beritaKeluarSchema;

function checkPattern(input: string): boolean {
  const pattern = /^[BR]-\d{5}\/[a-zA-Z]+\/\d{6}$/;
  return pattern.test(input);
}

function isValidDate(dateStr: string): boolean {
  if (!/^\d{6}$/.test(dateStr)) return false;

  const year = parseInt(dateStr.substring(0, 2), 10) + 2000;
  const month = parseInt(dateStr.substring(2, 4), 10) - 1;
  const day = parseInt(dateStr.substring(4, 6), 10);

  const dateObj = new Date(year, month, day);
  return (
    dateObj.getFullYear() === year &&
    dateObj.getMonth() === month &&
    dateObj.getDate() === day
  );
}
