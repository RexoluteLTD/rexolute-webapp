import { useCallback, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { articleErrorMessage, publicArticles } from "@rexolute/api/articles";
import { BlogByline } from "./byline";
import { useBlogRequest } from "../../lib/use-blog-request";

export default function BlogIndexPage() {
  const [query, setQuery] = useState({ page: 1, category: "", tag: "" });
  const load = useCallback((signal: AbortSignal) => publicArticles.list({
    page: query.page, state: "published", category: query.category || undefined, tag: query.tag || undefined,
  }, signal), [query]);
  const { data, error, loading, retry } = useBlogRequest(load);
  const articles = data?.items.filter((article) => article.state === "published") ?? [];
  const categoryError = error?.errors?.category?.join(" ");
  const tagError = error?.errors?.tag?.join(" ");
  const pageCount = data ? Math.max(1, Math.ceil(data.total_count / data.limit)) : 1;

  function filter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    setQuery({ page: 1, category: String(fields.get("category") ?? "").trim(), tag: String(fields.get("tag") ?? "").trim() });
  }

  return (
    <div className="blog-page landing-container">
      <h1 className="blog-heading">Blog</h1>
      <section aria-labelledby="blog-library-title">
        <h2 id="blog-library-title" className="blog-library-heading">Mental Wellness Articles<br />Just for You.</h2>
        <div className="blog-library-layout blog-api-library">
          <form onSubmit={filter} className="blog-filters">
            <h3>Filter articles</h3>
            <label htmlFor="blog-category">Category</label>
            <input id="blog-category" name="category" aria-invalid={!!categoryError} aria-describedby={categoryError ? "blog-category-error" : undefined} />
            {categoryError && <p id="blog-category-error" role="alert">{categoryError}</p>}
            <label htmlFor="blog-tag">Tag</label>
            <input id="blog-tag" name="tag" aria-invalid={!!tagError} aria-describedby={tagError ? "blog-tag-error" : undefined} />
            {tagError && <p id="blog-tag-error" role="alert">{tagError}</p>}
            <button className="landing-button" type="submit">Apply filters</button>
          </form>
          <div aria-busy={loading}>
            {loading && <p role="status">Loading articles…</p>}
            {error && <div className="blog-empty" role="alert"><p>{articleErrorMessage(error)}</p><button type="button" className="landing-button" onClick={retry}>Try again</button></div>}
            {data && articles.length === 0 && <div className="blog-empty"><h3>No articles found</h3><p>Try another category or tag.</p></div>}
            {articles.length > 0 && (
              <ul className="blog-post-grid">
                {articles.map((article) => (
                  <li key={article.id}>
                    <article className="blog-card">
                      <Link className="blog-card-link" to="/blog/$slug" params={{ slug: article.id }}>
                        {article.featureImage && <img className="blog-card-image" src={article.featureImage} alt="" width={710} height={470} loading="lazy" />}
                        <div className="blog-card-content">
                          {article.category && <p className="blog-post-meta"><span className="blog-category">{article.category}</span></p>}
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
      </section>
    </div>
  );
}
