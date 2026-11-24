import type {
  ArticlePage, ArticlePagination, PostCatalogEntry, PostCatalogInput, PostCatalogResource, PostType,
} from "@rexolute/types";
import api from "./axios";
import { publicApi } from "./transport";

type Success<T> = { status: "success"; data: T };

function catalogPath(postType: PostType, resource: PostCatalogResource, id?: string) {
  const path = `/cms/posts/${postType}/${resource}`;
  return id === undefined ? path : `${path}/${encodeURIComponent(id)}`;
}

function catalogEntry(data: Success<PostCatalogEntry>, postType: PostType, id?: string) {
  if (data?.status !== "success" || typeof data.data?.id !== "string" ||
      data.data.postType !== postType || (id !== undefined && data.data.id !== id)) {
    throw new Error("The catalog service returned an unexpected response.");
  }
  return data.data;
}

export const postCatalogs = {
  async list(postType: PostType, resource: PostCatalogResource, params: ArticlePagination, signal?: AbortSignal) {
    const { data } = await publicApi.get<Success<ArticlePage<PostCatalogEntry>>>(catalogPath(postType, resource), { params, signal });
    if (data?.status !== "success" || !Array.isArray(data.data?.items) ||
        !Number.isSafeInteger(data.data.total_count) || data.data.total_count < 0 ||
        !Number.isSafeInteger(data.data.limit) || data.data.limit < 1 ||
        data.data.items.some((entry) => entry.postType !== postType)) {
      throw new Error("The catalog service returned an unexpected response.");
    }
    return data.data;
  },
  async get(postType: PostType, resource: PostCatalogResource, id: string, signal?: AbortSignal) {
    const { data } = await publicApi.get<Success<PostCatalogEntry>>(catalogPath(postType, resource, id), { signal });
    return catalogEntry(data, postType, id);
  },
  async create(postType: PostType, resource: PostCatalogResource, input: PostCatalogInput) {
    const { data } = await api.post<Success<PostCatalogEntry>>(catalogPath(postType, resource), input);
    return catalogEntry(data, postType);
  },
  async update(postType: PostType, resource: PostCatalogResource, id: string, patch: Partial<PostCatalogInput>) {
    const { data } = await api.patch<Success<PostCatalogEntry>>(catalogPath(postType, resource, id), patch);
    return catalogEntry(data, postType, id);
  },
  async delete(postType: PostType, resource: PostCatalogResource, id: string) {
    await api.delete(catalogPath(postType, resource, id));
  },
  async listAll(postType: PostType, resource: PostCatalogResource, signal: AbortSignal) {
    const entries = new Map<string, PostCatalogEntry>();
    let lastPage = 1;
    for (let page = 1; page <= lastPage; page++) {
      signal.throwIfAborted();
      const result = await postCatalogs.list(postType, resource, { page, limit: 100 }, signal);
      lastPage = Math.ceil(result.total_count / result.limit);
      for (const entry of result.items) entries.set(entry.id, entry);
    }
    return [...entries.values()];
  },
};
