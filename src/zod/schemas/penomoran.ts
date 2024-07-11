import { z } from "zod";
import { fileSchema } from "./common";

export const dokumenKeluarSchema = z.object({
  id: z.number().int().nullable().optional(), //
  jenis: z.string().min(2).max(25), // jenis dokumen
  nomor: z.string().max(255).optional(), // nomor dokumen
  fungsi: z.number().int(),
  perihal: z
    .string()
    .min(1, {
      message: "Isi dengan - jika tidak ada",
    })
    .max(2000),
  tujuan: z
    .string()
    .min(1, {
      message: "Isi dengan - jika tidak ada",
    })
    .max(2000)
    .optional()
    .default("-"),
  tanggalDokumen: z.coerce.date(),
  createdBy: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  file: fileSchema(),
});

export type DokumenKeluar = z.infer<typeof dokumenKeluarSchema>;

export default dokumenKeluarSchema;
