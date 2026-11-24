import { postCatalogs } from "@rexolute/api/post-catalogs";

export const loadArticleCategories = (signal: AbortSignal) => postCatalogs.listAll("article", "categories", signal);
export const loadArticleTags = (signal: AbortSignal) => postCatalogs.listAll("article", "tags", signal);
