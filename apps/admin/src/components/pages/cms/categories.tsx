import { useEffect, useState, type FormEvent } from "react";
import { Search, Trash2 } from "lucide-react";
import Head from "@rexolute/ui/head";
import { Button } from "@rexolute/ui/button";
import { Input } from "@rexolute/ui/input";
import { Textarea } from "@rexolute/ui/textarea";
import { Label } from "@rexolute/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@rexolute/ui/table";
import { localCategories, slugify, type Category } from "./local-content";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      setCategories(localCategories.read());
    } catch {
      setError("Could not load categories from this browser.");
    }
  }, []);

  const persist = (change: (items: Category[]) => Category[]) => {
    try {
      setCategories(localCategories.update(change));
      setError("");
      return true;
    } catch {
      setError("Could not save categories in this browser.");
      return false;
    }
  };

  const clearForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setEditing(null);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    const value = { name: name.trim(), slug: slugify(slug.trim() || name), description: description.trim() };
    if (!value.slug) {
      setError("Enter a slug containing letters or numbers.");
      return;
    }
    const saved = persist((items) => editing
      ? items.map((category) => category.id === editing ? { ...category, ...value } : category)
      : [{ ...value, id: crypto.randomUUID(), count: 0 }, ...items]);
    if (saved) clearForm();
  };

  const remove = (id: string) => {
    if (persist((items) => items.filter((item) => item.id !== id)) && editing === id) clearForm();
  };

  const edit = (category: Category) => {
    setEditing(category.id); setName(category.name); setSlug(category.slug); setDescription(category.description);
  };

  const visible = categories.filter((category) => `${category.name} ${category.slug}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Head title="Categories" />
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-sm text-muted-foreground">Manage categories stored in this browser.</p>
        </div>

        {error && <p role="alert" className="mb-4 text-sm text-red-600">{error}</p>}
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <form onSubmit={submit} className="h-fit rounded-md border bg-white p-4">
            <h2 className="mb-4 font-semibold">{editing ? "Edit category" : "Add new category"}</h2>
            <div className="space-y-4">
              <div><Label htmlFor="category-name">Name</Label><Input id="category-name" value={name} onChange={(event) => setName(event.target.value)} className="mt-2" required /></div>
              <div><Label htmlFor="category-slug">Slug</Label><Input id="category-slug" value={slug} placeholder={slugify(name)} onChange={(event) => setSlug(event.target.value)} className="mt-2" /></div>
              <div><Label htmlFor="category-description">Description</Label><Textarea id="category-description" value={description} onChange={(event) => setDescription(event.target.value)} className="mt-2" /></div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-[#2E8902] text-white hover:bg-[#236b02]">{editing ? "Update category" : "Add category"}</Button>
                {editing && <Button type="button" variant="outline" onClick={clearForm}>Cancel</Button>}
              </div>
            </div>
          </form>

          <div>
            <div className="mb-4 flex justify-end">
              <div className="relative w-full max-w-xs"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search categories" className="pl-9" /></div>
            </div>
            <div className="rounded-md border bg-white">
              <Table>
                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Description</TableHead><TableHead>Slug</TableHead><TableHead>Count</TableHead><TableHead className="w-16" /></TableRow></TableHeader>
                <TableBody>
                  {visible.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell><button type="button" onClick={() => edit(category)} className="font-medium text-[#2E8902] hover:underline">{category.name}</button></TableCell>
                      <TableCell className="max-w-xs text-muted-foreground">{category.description || "-"}</TableCell>
                      <TableCell>{category.slug}</TableCell>
                      <TableCell>{category.count}</TableCell>
                      <TableCell><Button variant="ghost" size="icon" aria-label={`Delete ${category.name}`} onClick={() => remove(category.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button></TableCell>
                    </TableRow>
                  ))}
                  {visible.length === 0 && <TableRow><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No categories found.</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
