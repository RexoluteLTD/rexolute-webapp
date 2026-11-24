import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Quote, Redo2, Undo2 } from "lucide-react";
import Head from "@rexolute/ui/head";
import { Button } from "@rexolute/ui/button";
import { Input } from "@rexolute/ui/input";
import { Textarea } from "@rexolute/ui/textarea";
import { Label } from "@rexolute/ui/label";
import { localPosts, slugify, type CmsPost } from "./local-content";

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("News");
  const [savedId, setSavedId] = useState<string>();
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
  });

  const savePost = () => {
    if (!editor) return;
    setNotice("");
    setError("");
    if (!title.trim()) {
      setError("Add a post title before saving.");
      return;
    }
    const postSlug = slugify(slug.trim() || title);
    if (!postSlug) {
      setError("Enter a slug containing letters or numbers.");
      return;
    }
    try {
      const post: CmsPost = {
        id: savedId ?? crypto.randomUUID(),
        title: title.trim(),
        slug: postSlug,
        excerpt: excerpt.trim(),
        category,
        status: "Draft",
        author: "Admin",
        date: new Date().toISOString(),
        content: editor.getHTML(),
      };
      localPosts.update((posts) => [post, ...posts.filter((item) => item.id !== post.id)]);
      setSavedId(post.id);
      setNotice("Draft saved in this browser.");
    } catch {
      setError("Could not save the draft in this browser.");
    }
  };

  if (!editor) return null;

  return (
    <>
      <Head title="New post" />
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Add new post</h1>
            <p className="text-sm text-muted-foreground">Write a draft and save it in this browser.</p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-[#2E8902] text-white hover:bg-[#236b02]" onClick={savePost}>Save local draft</Button>
          </div>
        </div>

        {notice && <p role="status" className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{notice}</p>}
        {error && <p role="alert" className="mb-4 text-sm text-red-600">{error}</p>}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <div>
              <Label htmlFor="post-title">Title</Label>
              <Input
                id="post-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter post title"
                className="mt-2 h-12 text-lg"
              />
            </div>

            <div className="overflow-hidden rounded-md border bg-white">
              <div className="flex flex-wrap gap-1 border-b bg-gray-50 p-2">
                <Button type="button" variant="ghost" size="icon" aria-label="Bold" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive("bold") ? "bg-gray-200" : ""}><Bold className="h-4 w-4" /></Button>
                <Button type="button" variant="ghost" size="icon" aria-label="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive("italic") ? "bg-gray-200" : ""}><Italic className="h-4 w-4" /></Button>
                <Button type="button" variant="ghost" size="icon" aria-label="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="h-4 w-4" /></Button>
                <Button type="button" variant="ghost" size="icon" aria-label="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></Button>
                <Button type="button" variant="ghost" size="icon" aria-label="Quote" onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="h-4 w-4" /></Button>
                <Button type="button" variant="ghost" size="icon" aria-label="Undo" onClick={() => editor.chain().focus().undo().run()}><Undo2 className="h-4 w-4" /></Button>
                <Button type="button" variant="ghost" size="icon" aria-label="Redo" onClick={() => editor.chain().focus().redo().run()}><Redo2 className="h-4 w-4" /></Button>
              </div>
              <EditorContent editor={editor} className="min-h-[420px] [&_.ProseMirror]:min-h-[420px] [&_.ProseMirror]:p-5 [&_.ProseMirror]:outline-none [&_.ProseMirror_p]:my-2 [&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-gray-300 [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6" />
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-md border bg-white p-4">
              <h2 className="mb-4 font-semibold">Post settings</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="post-slug">Slug</Label>
                  <Input id="post-slug" value={slug} placeholder={slugify(title)} onChange={(event) => setSlug(event.target.value)} className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="post-category">Category</Label>
                  <Input id="post-category" value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="post-excerpt">Excerpt</Label>
                  <Textarea id="post-excerpt" value={excerpt} onChange={(event) => setExcerpt(event.target.value)} className="mt-2 min-h-28" placeholder="Short summary..." />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
