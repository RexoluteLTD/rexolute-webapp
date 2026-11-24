import { useCallback } from "react";
import { getRouteApi, Link } from "@tanstack/react-router";
import { articleErrorMessage, publicArticles } from "@rexolute/api/articles";
import { ArticleContent } from "@rexolute/ui/article-content";
import { ArrowLeft } from "lucide-react";
import { BlogByline } from "./byline";
import { useBlogRequest } from "../../lib/use-blog-request";
import { Seo } from "../../components/seo";

const articleRoute = getRouteApi("/blog/$slug");

export default function BlogArticlePage() {
  const { slug } = articleRoute.useParams();
  const load = useCallback((signal: AbortSignal) => publicArticles.get(slug, signal), [slug]);
  const { data, error, loading, retry } = useBlogRequest(load);
  const post = data?.state === "published" ? data : undefined;
  const missing = error?.status === 404 || (data && !post);

  return (
    <div className="blog-page landing-container">
      <Seo pathname={`/blog/${slug}`} article={post} />
      <div className="blog-article-navigation">
        <Link to="/blog" activeOptions={{ exact: true }} className="blog-back" aria-label="Back to blog"><ArrowLeft size={24} aria-hidden="true" /></Link>
        <p className="blog-heading">Blog</p>
      </div>
      <article className="blog-article" aria-busy={loading}>
        {loading && <><h1>Article</h1><p role="status">Loading article…</p></>}
        {missing && <><h1>Article not found</h1><p>This article may have been removed.</p></>}
        {error && !missing && <><h1>Could not load article</h1><p role="alert">{articleErrorMessage(error)}</p><button type="button" className="landing-button" onClick={retry}>Try again</button></>}
        {post && <>
          <header className="blog-article-header">
            {post.category && <span className="blog-category blog-category-highlight">{post.category}</span>}
            <h1>{post.title}</h1>
            <BlogByline username={post.username} date={post.created_at} />
          </header>
          {post.featureImage && <img className="blog-article-image" src={post.featureImage} alt="" width={1400} height={805} fetchPriority="high" />}
          <div className="blog-prose"><ArticleContent key={post.id} content={post.content} /></div>
        </>}
      </article>
    </div>
  );
}
