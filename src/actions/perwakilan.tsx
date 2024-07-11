"use server";
import { ActionResponse } from "@/actions/response";
import { Perwakilan, simpanPerwakilan } from "@/data/alamat";
export const simpanPerwakilanBaru = async (
  perwakilan: Perwakilan
): Promise<ActionResponse<Perwakilan>> => {
  const newPwk = await simpanPerwakilan(perwakilan);

  if (newPwk instanceof Error) {
    return {
      success: false,
      error: newPwk.message,
    };
  }

  return {
    success: true,
    data: newPwk,
  };
};
