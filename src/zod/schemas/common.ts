import { z } from "zod";

/**
 * Converts file size in bytes to a human-readable format.
 * @param {number} bytes - The file size in bytes.
 * @param {boolean} si - Whether to use SI units (true) or binary units (false).
 * @returns {string} The file size in a human-readable format.
 */
function formatFileSize(bytes: number, si: boolean = true): string {
  const unit = si ? 1000 : 1024;
  if (bytes < unit) return bytes + " B";
  const exp = Math.floor(Math.log(bytes) / Math.log(unit));
  const pre = (si ? "kMGTPE" : "KMGTPE").charAt(exp - 1) + (si ? "" : "i");
  return (bytes / Math.pow(unit, exp)).toFixed(2) + " " + pre + "B";
}

export const berkasSchema = (maxsize: number = 10485760) =>
  z
    .instanceof(File, { message: "Silakan pilih file" })
    .refine((file) => file.size > 0, "file tidak boleh kosong")
    .refine(
      (file) => file.size < maxsize,
      `Ukuran file maksimal ${formatFileSize(maxsize)}`
    )
    .refine((file) => file.type === "application/pdf", {
      message: "Format .pdf",
    });

export const fileSchema = (maxsize: number = 10485760) =>
  z.union([
    z
      .instanceof(File, { message: "Silakan pilih file yg diedit" })
      .refine((file) => file.size > 0, "file tidak boleh kosong")
      .refine(
        (file) => file.size < maxsize,
        `Ukuran file maksimal ${formatFileSize(maxsize)}`
      )
      .refine((file) => file.type === "application/pdf", {
        message: "Format .pdf",
      }),
    z.undefined(),
  ]);
