// create route DELETE to delete uploaded files
// Path: app/api/upload/delete/route.tsx
// Compare this snippet from app/api/upload/route.tsx:
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
//
export async function DELETE(req: NextRequest) {
  try {
    // TODO : check siapa yang mengakses

    const data = await req.formData();

    const filename = data.get("filename") as string;

    // Create the /files folder if it doesn't exist
    const fileTobeDeleted = path.join(process.cwd(), "files", filename);

    if (!fs.existsSync(fileTobeDeleted)) {
      return NextResponse.json({ message: "File not found" }, { status: 404 });
    }

    // Delete the file from the /files folder
    //https://www.tutorialkart.com/nodejs/delete-a-file-in-nodejs-using-node-fs/
    fs.unlinkSync(fileTobeDeleted);

    return NextResponse.json({ message: "File deleted" });
  } catch (error) {
    console.error("[ERROR DELETE]", error);
  } finally {
    console.log("Delete complete");
  }
}
