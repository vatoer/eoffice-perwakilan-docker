"use server";
import { ActionResponse } from "@/actions/response";
import { dbEdispo } from "@/lib/db-edispo";
import { tbl_negara } from "@prisma-dbedispo/client";
export const getNegara = async (
  searcTerm?: string
): Promise<ActionResponse<tbl_negara[]>> => {
  const negara = await dbEdispo.tbl_negara.findMany();
  return {
    success: true,
    data: negara,
  };
};
