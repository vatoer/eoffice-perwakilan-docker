import { z } from "zod";
import { berkasSchema } from "./common";

export const uploadFileSchema = z.object({
  id: z.number().int().nullable().optional(), //
  code: z.string().optional(), //
  file: berkasSchema(),
});

export type UploadFile = z.infer<typeof uploadFileSchema>;

export default uploadFileSchema;
