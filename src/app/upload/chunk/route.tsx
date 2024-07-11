import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const saveChunk = async (chunk: string, filename: string) => {
  return new Promise((resolve, reject) => {
    const filesFolder = path.join(process.cwd(), "files", "chunk");
    const filePath = path.join(filesFolder, filename);
    if (!fs.existsSync(filesFolder)) {
      fs.mkdirSync(filesFolder);
    }
    console.log("filePath ", filePath);

    const writeStream = fs.createWriteStream(filePath);
    writeStream.on("finish", () => {
      resolve("finish");
    });
    writeStream.on("error", (error) => {
      reject(error);
    });
    writeStream.write(chunk);
    writeStream.end();
  });
};

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();

    const filename = data.get("randomString") as string;
    const fileChunk = data.get("chunk") as Blob;
    const currentChunk = data.get("currentChunk") as string;

    const chunk = Buffer.from(await fileChunk.arrayBuffer()).toString("base64");
    //console.log("chunk", chunk);

    const saved = await saveChunk(chunk, filename + "-" + currentChunk);

    if (saved === "finish") {
      return NextResponse.json({ message: "chunk Upload complete" });
    } else {
      return NextResponse.json({ message: "chunk Upload error" });
    }
  } catch (error: any) {
    console.error("[ERROR UPLOAD]", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  } finally {
    console.log("Upload complete");
  }
}
