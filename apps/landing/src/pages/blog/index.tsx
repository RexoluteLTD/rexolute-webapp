import { useCallback, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { articleErrorMessage, publicArticles } from "@rexolute/api/articles";
import { Skeleton } from "@rexolute/ui/skeleton";
import { blogImagePlaceholder } from "../../lib/blog";
import { loadArticleCategories, loadArticleTags } from "../../lib/blog-filters";
import { BlogByline } from "./byline";
import { useBlogRequest } from "../../lib/use-blog-request";

export default function BlogIndexPage() {
  const [query, setQuery] = useState({ page: 1, category: "", tag: "" });
  const load = useCallback((signal: AbortSignal) => publicArticles.list({
    page: query.page, state: "published", category: query.category || undefined, tag: query.tag || undefined,
  }, signal), [query]);
  const { data, error, loading, retry } = useBlogRequest(load);
  const categories = useBlogRequest(loadArticleCategories);
  const tags = useBlogRequest(loadArticleTags);
  const articles = data?.items.filter((article) => article.state === "published") ?? [];
  const pageCount = data ? Math.max(1, Math.ceil(data.total_count / data.limit)) : 1;
  const categoryNames = new Map(categories.data?.map(({ slug, name }) => [slug, name]));
  const tagError = error?.errors?.tag?.join(" ");

  function filterTag(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    setQuery({ ...query, page: 1, tag: String(fields.get("tag") ?? "").trim() });
  }

  return (
    <div className="blog-page landing-container">
      <h1 className="blog-heading">Blog</h1>
      <section aria-labelledby="blog-library-title">
        <h2 id="blog-library-title" className="blog-library-heading">Mental Wellness Articles<br />Just for You.</h2>
        <form role="search" aria-label="Blog articles" className="blog-search" onSubmit={filterTag}>
          <label htmlFor="blog-tag" className="sr-only">Search articles by tag</label>
          <Search size={21} aria-hidden="true" />
          <input id="blog-tag" name="tag" type="search" list="blog-tag-options" placeholder="Search by tag" aria-invalid={!!tagError} aria-describedby={tagError ? "blog-tag-error" : undefined} />
          <button type="submit">Search</button>
          <datalist id="blog-tag-options">
            {tags.data?.map(({ id, name, slug }) => <option key={id} value={slug} label={name} />)}
          </datalist>
        </form>
        {tags.error && (
          <p className="blog-tag-error" role="alert">
            Could not load tag suggestions. <button type="button" className="underline" onClick={tags.retry}>Retry tags</button>
          </p>
        )}
        {tagError && <p className="blog-tag-error" id="blog-tag-error" role="alert">{tagError}</p>}
        <div className="blog-library-layout">
          <aside className="blog-filters" aria-labelledby="blog-categories">
            <h3 id="blog-categories">Categories</h3>
            <p className="sr-only" role="status">{categories.loading ? "Loading categories…" : ""}</p>
            <ul aria-busy={categories.loading}>
              <li>
                <button type="button" aria-pressed={!query.category} onClick={() => setQuery({ ...query, page: 1, category: "" })}>All</button>
              </li>
              {categories.loading && ["w-20", "w-28", "w-24"].map((width) => (
                <li key={width} className="flex min-h-11 items-center" aria-hidden="true"><Skeleton className={`h-4 ${width}`} /></li>
              ))}
              {categories.data?.map(({ id, slug, name }) => (
                <li key={id}>
                  <button type="button" aria-pressed={query.category === slug} onClick={() => setQuery({ ...query, page: 1, category: slug })}>{name}</button>
                </li>
              ))}
            </ul>
            {categories.error && (
              <div role="alert">
                <p>Could not load categories.</p>
                <button type="button" onClick={categories.retry}>Retry categories</button>
              </div>
            )}
          </aside>
          <div>
            <p className="sr-only" role="status">{loading ? "Loading articles…" : ""}</p>
            <div aria-busy={loading}>
              {loading && <BlogGridSkeleton />}
              {error && <div className="blog-empty" role="alert"><p>{articleErrorMessage(error)}</p><button type="button" className="landing-button" onClick={retry}>Try again</button></div>}
              {data && articles.length === 0 && <div className="blog-empty"><h3>No articles found</h3><p>Try another category or tag.</p></div>}
              {articles.length > 0 && (
                <ul className="blog-post-grid">
                  {articles.map((article) => (
                    <li key={article.id}>
                      <article className="blog-card">
                        <Link className="blog-card-link" to="/blog/$slug" params={{ slug: article.id }}>
                          <img className="blog-card-image" src={article.featureImage || blogImagePlaceholder} alt="" width={710} height={470} loading="lazy" />
                          <div className="blog-card-content">
                            {article.category && <p className="blog-post-meta"><span className="blog-category">{categoryNames.get(article.category) ?? article.category}</span></p>}
                            <h3>{article.title}</h3>
                            <BlogByline username={article.username} date={article.created_at} />
                          </div>
                        </Link>
                      </article>
                    </li>
                  ))}
                </ul>
              )}
              {data && (pageCount > 1 || query.page > 1) && (
                <nav className="blog-pagination" aria-label="Article pages">
                  <button className="landing-button" type="button" disabled={query.page <= 1} onClick={() => setQuery({ ...query, page: query.page - 1 })}>Previous</button>
                  <span>Page {data.current_page} of {pageCount}</span>
                  <button className="landing-button" type="button" disabled={query.page >= pageCount} onClick={() => setQuery({ ...query, page: query.page + 1 })}>Next</button>
                </nav>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function BlogGridSkeleton() {
  return (
    <ul className="blog-post-grid blog-grid-skeleton" aria-hidden="true">
      {[1, 2, 3, 4].map((item) => (
        <li key={item} className="blog-card">
          <div className="blog-card-link">
            <Skeleton className="blog-card-image" />
            <div className="blog-card-content space-y-3">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-40 max-w-full" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
