import { getInboxByArsipKd } from "@/data/inbox";
import { getOutboxByArsipKd } from "@/data/outbox";
import { dbEdispo } from "@/lib/db-edispo";
import fs from "fs";
import { cwd } from "process";
import { downloadFile } from "./_utils/fetcher";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const inout = searchParams.get("inout") ?? "masuk";

  if (!id) {
    return new Response("ID is required", { status: 400 });
  }

  try {
    // read pdf file

    let filename;

    switch (inout) {
      case "keluar":
        const outbox = await getOutboxByArsipKd(id);
        if (!outbox) {
          return new Response("outbox not found", { status: 404 });
        }
        filename = outbox.berita_file;
        break;

      default:
        const inbox = await getInboxByArsipKd(id);
        if (!inbox) {
          return new Response("inbox not found", { status: 404 });
        }
        filename = inbox.berita_file;
        break;
    }

    if (!filename) {
      return new Response("File not found", { status: 404 });
    }

    //check if file is exists in the directory

    // if not exists, download from file server
    const dlFile = await downloadFile(inout, filename);

    const path = cwd();
    //const fullPath = `${path}/files-upload/2024/a.pdf`;
    //const file = await fs.promises.readFile(fullPath);
    // send the file as response
    return new Response(dlFile, {
      headers: {
        "Content-Type": "application/pdf",
      },
      statusText: "OK",
      status: 200,
    });
  } catch (error: any) {
    console.error("[ERROR UPLOAD]", error);
    return new Response(error.message, { status: 500 });
  }
}
