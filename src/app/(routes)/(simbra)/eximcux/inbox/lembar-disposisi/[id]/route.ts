import { dbEdispo } from "@/lib/db-edispo";
import { format } from "date-fns";

import { tbl_cux } from "@prisma-dbedispo/client";
import { promises } from "fs";
import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  console.log(params.id);

  let data: tbl_cux | null = null;

  try {
    // get data from database
    data = await dbEdispo.tbl_cux.findFirst({
      where: {
        map_to: params.id,
      },
    });
    console.log(data);
  } catch (error) {
    console.log(error);
  }

  if (!data) {
    return new NextResponse("Data not found", { status: 404 });
  }

  try {
    //check if the template is a valid pdf and exist
    const templatePath = "./pdf-templates/LDBR-FORM.pdf";
    const templateExists = await promises
      .access(templatePath)
      .then(() => true)
      .catch(() => false);

    if (!templateExists) {
      return new NextResponse("PDF template not found, contact administrator", {
        status: 400,
      });
    }

    const template = await readFile(templatePath);
    const pdfDoc = await PDFDocument.load(template);
    if (!pdfDoc) {
      return new NextResponse("Invalid PDF template", { status: 400 });
    }

    const form = pdfDoc.getForm();

    const fields = form.getFields().map((field) => field.getName());

    console.log("fields", fields);

    form.getTextField("dari").setText(data.nama_perwakilan);
    form.getTextField("nomor").setText(data.kd_berita);
    form.getTextField("tanggal").setText(format(data.tanggal, "dd MMMM yyyy"));

    form.getTextField("perihal").setText(data.perihal_berita);
    form.getTextField("agenda").setText(data.no_agenda);
    form.flatten();

    const pdfBytes = await pdfDoc.save();
    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        //"Content-Disposition": 'attachment; filename="f1.pdf"',
      },
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("E0003", { status: 400 });
  }
}
