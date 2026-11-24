import { isFeatureImage } from "./article-form";

export const articleImageTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
export const articleImageLimit = 10 * 1024 * 1024;

export function validArticleImage(file: File) {
  return articleImageTypes.includes(file.type) && file.size > 0 && file.size <= articleImageLimit;
}

export async function uploadArticleImage(file: File) {
  if (!validArticleImage(file)) throw new Error("Choose a JPEG, PNG, WebP or AVIF image up to 10 MB.");
  const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
  const preset = import.meta.env.VITE_CLOUDINARY_ARTICLE_PRESET?.trim();
  if (!cloud || !/^[\w-]+$/.test(cloud) || !preset) {
    throw new Error("Featured image uploads are not configured.");
  }
  const body = new FormData();
  body.set("file", file);
  body.set("upload_preset", preset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: "POST", body, signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error("Cloudinary could not upload the image. Please try again.");
  const result: { secure_url?: string } = await response.json();
  if (typeof result.secure_url !== "string" || !result.secure_url.startsWith("https://") || !isFeatureImage(result.secure_url)) {
    throw new Error("Cloudinary did not return a public image URL.");
  }
  return result.secure_url;
}
