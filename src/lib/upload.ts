import { v2 as cloudinary } from "cloudinary";

/**
 * Image upload helper backed by Cloudinary. Configure these in .env:
 *   CLOUDINARY_CLOUD_NAME=
 *   CLOUDINARY_API_KEY=
 *   CLOUDINARY_API_SECRET=
 */
let configured = false;

function ensureConfigured() {
  if (configured) return;

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  configured = true;
}

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

/**
 * Upload a base64 data URL or remote URL to Cloudinary.
 * Use on the server only (API routes / server actions).
 */
export async function uploadImage(
  source: string,
  folder = "shopka/products"
): Promise<UploadResult> {
  ensureConfigured();

  const result = await cloudinary.uploader.upload(source, {
    folder,
    resource_type: "image",
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  };
}

export async function deleteImage(publicId: string): Promise<void> {
  ensureConfigured();
  await cloudinary.uploader.destroy(publicId);
}

/**
 * Validate a File before uploading from a form (size in MB, allowed types).
 */
export function validateImageFile(
  file: { size: number; type: string },
  maxSizeMb = 5
): { valid: boolean; error?: string } {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Only JPEG, PNG, and WebP images are allowed.",
    };
  }

  if (file.size > maxSizeMb * 1024 * 1024) {
    return {
      valid: false,
      error: `Image must be smaller than ${maxSizeMb}MB.`,
    };
  }

  return { valid: true };
}
