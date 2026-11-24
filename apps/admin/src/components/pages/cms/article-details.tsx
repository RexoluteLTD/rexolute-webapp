import { useCallback, useState } from "react";
import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import { parseAxiosError } from "@rexolute/api";
import { articleErrorMessage, authenticatedArticles } from "@rexolute/api/articles";
import type { Article } from "@rexolute/types";
import { ArticleContent } from "@rexolute/ui/article-content";
import { Button } from "@rexolute/ui/button";
import Head from "@rexolute/ui/head";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@rexolute/ui/alert-dialog";
import { useAuth } from "../../../hooks/use-auth";
import { toast } from "../../../hooks/use-toast";
import { canManageArticle } from "./article-form";
import { ArticleEditor } from "./new-post";
import { useCmsRequest } from "./use-cms-request";

const detailRoute = getRouteApi("/_authenticated/cms/posts/$id");

export default function ArticleDetailsPage() {
  const { id } = detailRoute.useParams();
  const load = useCallback((signal: AbortSignal) => authenticatedArticles.get(id, signal), [id]);
  const { data, error, loading, reload } = useCmsRequest(load);

  if (data) return <ArticleDetails key={id} article={data} reload={reload} />;

  return (
    <div className="space-y-4 p-6">
      <Button asChild variant="link" className="px-0"><Link to="/cms/posts">Back to articles</Link></Button>
      {loading && <p role="status">Loading article…</p>}
      {error && <p role="alert" className="text-sm text-red-600">{articleErrorMessage(error)}</p>}
      {error && error.status !== 404 && <Button variant="outline" onClick={reload}>Try again</Button>}
    </div>
  );
}

function ArticleDetails({ article, reload }: { article: Article; reload: () => void }) {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const canViewDraft = canManageArticle(session?.user, "view");
  const canEdit = canManageArticle(session?.user, "edit");
  const canDelete = canManageArticle(session?.user, "delete");
  const published = article.state === "published";

  if (!published && !canViewDraft) {
    return <div className="p-6"><p role="alert">Article not found.</p><Link className="underline" to="/cms/posts">Back to articles</Link></div>;
  }
  if (editing && canEdit) {
    return (
      <>
        <Button variant="link" className="ml-6 mt-4 px-0" onClick={() => setEditing(false)}>Cancel editing</Button>
        <ArticleEditor article={article} onSaved={() => { toast({ title: "Article updated" }); setEditing(false); reload(); }} />
      </>
    );
  }

  async function changeState() {
    if (!canEdit || busy) return;
    setBusy(true);
    setError("");
    try {
      await authenticatedArticles.update(article.id, { state: published ? "draft" : "published" });
      if (published && !canViewDraft) await navigate({ to: "/cms/posts", replace: true });
      else reload();
    } catch (cause) {
      setError(articleErrorMessage(parseAxiosError(cause)));
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!canDelete || busy) return;
    setBusy(true);
    setError("");
    try {
      await authenticatedArticles.delete(article.id);
      await navigate({ to: "/cms/posts", replace: true });
    } catch (cause) {
      setError(articleErrorMessage(parseAxiosError(cause)));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5 p-6">
      <Head title={article.title} />
      <Button asChild variant="link" className="h-auto px-0"><Link to="/cms/posts">Back to articles</Link></Button>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{article.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{published ? "Published" : "Draft"}{article.username ? ` · ${article.username}` : ""}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {canEdit && <Button variant="outline" disabled={busy} onClick={() => setEditing(true)}>Edit</Button>}
          {canEdit && <Button variant="outline" disabled={busy} onClick={() => void changeState()}>{published ? "Unpublish" : "Publish"}</Button>}
          {canDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild><Button variant="destructive" disabled={busy}>Delete</Button></AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Delete this article?</AlertDialogTitle><AlertDialogDescription>The article will be removed permanently.</AlertDialogDescription></AlertDialogHeader>
                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => void remove()}>Delete article</AlertDialogAction></AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
      {busy && <p role="status">Updating article…</p>}
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
        {article.category && <span>Category: {article.category}</span>}
        {article.tags?.length > 0 && <span>Tags: {article.tags.join(", ")}</span>}
        <span>{article.count_likes} likes</span><span>{article.count_comments} comments</span>
      </div>
      {article.featureImage && <img src={article.featureImage} alt="" className="max-h-96 w-full max-w-3xl rounded-md object-cover" />}
      <div className="max-w-3xl space-y-3 rounded-md border bg-white p-5 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:font-semibold [&_ol]:list-decimal [&_ol]:pl-7 [&_ul]:list-disc [&_ul]:pl-7">
        <ArticleContent content={article.content} />
      </div>
    </div>
  );
}
