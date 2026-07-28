import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "bachatmall/products",
            transformation: [{ width: 800, crop: "limit", quality: "auto:good", fetch_format: "auto" }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    return NextResponse.json({ url: uploadResult.secure_url });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}