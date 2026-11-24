import type { ArticleDocument } from "@rexolute/types";
import { z } from "zod";

const encoder = new TextEncoder();
export const utf8Length = (value: string) => encoder.encode(value).length;
export const parseTags = (value: string) => value.trim() ? value.trim().split(/\r?\n/).map((tag) => tag.trim()) : [];

export function isFeatureImage(value: string) {
  if (utf8Length(value) > 2048 || /[\\\r\n\t]/.test(value)) return false;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const url = new URL(value);
    return /^(http|https):\/\//i.test(value) && !!url.hostname && !url.username && !url.password;
  } catch {
    return false;
  }
}

export const articleFormSchema = z.object({
  title: z.string().trim().min(1, "Enter a title.").refine((value) => utf8Length(value) <= 255, "Use at most 255 UTF-8 bytes."),
  category: z.string().trim().refine((value) => utf8Length(value) <= 80, "Use at most 80 UTF-8 bytes."),
  tags: z.string().superRefine((value, context) => {
    const tags = parseTags(value);
    if (tags.length > 40) context.addIssue({ code: "custom", message: "Use at most 40 tags." });
    if (tags.some((tag) => !tag || utf8Length(tag) > 64)) {
      context.addIssue({ code: "custom", message: "Each tag must contain 1–64 UTF-8 bytes." });
    }
  }),
  featureImage: z.string().refine((value) => !value || isFeatureImage(value), "Use an HTTP(S) URL or an absolute site path."),
});

export type ArticleFormFields = z.infer<typeof articleFormSchema>;

export function isArticleDocument(value: unknown): value is ArticleDocument {
  return typeof value === "object" && value !== null &&
    "type" in value && value.type === "doc" && "content" in value && Array.isArray(value.content);
}

export type ArticlePermission = "view" | "create" | "edit" | "delete";

export function canManageArticle(user: { role: string; permissions: string[] } | undefined, permission: ArticlePermission) {
  return user?.role === "admin" && user.permissions.includes(permission);
}
