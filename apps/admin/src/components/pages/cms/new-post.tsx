import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Bold, Italic, List, ListOrdered, Quote, Redo2, Undo2 } from "lucide-react";
import { parseAxiosError } from "@rexolute/api";
import { articleErrorMessage, authenticatedArticles } from "@rexolute/api/articles";
import type { Article, ArticleInput } from "@rexolute/types";
import Head from "@rexolute/ui/head";
import { Button } from "@rexolute/ui/button";
import { Input } from "@rexolute/ui/input";
import { Label } from "@rexolute/ui/label";
import { useAuth } from "../../../hooks/use-auth";
import { toast } from "../../../hooks/use-toast";
import { articleFormSchema, canManageArticle, isArticleDocument, type ArticleFormFields } from "./article-form";
import { articleImageTypes, uploadArticleImage, validArticleImage } from "./upload-article-image";
import { PostCatalogFields } from "./post-catalog-fields";

export default function NewPostPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  if (!canManageArticle(session?.user, "create")) {
    return <p className="p-6" role="alert">You do not have permission to create articles.</p>;
  }

  return <ArticleEditor onSaved={async (article) => {
    toast({ title: "Draft saved" });
    if (canManageArticle(session?.user, "view")) {
      await navigate({ to: "/cms/posts/$id", params: { id: article.id }, replace: true });
    } else {
      await navigate({ to: "/cms/posts", replace: true });
    }
  }} />;
}

