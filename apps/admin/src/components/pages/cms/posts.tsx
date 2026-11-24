import { useCallback, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { authenticatedArticles, articleErrorMessage } from "@rexolute/api/articles";
import type { ArticleState } from "@rexolute/types";
import Head from "@rexolute/ui/head";
import { Button } from "@rexolute/ui/button";
import { Input } from "@rexolute/ui/input";
import { Label } from "@rexolute/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@rexolute/ui/table";
import { useAuth } from "../../../hooks/use-auth";
import { canManageArticle } from "./article-form";
import { useCmsRequest } from "./use-cms-request";

export default function PostsPage() {
  const { session } = useAuth();
  const canViewDrafts = canManageArticle(session?.user, "view");
  const canCreate = canManageArticle(session?.user, "create");
  const [state, setState] = useState<ArticleState>("published");
  const [query, setQuery] = useState({ page: 1, category: "", tag: "" });
  const visibleState = canViewDrafts ? state : "published";
  const load = useCallback((signal: AbortSignal) => authenticatedArticles.list({
    page: query.page, state: visibleState,
    category: query.category || undefined, tag: query.tag || undefined,
  }, signal), [query, visibleState]);

  const { data, error, loading, reload } = useCmsRequest(load);
  const items = data?.items.filter((article) => article.state === visibleState) ?? [];
  const pages = data ? Math.max(1, Math.ceil(data.total_count / data.limit)) : 1;

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    setQuery({ page: 1, category: String(values.get("category") ?? "").trim(), tag: String(values.get("tag") ?? "").trim() });
  }

  return (
    <div className="p-6">
      <Head title="Articles" />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Articles</h1>
        {canCreate && <Button asChild className="bg-[#2E8902] text-white hover:bg-[#236b02]"><Link to="/cms/new-post">Add article</Link></Button>}
      </div>
      <form className="mb-5 flex flex-wrap items-end gap-3" onSubmit={applyFilters}>
        {canViewDrafts && (
          <div className="space-y-1">
            <Label htmlFor="article-state">State</Label>
            <select id="article-state" className="block h-10 rounded-md border bg-background px-3 text-sm" value={visibleState} onChange={(event) => {
              setState(event.target.value === "draft" ? "draft" : "published");
              setQuery((current) => ({ ...current, page: 1 }));
            }}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        )}
        <div className="space-y-1"><Label htmlFor="article-category">Category</Label><Input id="article-category" name="category" /></div>
        <div className="space-y-1"><Label htmlFor="article-tag">Tag</Label><Input id="article-tag" name="tag" /></div>
        <Button type="submit" variant="outline">Apply filters</Button>
      </form>
      <div aria-busy={loading}>
        {loading && <p role="status">Loading articles…</p>}
        {error && <div role="alert" className="space-y-3 text-sm text-red-600"><p>{articleErrorMessage(error)}</p><Button variant="outline" onClick={reload}>Try again</Button></div>}
        {data && items.length === 0 && <p>No {visibleState === "draft" ? "draft" : "published"} articles found.</p>}
        {items.length > 0 && (
          <div className="rounded-md border bg-white">
            <Table>
              <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Author</TableHead><TableHead>Category</TableHead><TableHead>State</TableHead><TableHead>Updated</TableHead></TableRow></TableHeader>
              <TableBody>
                {items.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium"><Link className="text-[#246b03] underline" to="/cms/posts/$id" params={{ id: article.id }}>{article.title}</Link></TableCell>
                    <TableCell>{article.username || "—"}</TableCell>
                    <TableCell>{article.category || "—"}</TableCell>
                    <TableCell className="capitalize">{article.state}</TableCell>
                    <TableCell><time dateTime={article.updated_at}>{new Date(article.updated_at).toLocaleDateString()}</time></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {data && (pages > 1 || query.page > 1) && (
          <nav aria-label="Article pages" className="mt-4 flex flex-wrap items-center gap-3">
            <Button variant="outline" disabled={query.page <= 1} onClick={() => setQuery({ ...query, page: query.page - 1 })}>Previous</Button>
            <span>Page {data.current_page} of {pages}</span>
            <Button variant="outline" disabled={query.page >= pages} onClick={() => setQuery({ ...query, page: query.page + 1 })}>Next</Button>
          </nav>
        )}
      </div>
    </div>
  );
}
