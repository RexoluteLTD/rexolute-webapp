import { useEffect, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import Head from "@rexolute/ui/head";
import { Button } from "@rexolute/ui/button";
import { Input } from "@rexolute/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@rexolute/ui/table";

type CmsPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  status: "Draft" | "Published";
  author: string;
  date: string;
};

const POST_STORAGE_KEY = "rexolute-cms-posts";
const seedPosts: CmsPost[] = [
  { id: "1", title: "Welcome to Rexolute", slug: "welcome-to-rexolute", excerpt: "Introducing the Rexolute platform.", category: "News", status: "Published", author: "Admin", date: "2026-11-20T09:00:00Z" },
  { id: "2", title: "How online therapy works", slug: "how-online-therapy-works", excerpt: "A practical guide for clients.", category: "Resources", status: "Draft", author: "Admin", date: "2026-11-18T09:00:00Z" },
];

export default function PostsPage() {
  const [posts, setPosts] = useState<CmsPost[]>(seedPosts);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(POST_STORAGE_KEY) ?? "[]") as CmsPost[];
    if (saved.length) setPosts([...saved, ...seedPosts.filter((seed) => !saved.some((post) => post.slug === seed.slug))]);
  }, []);

  const visible = posts.filter((post) => `${post.title} ${post.category} ${post.author}`.toLowerCase().includes(search.toLowerCase()));
  const removePost = (id: string) => {
    const next = posts.filter((post) => post.id !== id);
    setPosts(next);
    localStorage.setItem(POST_STORAGE_KEY, JSON.stringify(next.filter((post) => !seedPosts.some((seed) => seed.id === post.id))));
  };

  return (
    <>
      <Head title="Posts" />
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Posts</h1>
            <p className="text-sm text-muted-foreground">Manage all published and draft articles.</p>
          </div>
          <Button asChild className="bg-[#2E8902] text-white hover:bg-[#236b02]"><Link to="/cms/new-post">Add new</Link></Button>
        </div>

        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">{visible.length} posts</p>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search posts" className="pl-9" />
          </div>
        </div>

        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div className="font-medium">{post.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">/{post.slug}</div>
                  </TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell><span className={`rounded-full px-2 py-1 text-xs ${post.status === "Published" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}>{post.status}</span></TableCell>
                  <TableCell>{new Date(post.date).toLocaleDateString()}</TableCell>
                  <TableCell><Button variant="ghost" size="icon" aria-label={`Delete ${post.title}`} onClick={() => removePost(post.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button></TableCell>
                </TableRow>
              ))}
              {visible.length === 0 && <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No posts found.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
