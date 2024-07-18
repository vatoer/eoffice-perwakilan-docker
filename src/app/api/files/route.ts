import { getInboxByArsipKd } from "@/data/inbox";
import { getOutboxByArsipKd } from "@/data/outbox";
import { BASE_PATH_UPLOAD, saveBlobToFile } from "@/lib/save-file";
import fs from "fs";
import path from "path";
import { downloadFile } from "./_utils/fetcher";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const inout = searchParams.get("inout") ?? "masuk";

  if (!id) {
    return new Response("ID is required", { status: 400 });
  }

  interface Dokumen {
    arsip_kd: string;
    filename?: string | null;
    sifat_kd: string;
  }

  let dokumen: Dokumen;

  try {
    // read pdf file

    let filename;
    let yearlyFolder = "/non/exist/path";
    let BRPath = "NA";
    let year = "0000";

    // get the file name from the database
    switch (inout) {
      case "keluar":
        const outbox = await getOutboxByArsipKd(id);
        if (!outbox) {
          return new Response("outbox not found", { status: 404 });
        }
        filename = outbox.berita_file;
        BRPath = outbox.sifat_kd === 1 ? "RAHASIA" : "BIASA"; // PERHATIAN PERBEDAAN DENGAN inbox SIFAT_KD
        const datePortion = outbox.berita_kd.split("/").pop()!;
        // Extract the year part (YY)
        const yearPart = datePortion.substring(0, 2);
        year = parseInt(yearPart) < 50 ? `20${yearPart}` : `19${yearPart}`;
        break;

      default:
        const inbox = await getInboxByArsipKd(id);
        if (!inbox) {
          return new Response("inbox not found", { status: 404 });
        }
        filename = inbox.berita_file;
        BRPath = inbox.sifat_kd === 2 ? "RAHASIA" : "BIASA"; // PERHATIAN PERBEDAAN DENGAN outbox SIFAT_KD
        year = inbox.tgl_diarsipkan.getFullYear().toString();
        break;
    }

    if (!filename) {
      return new Response("File not found", { status: 404 });
    }

    // path construction
    if (!BASE_PATH_UPLOAD || !fs.existsSync(BASE_PATH_UPLOAD)) {
      yearlyFolder = path.join(process.cwd(), "files", BRPath, year.toString());
    } else {
      yearlyFolder = path.join(BASE_PATH_UPLOAD, BRPath, year.toString());
    }

    // get path to the file
    switch (inout) {
      case "keluar":
        yearlyFolder = path.join(yearlyFolder, "KELUAR");
        break;
      default:
        yearlyFolder = path.join(yearlyFolder, "MASUK");
        break;
    }

    const fullPath = path.join(yearlyFolder, filename);

    // new name for the file

    let dlFile: Blob | undefined;
    //check if file is exists in the directory
    // try from local first
    if (fs.existsSync(fullPath)) {
      console.log("[FILE FOUND ON LOCAL]", fullPath);
      dlFile = new Blob([fs.readFileSync(fullPath)], {
        type: "application/pdf",
      });
    } else {
      console.log("[FILE NOT FOUND ON LOCAL]", fullPath);
      // if not exists, download from file server
      if (!dlFile && process.env.LEGACY_EDISPO_ENABLED === "true") {
        console.log("[DOWNLOADING FILE FROM EDISPO SERVER]");
        dlFile = await downloadFile(inout, filename);
        // copy the file to the local directory
        if (dlFile) {
          //fs.writeFileSync(fullPath, Buffer.from(await dlFile.arrayBuffer()));
          console.log("[TRYING TO SAVE FILE TO LOCAL]", fullPath);
          try {
            const saveToLocal = await saveBlobToFile(dlFile, fullPath);
          } catch (error) {
            console.error("[ERROR SAVING FILE TO LOCAL]", error);
          }
        }
      }
    }

    // send the file as response
    return new Response(dlFile, {
      headers: {
        "Content-Type": "application/pdf",
      },
      statusText: "OK",
      status: 200,
    });
  } catch (error: any) {
    console.error("[ERROR GETTING FILE]", error);
    return new Response(error.message, { status: 500 });
  }
}
