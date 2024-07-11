import { dbEdispo } from "@/lib/db-edispo";
import { NextResponse } from "next/server";
export async function GET(req: Request) {
  const data = await dbEdispo.tbl_fungsi.findMany({
    select: {
      fungsi_kd: true,
      nama_fungsi: true,
    },
    where: {
      disposisi_fungsi: "Y",
    },
  });

  const options = data.map((item) => {
    return { value: item.fungsi_kd.toString(), label: item.nama_fungsi };
    //return { value: item.id, label: item.nama_fungsi };
  });

  // const data = [
  //   { value: "1", label: "satu" },
  //   { value: "2", label: "dua" },
  //   { value: "3", label: "tiga" },
  //   { value: "4", label: "empat" },
  //   { value: "5", label: "lima" },
  // ];
  return NextResponse.json(options);
}
