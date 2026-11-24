import type {
  Article, ArticleComment, ArticleInput, ArticleLike, ArticleLikeResult, ArticlePage,
  ArticlePagination, ArticleQuery,
} from "@rexolute/types";
import api from "./axios";
import type { ApiError } from "./error";
import { publicApi } from "./transport";

type Success<T> = { status: "success"; data: T };
const base = "/cms/posts/article";
const articlePath = (id: string) => `${base}/${encodeURIComponent(id)}`;
const commentPath = (id: string, commentId: string) => `${articlePath(id)}/comments/${encodeURIComponent(commentId)}`;
const commentsPath = (id: string, parentId?: string) => parentId
  ? `${commentPath(id, parentId)}/replies` : `${articlePath(id)}/comments`;
const likesPath = (id: string, commentId?: string) => `${commentId ? commentPath(id, commentId) : articlePath(id)}/likes`;

function reads(client: typeof publicApi) {
  return {
    async list(params: ArticleQuery, signal?: AbortSignal) {
      return (await client.get<Success<ArticlePage<Article>>>(base, { params, signal })).data.data;
    },
    async get(id: string, signal?: AbortSignal) {
      return (await client.get<Success<Article>>(articlePath(id), { signal })).data.data;
    },
    async listComments(id: string, params: ArticlePagination, parentId?: string, signal?: AbortSignal) {
      return (await client.get<Success<ArticlePage<ArticleComment>>>(commentsPath(id, parentId), { params, signal })).data.data;
    },
    async getComment(id: string, commentId: string, signal?: AbortSignal) {
      return (await client.get<Success<ArticleComment>>(commentPath(id, commentId), { signal })).data.data;
    },
    async listLikes(id: string, params: ArticlePagination, commentId?: string, signal?: AbortSignal) {
      return (await client.get<Success<ArticlePage<ArticleLike>>>(likesPath(id, commentId), { params, signal })).data.data;
    },
  };
}

export const publicArticles = reads(publicApi);

export const authenticatedArticles = {
  ...reads(api),
  async create(input: ArticleInput) {
    return (await api.post<Success<Article>>(base, input)).data.data;
  },
  async update(id: string, input: Partial<ArticleInput>) {
    return (await api.patch<Success<Article>>(articlePath(id), input)).data.data;
  },
  async delete(id: string) {
    await api.delete(articlePath(id));
  },
  async addComment(id: string, content: string, parentId?: string) {
    return (await api.post<Success<ArticleComment>>(commentsPath(id, parentId), { content })).data.data;
  },
  async updateComment(id: string, commentId: string, content: string) {
    return (await api.patch<Success<ArticleComment>>(commentPath(id, commentId), { content })).data.data;
  },
  async deleteComment(id: string, commentId: string) {
    await api.delete(commentPath(id, commentId));
  },
  async setLike(id: string, liked: boolean, commentId?: string) {
    return (await api.request<Success<ArticleLikeResult>>({ method: liked ? "PUT" : "DELETE", url: likesPath(id, commentId) })).data.data;
  },
};

export function articleErrorMessage(error: ApiError) {
  if (error.message !== "Something went wrong") return error.message;
  switch (error.status) {
    case 401: return "Sign in again to continue.";
    case 403: return "You do not have permission to perform this action.";
    case 404: return "Article not found.";
    case 409: return "The article changed. Reload it and try again.";
    default: return error.code === "ERR_NETWORK" || error.code === "ECONNABORTED"
      ? "The service could not be reached. Check your connection and try again."
      : "Something went wrong. Please try again.";
  }
}
