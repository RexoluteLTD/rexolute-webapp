import { useRef } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { parseAxiosError } from "@rexolute/api";
import { postCatalogs } from "@rexolute/api/post-catalogs";
import type { PostCatalogEntry, PostCatalogInput, PostCatalogResource, PostType } from "@rexolute/types";
import { Button } from "@rexolute/ui/button";
import { Input } from "@rexolute/ui/input";
import { Label } from "@rexolute/ui/label";
import { Textarea } from "@rexolute/ui/textarea";
import { utf8Length } from "./article-form";

const fields = ["name", "slug", "description"] as const;
const slugLimit = (resource: PostCatalogResource) => resource === "categories" ? 80 : 64;

function slugFromName(name: string, maxLength: number) {
  return name.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-/, "")
    .slice(0, maxLength).replace(/-$/, "");
}

const requiredText = (label: string, max: number) => z.string().trim()
  .min(1, `Enter a ${label}.`)
  .refine((value) => utf8Length(value) <= max, `Use at most ${max} UTF-8 bytes.`);

export function catalogSchema(resource: PostCatalogResource) {
  return z.object({
    name: requiredText("name", 100),
    slug: requiredText("slug", slugLimit(resource))
      .refine((value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), "Use lowercase letters and digits separated by single hyphens."),
    description: requiredText("description", 2000),
  });
}

interface CatalogFormProps {
  postType: PostType;
  resource: PostCatalogResource;
  entry?: PostCatalogEntry;
  onPostTypeChange: (postType: PostType) => void;
  onCancel?: () => void;
  onSaved: () => void;
}

export function CatalogForm({ postType, resource, entry, onPostTypeChange, onCancel, onSaved }: CatalogFormProps) {
  const defaults = { name: entry?.name ?? "", slug: entry?.slug ?? "", description: entry?.description ?? "" };
  const form = useForm<PostCatalogInput>({ resolver: zodResolver(catalogSchema(resource)), defaultValues: defaults });
  const { errors, isSubmitting, isSubmitted } = form.formState;
  const slugEdited = useRef(false);
  const item = resource === "categories" ? "category" : "tag";

  async function save(values: PostCatalogInput) {
    form.clearErrors("root");
    try {
      if (!entry) {
        await postCatalogs.create(postType, resource, values);
        form.reset();
        slugEdited.current = false;
      } else {
        const changed: Partial<PostCatalogInput> = {};
        for (const field of fields) {
          if (values[field] !== defaults[field]) changed[field] = values[field];
        }
        if (!Object.keys(changed).length) {
          form.setError("root.server", { message: "Make a change before saving." });
          return;
        }
        await postCatalogs.update(postType, resource, entry.id, changed);
      }
      onSaved();
    } catch (cause) {
      const error = parseAxiosError(cause);
      if (error.status === 409) {
        form.setError("slug", { message: "This slug is already in use in this catalog." }, { shouldFocus: true });
        return;
      }
      let hasFieldError = false;
      for (const field of fields) {
        const messages = error.errors?.[field];
        if (!messages?.length) continue;
        form.setError(field, { message: messages.join(" ") });
        hasFieldError = true;
      }
      if (!hasFieldError) form.setError("root.server", { message: error.message });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(save)} noValidate className="h-fit rounded-md border bg-white p-4">
      <h2 className="mb-4 font-semibold">{entry ? `Edit ${item}` : `New ${item}`}</h2>
      {errors.root?.server?.message && <p role="alert" className="mb-3 text-sm text-red-600">{errors.root.server.message}</p>}
      <fieldset className="space-y-4" disabled={isSubmitting}>
        <CatalogPostType postType={postType} onChange={onPostTypeChange} />
        {fields.map((field) => {
          const Control = field === "description" ? Textarea : Input;
          const id = `catalog-${field}`;
          const message = errors[field]?.message;
          return (
            <div key={field}>
              <Label htmlFor={id} className="capitalize">{field}</Label>
              <Control id={id} {...form.register(field, {
                onChange: (event) => {
                  if (field === "slug") slugEdited.current = true;
                  if (field === "name" && !entry && !slugEdited.current) {
                    form.setValue("slug", slugFromName(event.target.value, slugLimit(resource)), { shouldValidate: isSubmitted });
                  }
                },
              })} className="mt-2" required
                aria-invalid={!!message} aria-describedby={message ? `${id}-error` : undefined} />
              {message && <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-red-600">{message}</p>}
            </div>
          );
        })}
        <div className="flex flex-wrap gap-2">
          <Button type="submit" className="bg-[#2E8902] text-white hover:bg-[#236b02]">{isSubmitting ? "Saving…" : "Save"}</Button>
          {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
        </div>
      </fieldset>
    </form>
  );
}

export function CatalogPostType({ postType, onChange }: { postType: PostType; onChange: (postType: PostType) => void }) {
  return (
    <div className="space-y-1">
      <Label htmlFor="catalog-post-type">Post type</Label>
      <select id="catalog-post-type" className="block h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        value={postType} onChange={(event) => onChange(event.target.value === "community" ? "community" : "article")}>
        <option value="article">Articles</option>
        <option value="community">Community</option>
      </select>
    </div>
  );
}
