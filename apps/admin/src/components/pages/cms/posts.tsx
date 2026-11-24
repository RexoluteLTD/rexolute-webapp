import { useEffect, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import Head from "@rexolute/ui/head";
import { Button } from "@rexolute/ui/button";
import { Input } from "@rexolute/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@rexolute/ui/table";
import { localPosts, type CmsPost } from "./local-content";

export default function PostsPage() {
  const [posts, setPosts] = useState<CmsPost[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      setPosts(localPosts.read());
    } catch {
      setError("Could not load posts from this browser.");
    }
  }, []);

  const visible = posts.filter((post) => `${post.title} ${post.category} ${post.author}`.toLowerCase().includes(search.toLowerCase()));
  const removePost = (id: string) => {
    try {
      setPosts(localPosts.update((items) => items.filter((post) => post.id !== id)));
      setError("");
    } catch {
      setError("Could not delete the post from this browser.");
    }
  };

  return (
    <>
      <Head title="Posts" />
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Posts</h1>
            <p className="text-sm text-muted-foreground">Manage posts stored in this browser.</p>
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

        {error && <p role="alert" className="mb-4 text-sm text-red-600">{error}</p>}
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
                  <TableCell><span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">{post.status === "Published" ? "Local copy" : "Draft"}</span></TableCell>
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
