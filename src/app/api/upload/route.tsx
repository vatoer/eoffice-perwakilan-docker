import { setPasswordForPDF } from "@/utils/pdf-utils";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();

    const filename = data.get("filename") as string;
    const file = data.get("file") as File;

    // Create the /files folder if it doesn't exist
    const filesFolder = path.join(process.cwd(), "files");
    if (!fs.existsSync(filesFolder)) {
      fs.mkdirSync(filesFolder);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write the file to the /files folder
    fs.writeFileSync(filesFolder + "/" + filename, buffer);

    return NextResponse.json({ message: "chunk Upload complete" });
  } catch (error) {
    console.error("[ERROR UPLOAD]", error);
  } finally {
    console.log("Upload complete");
  }
}
