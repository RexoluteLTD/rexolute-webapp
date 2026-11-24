import { useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { postCatalogs } from "@rexolute/api/post-catalogs";
import type { PostType } from "@rexolute/types";
import { Button } from "@rexolute/ui/button";
import { Label } from "@rexolute/ui/label";
import { useCmsRequest } from "./use-cms-request";

interface PostCatalogFieldsProps {
  postType: PostType;
  category: string;
  tags: string[];
  onCategoryChange: (category: string) => void;
  onTagsChange: (tags: string[]) => void;
  categoryError?: string;
  tagsError?: string;
}

const selectStyle = "mt-2 block h-10 w-full rounded-md border border-input bg-background px-3 text-sm";

export function PostCatalogFields({
  postType, category, tags, onCategoryChange, onTagsChange, categoryError, tagsError,
}: PostCatalogFieldsProps) {
  const loadCategories = useCallback((signal: AbortSignal) => postCatalogs.listAll(postType, "categories", signal), [postType]);
  const loadTags = useCallback((signal: AbortSignal) => postCatalogs.listAll(postType, "tags", signal), [postType]);
  const categories = useCmsRequest(loadCategories);
  const tagCatalog = useCmsRequest(loadTags);
  const categoryEntries = categories.data ?? [];
  const tagNames = new Map(tagCatalog.data?.map(({ slug, name }) => [slug, name]));
  const availableTags = (tagCatalog.data ?? []).filter(({ slug }) => !tags.includes(slug));

  return (
    <>
      <div>
        <Label htmlFor="post-category">Category</Label>
        <select id="post-category" value={category} onChange={(event) => onCategoryChange(event.target.value)}
          className={selectStyle} aria-invalid={!!categoryError} aria-describedby={categoryError ? "post-category-error" : undefined}>
          <option value="">No category</option>
          {categoryEntries.map(({ id, slug, name }) => <option key={id} value={slug}>{name}</option>)}
          {category && !categoryEntries.some(({ slug }) => slug === category) && <option value={category}>{category}</option>}
        </select>
        {categoryError && <p id="post-category-error" role="alert" className="mt-1 text-sm text-red-600">{categoryError}</p>}
        <CatalogStatus label="categories" {...categories} />
        <Link to="/cms/categories" className="mt-1 inline-block text-sm text-[#246b03] underline">Manage categories</Link>
      </div>
      <div>
        <Label htmlFor="post-tags">Tags</Label>
        <select id="post-tags" value="" onChange={(event) => {
          if (event.target.value) onTagsChange([...tags, event.target.value]);
        }} className={selectStyle} disabled={availableTags.length === 0 || tags.length >= 40}
          aria-invalid={!!tagsError} aria-describedby={tagsError ? "post-tags-error" : undefined}>
          <option value="" disabled>{tags.length >= 40 ? "40 tags selected" : "Select a tag"}</option>
          {availableTags.map(({ id, slug, name }) => <option key={id} value={slug}>{name}</option>)}
        </select>
        {tags.length > 0 && (
          <ul aria-label="Selected tags" className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <li key={`${index}-${tag}`} className="inline-flex max-w-full items-center gap-1 rounded-md border px-2 text-sm">
                <span className="break-all">{tagNames.get(tag) ?? tag}</span>
                <Button type="button" size="sm" variant="ghost" className="px-2" aria-label={`Remove tag ${tagNames.get(tag) ?? tag}`}
                  onClick={() => onTagsChange(tags.filter((_, position) => position !== index))}>×</Button>
              </li>
            ))}
          </ul>
        )}
        {tagsError && <p id="post-tags-error" role="alert" className="mt-1 text-sm text-red-600">{tagsError}</p>}
        <CatalogStatus label="tags" {...tagCatalog} />
        <Link to="/cms/tags" className="mt-1 inline-block text-sm text-[#246b03] underline">Manage tags</Link>
      </div>
    </>
  );
}

function CatalogStatus({ label, loading, error, reload }: {
  label: string; loading: boolean; error?: { message: string }; reload: () => void;
}) {
  if (loading) return <p role="status" className="mt-1 text-sm text-muted-foreground">Loading {label}…</p>;
  if (!error) return null;
  return (
    <div className="mt-1 text-sm text-red-600">
      <p role="alert">Could not load {label}. {error.message}</p>
      <Button type="button" variant="link" className="px-0" onClick={reload}>Retry {label}</Button>
    </div>
  );
}
