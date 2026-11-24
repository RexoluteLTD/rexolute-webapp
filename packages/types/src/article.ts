export type ArticleState = "draft" | "published";

export interface ArticleNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: ArticleNode[];
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  text?: string;
}

export interface ArticleDocument extends ArticleNode {
  type: "doc";
  content: ArticleNode[];
}

export interface ArticleInput {
  title: string;
  content: ArticleDocument;
  featureImage?: string;
  category?: string;
  tags?: string[];
  state?: ArticleState;
}

export interface Article extends ArticleInput {
  id: string;
  postType: "article";
  state: ArticleState;
  tags: string[];
  user_id: string;
  username: string;
  count_likes: number;
  count_comments: number;
  created_at: string;
  updated_at: string;
}

export interface ArticlePage<T> {
  items: T[];
  total_count: number;
  current_page: number;
  limit: number;
}

export interface ArticlePagination {
  page?: number;
  limit?: number;
}

export interface ArticleQuery extends ArticlePagination {
  state?: ArticleState;
  category?: string;
  tag?: string;
}

export interface ArticleComment {
  id: string;
  post_id: string;
  parent_id?: string;
  user_id: string;
  username: string;
  content: string;
  count_likes: number;
  count_comments: number;
  created_at: string;
  updated_at: string;
}

export interface ArticleLike {
  user_id: string;
  created_at: string;
}

export interface ArticleLikeResult {
  liked: boolean;
  count_likes: number;
}
