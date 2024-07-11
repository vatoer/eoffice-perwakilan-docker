import { ActionState } from "@/lib/create-action";

type TOutput = {
  uploaded?: number; // data asal yg diupload
  imported: number; // data yg diimport ke cux
  processed?: number; // data yg DIPROSES untuk diimport ke edispo
  inserted?: number; // data yg berhasil diimport ke edispo
};

type InputType = {
  data: FormData;
};

export type ReturnType = ActionState<InputType, TOutput>;
