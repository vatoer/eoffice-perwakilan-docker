import { stripHtmlTags } from "@/utils/strip-html-tags";
import { z } from "zod";
import { berkasSchema, fileSchema } from "./common";

export const beritaSchema = z.object({
  arsip_kd: z.string().max(20).nullable().optional(), //
  berita_kd: z
    .string()
    .min(1, "isi dengan tanda - jika tidak ada nomor")
    .max(50)
    .refine((val) => stripHtmlTags(val).length > 0, {
      message: "isi dengan tanda - jika tidak ada nomor",
    }),
  jenis_kd: z.number().int(),
  sifat_kd: z.coerce.number().int(),
  perwakilan_kd: z.number().int(),
  perwakilan_nama: z.string().max(100).optional().nullable(),
  jabatan_pengirim: z
    .string()
    .max(50)
    .default("-")
    .refine((val) => val === "" || stripHtmlTags(val).length > 0, {
      message: "isi dengan tanda - jika tidak ada jabatan",
    }),
  derajat_kd: z.string().max(3),
  tgl_berita: z.coerce.date(),
  //tgl_diarsipkan: z.date(),
  perihal_berita: z
    .string()
    .min(3)
    .max(255)
    .refine((val) => stripHtmlTags(val).length > 3, {
      message: "isi perihal",
    }),
  //berita_file: z.string().max(100).nullable().optional(),
  berita_file: berkasSchema(),
  keterangan: z
    .string()
    .nullable()
    .optional()
    .refine((val) => val === "" || stripHtmlTags(val).length > 0, {
      message: "isi keterangan",
    }),

  //status_disposisi: z.string().max(1).default("T"),
  //tgl_disposisi: z.date().nullable().optional(),
  berita_disposisikan: z.string().max(1).default("T"),
  berita_fungsi_disposisi: z.coerce.number().int().default(2),
  berita_input_fungsi: z.number().int().nullable().optional(),
  //berita_berkas_disposisi: berkasSchema(),
  berita_input_user: z.number().int().nullable().optional(),
});

export const beritaEditModeSchema = beritaSchema.extend({
  berita_file: fileSchema(),
});

export type BeritaEditMode = z.infer<typeof beritaEditModeSchema>;

export type Berita = z.infer<typeof beritaSchema>;
export type BeritaWithoutFile = Omit<Berita, "berita_file">;

export default beritaSchema;
