export type PostType = "article" | "community";
export type PostCatalogResource = "categories" | "tags";

export interface PostCatalogInput {
  name: string;
  slug: string;
  description: string;
}

export interface PostCatalogEntry extends PostCatalogInput {
  id: string;
  postType: PostType;
  created_at: string;
  updated_at: string;
}
