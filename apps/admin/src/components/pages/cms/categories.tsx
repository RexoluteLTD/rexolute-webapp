import { useCallback, useState } from "react";
import { Trash2 } from "lucide-react";
import { parseAxiosError } from "@rexolute/api";
import { postCatalogs } from "@rexolute/api/post-catalogs";
import type { PostCatalogEntry, PostCatalogResource, PostType } from "@rexolute/types";
import Head from "@rexolute/ui/head";
import { Button } from "@rexolute/ui/button";
import {
  AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@rexolute/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@rexolute/ui/table";
import { useAuth } from "../../../hooks/use-auth";
import { canManageArticle } from "./article-form";
import { CatalogForm, CatalogPostType } from "./catalog-form";
import { useCmsRequest } from "./use-cms-request";

export default function CategoriesPage() {
  return <CatalogPage resource="categories" />;
}

export function TagsPage() {
  return <CatalogPage resource="tags" />;
}

function CatalogPage({ resource }: { resource: PostCatalogResource }) {
  const [postType, setPostType] = useState<PostType>("article");
  const title = resource === "categories" ? "Categories" : "Tags";

  return (
    <div className="p-6">
      <Head title={title} />
      <h1 className="mb-5 text-2xl font-semibold">{title}</h1>
      <Catalog key={`${postType}/${resource}`} postType={postType} resource={resource} onPostTypeChange={setPostType} />
    </div>
  );
}

function Catalog({ postType, resource, onPostTypeChange }: {
  postType: PostType; resource: PostCatalogResource; onPostTypeChange: (postType: PostType) => void;
}) {
  const { session } = useAuth();
  const canCreate = canManageArticle(session?.user, "create");
  const canEdit = canManageArticle(session?.user, "edit");
  const canDelete = canManageArticle(session?.user, "delete");
  const itemLabel = resource === "categories" ? "category" : "tag";
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string>();
  const [deleteTarget, setDeleteTarget] = useState<PostCatalogEntry>();
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const load = useCallback((signal: AbortSignal) => postCatalogs.list(postType, resource, { page }, signal), [postType, resource, page]);
  const { data, error, loading, reload } = useCmsRequest(load);
  const lastPage = data ? Math.max(1, Math.ceil(data.total_count / data.limit)) : 1;
  const showActions = canEdit || canDelete;
  const closeForm = () => setEditingId(undefined);
  const saved = () => { closeForm(); reload(); };

  async function remove() {
    if (!deleteTarget || !canDelete || deleting) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await postCatalogs.delete(postType, resource, deleteTarget.id);
      if (editingId === deleteTarget.id) closeForm();
      setDeleteTarget(undefined);
      const remainingPages = data ? Math.max(1, Math.ceil((data.total_count - 1) / data.limit)) : page;
      if (page > remainingPages) setPage(remainingPages);
      else reload();
    } catch (cause) {
      setDeleteError(parseAxiosError(cause).message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        {editingId && canEdit ? (
          <EditCatalogEntry key={editingId} id={editingId} postType={postType} resource={resource}
            onPostTypeChange={onPostTypeChange} onCancel={closeForm} onSaved={saved} />
        ) : canCreate ? (
          <CatalogForm postType={postType} resource={resource} onPostTypeChange={onPostTypeChange} onSaved={saved} />
        ) : (
          <div className="h-fit rounded-md border bg-white p-4">
            <CatalogPostType postType={postType} onChange={onPostTypeChange} />
          </div>
        )}
        <div aria-busy={loading}>
          <div className="rounded-md border bg-white">
            <Table>
              <TableHeader>
                <TableRow><TableHead>Name</TableHead><TableHead>Slug</TableHead><TableHead>Description</TableHead>{showActions && <TableHead>Actions</TableHead>}</TableRow>
              </TableHeader>
              <TableBody>
                {(!data || data.items.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={showActions ? 4 : 3} className="py-8 text-center text-muted-foreground">
                      {loading && <p role="status">Loading {resource}…</p>}
                      {error && <div role="alert" className="space-y-2 text-sm text-red-600"><p>{error.message}</p><Button variant="outline" onClick={reload}>Try again</Button></div>}
                      {data && <p>No {resource} found.</p>}
                    </TableCell>
                  </TableRow>
                )}
                {data?.items.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.name}</TableCell>
                    <TableCell>{entry.slug}</TableCell>
                    <TableCell className="max-w-xs whitespace-normal break-words text-muted-foreground">{entry.description}</TableCell>
                    {showActions && <TableCell><div className="flex gap-2">
                      {canEdit && <Button type="button" variant="outline" size="sm" aria-label={`Edit ${entry.name}`} onClick={() => setEditingId(entry.id)}>Edit</Button>}
                      {canDelete && <Button type="button" variant="ghost" size="icon" aria-label={`Delete ${entry.name}`} onClick={() => { setDeleteError(""); setDeleteTarget(entry); }}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>}
                    </div></TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {data && (lastPage > 1 || page > 1) && (
            <nav className="mt-4 flex flex-wrap items-center gap-3" aria-label={`${resource} pages`}>
              <Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
              <span>Page {data.current_page} of {lastPage}</span>
              <Button variant="outline" disabled={page >= lastPage} onClick={() => setPage(page + 1)}>Next</Button>
            </nav>
          )}
        </div>
      </div>

      <AlertDialog open={!!deleteTarget && canDelete} onOpenChange={(open) => { if (!open && !deleting) setDeleteTarget(undefined); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>Posts that use this {itemLabel} will keep their saved value.</AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && <p role="alert" className="text-sm text-red-600">{deleteError}</p>}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <Button type="button" variant="destructive" onClick={() => void remove()} disabled={deleting}>
              {deleting ? "Deleting…" : `Delete ${itemLabel}`}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function EditCatalogEntry({ id, postType, resource, onPostTypeChange, onCancel, onSaved }: {
  id: string;
  postType: PostType;
  resource: PostCatalogResource;
  onPostTypeChange: (postType: PostType) => void;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const load = useCallback((signal: AbortSignal) => postCatalogs.get(postType, resource, id, signal), [postType, resource, id]);
  const { data, error, loading, reload } = useCmsRequest(load);
  if (data) return <CatalogForm postType={postType} resource={resource} entry={data} onPostTypeChange={onPostTypeChange} onCancel={onCancel} onSaved={onSaved} />;

  return (
    <div className="h-fit space-y-3 rounded-md border bg-white p-4">
      <CatalogPostType postType={postType} onChange={onPostTypeChange} />
      {loading && <p role="status">Loading entry…</p>}
      {error && <p role="alert" className="text-sm text-red-600">{error.message}</p>}
      {error && error.status !== 404 && <Button variant="outline" onClick={reload}>Try again</Button>}
      <Button variant="ghost" onClick={onCancel}>Cancel</Button>
    </div>
  );
}