export function ArticleEditor({ article, onSaved }: { article?: Article; onSaved: (article: Article) => void | Promise<void> }) {
  const defaults: ArticleFormFields = {
    title: article?.title ?? "",
    category: article?.category ?? "",
    tags: article?.tags ?? [],
    featureImage: article?.featureImage ?? "",
  };
  const form = useForm<ArticleFormFields>({ resolver: zodResolver(articleFormSchema), defaultValues: defaults });
  const { errors, isSubmitting } = form.formState;
  const [file, setFile] = useState<File>();
  const [editorError, setEditorError] = useState("");
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: article?.content,
    enableContentCheck: true,
    onContentError: () => setEditorError("This article contains content the editor cannot open safely."),
    editorProps: { attributes: { role: "textbox", "aria-labelledby": "post-content-label", "aria-multiline": "true" } },
  });

  function chooseImage(selected: File) {
    form.clearErrors("featureImage");
    setFile(selected);
    if (!validArticleImage(selected)) {
      form.setError("featureImage", { message: "Choose a JPEG, PNG, WebP or AVIF image up to 10 MB." });
    }
  }

  async function save(fields: ArticleFormFields) {
    if (!editor || editorError) return;
    form.clearErrors("root");
    const content = editor.getJSON();
    if (editor.isEmpty || !editor.getText().trim() || !isArticleDocument(content)) {
      form.setError("root.content", { message: "Write some article content before saving." });
      editor.commands.focus();
      return;
    }

    let featureImage = fields.featureImage;
    if (file) {
      try {
        featureImage = await uploadArticleImage(file);
        form.setValue("featureImage", featureImage);
        setFile(undefined);
      } catch (error) {
        form.setError("featureImage", { message: error instanceof Error ? error.message : "Could not upload the featured image." });
        return;
      }
    }

    try {
      if (!article) {
        await onSaved(await authenticatedArticles.create({ title: fields.title, content, category: fields.category, tags: fields.tags, featureImage, state: "draft" }));
        return;
      }

      const patch: Partial<ArticleInput> = {};
      if (fields.title !== defaults.title) patch.title = fields.title;
      if (fields.category !== defaults.category) patch.category = fields.category;
      if (featureImage !== defaults.featureImage) patch.featureImage = featureImage;
      if (fields.tags.length !== defaults.tags.length || fields.tags.some((tag, index) => tag !== defaults.tags[index])) patch.tags = fields.tags;
      if (!editor.state.doc.eq(editor.schema.nodeFromJSON(article.content))) patch.content = content;
      if (!Object.keys(patch).length) {
        form.setError("root.server", { message: "Make a change before saving." });
        return;
      }
      await onSaved(await authenticatedArticles.update(article.id, patch));
    } catch (cause) {
      const error = parseAxiosError(cause);
      const invalidFields = Object.entries(error.errors ?? {});
      for (const [name, messages] of invalidFields) {
        if (name === "title" || name === "category" || name === "tags" || name === "featureImage") {
          form.setError(name, { message: messages.join(" ") });
        } else if (name.startsWith("tags.")) {
          form.setError("tags", { message: messages.join(" ") });
        } else if (name === "content") {
          form.setError("root.content", { message: messages.join(" ") });
        } else {
          form.setError("root.server", { message: messages.join(" ") });
        }
      }
      if (!invalidFields.length) form.setError("root.server", { message: articleErrorMessage(error) });
    }
  }

  const featureImage = form.watch("featureImage");
  return (
    <form className="p-6" noValidate onSubmit={form.handleSubmit(save)}>
      <Head title={article ? "Edit article" : "New article"} />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Button asChild variant="link" className="h-auto p-0"><Link to="/cms/posts">Back to articles</Link></Button>
          <h1 className="mt-2 text-2xl font-semibold">{article ? "Edit article" : "Add new article"}</h1>
        </div>
        <Button type="submit" disabled={!editor || !!editorError || isSubmitting} className="bg-[#2E8902] text-white hover:bg-[#236b02]">
          {isSubmitting ? "Saving…" : article ? "Save changes" : "Save draft"}
        </Button>
      </div>
      {errors.root?.server?.message && <p role="alert" className="mb-4 text-sm text-red-600">{errors.root.server.message}</p>}
      <fieldset className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]" disabled={isSubmitting}>
        <div className="min-w-0 space-y-4">
          <div>
            <Label htmlFor="post-title">Title</Label>
            <Input id="post-title" {...form.register("title")} aria-invalid={!!errors.title} aria-describedby={errors.title ? "post-title-error" : undefined} className="mt-2 h-12 text-lg" />
            <FieldError id="post-title-error" message={errors.title?.message} />
          </div>
          <div>
            <Label id="post-content-label">Content</Label>
            {editor && (
              <div className="mt-2 overflow-hidden rounded-md border bg-white">
                <div className="flex flex-wrap gap-1 border-b bg-gray-50 p-2">
                  <Button type="button" variant="ghost" size="icon" aria-label="Bold" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive("bold") ? "bg-gray-200" : ""}><Bold className="h-4 w-4" /></Button>
                  <Button type="button" variant="ghost" size="icon" aria-label="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive("italic") ? "bg-gray-200" : ""}><Italic className="h-4 w-4" /></Button>
                  <Button type="button" variant="ghost" size="icon" aria-label="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="h-4 w-4" /></Button>
                  <Button type="button" variant="ghost" size="icon" aria-label="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></Button>
                  <Button type="button" variant="ghost" size="icon" aria-label="Quote" onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="h-4 w-4" /></Button>
                  <Button type="button" variant="ghost" size="icon" aria-label="Undo" onClick={() => editor.chain().focus().undo().run()}><Undo2 className="h-4 w-4" /></Button>
                  <Button type="button" variant="ghost" size="icon" aria-label="Redo" onClick={() => editor.chain().focus().redo().run()}><Redo2 className="h-4 w-4" /></Button>
                </div>
                <EditorContent editor={editor} className="min-h-[420px] [&_.ProseMirror]:min-h-[420px] [&_.ProseMirror]:p-5 [&_.ProseMirror_p]:my-2 [&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-gray-300 [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6" />
              </div>
            )}
            <FieldError message={editorError || errors.root?.content?.message} />
          </div>
        </div>
        <aside className="space-y-4 rounded-md border bg-white p-4 self-start">
          <h2 className="font-semibold">Article settings</h2>
          <PostCatalogFields
            postType={article?.postType ?? "article"}
            category={form.watch("category")}
            tags={form.watch("tags")}
            onCategoryChange={(category) => form.setValue("category", category, { shouldValidate: true })}
            onTagsChange={(tags) => form.setValue("tags", tags, { shouldValidate: true })}
            categoryError={errors.category?.message}
            tagsError={errors.tags?.message ?? errors.tags?.find?.((tag) => tag?.message)?.message}
          />
          <div>
            <Label htmlFor="post-image">Featured image</Label>
            {featureImage && <img src={featureImage} alt="Current featured image" className="mt-2 h-auto w-full rounded-md" />}
            <Input id="post-image" type="file" accept={articleImageTypes.join(",")} aria-describedby={errors.featureImage ? "post-image-error" : undefined} aria-invalid={!!errors.featureImage} className="mt-2"
              onChange={(event) => {
                const selected = event.currentTarget.files?.[0];
                if (selected) chooseImage(selected);
                event.currentTarget.value = "";
              }}
            />
            {file && <p className="mt-2 break-all text-sm text-muted-foreground">Selected: {file.name}</p>}
            {(featureImage || file) && <Button type="button" variant="link" className="px-0 text-red-600" onClick={() => {
              setFile(undefined);
              form.setValue("featureImage", "");
              form.clearErrors("featureImage");
            }}>Remove image</Button>}
            <FieldError id="post-image-error" message={errors.featureImage?.message} />
          </div>
        </aside>
      </fieldset>
    </form>
  );
}

function FieldError({ id, message }: { id?: string; message?: string }) {
  return message ? <p id={id} role="alert" className="mt-1 text-sm text-red-600">{message}</p> : null;
}
