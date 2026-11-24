import type { ArticleNode } from "@rexolute/types";

export const blogArticleShellPath = "/blog/00000000-0000-0000-0000-000000000000";
export const articleIdPattern = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

export const blogImagePlaceholder = "/svg/placeholder.svg";

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" });
export const formatBlogDate = (date: string) => dateFormat.format(new Date(date));

export function articleText(node: ArticleNode): string {
  return node.text ?? node.content?.map(articleText).join(node.type === "paragraph" ? "" : " ") ?? "";
}
