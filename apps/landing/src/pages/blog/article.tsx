import { useCallback } from "react";
import { getRouteApi, Link } from "@tanstack/react-router";
import { articleErrorMessage, publicArticles } from "@rexolute/api/articles";
import { ArticleContent } from "@rexolute/ui/article-content";
import { Skeleton } from "@rexolute/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { BlogByline } from "./byline";
import { blogImagePlaceholder } from "../../lib/blog";
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
      <p className="sr-only" role="status">{loading ? "Loading article…" : ""}</p>
      <article className="blog-article" aria-busy={loading}>
        {loading && <ArticleSkeleton />}
        {missing && <><h1>Article not found</h1><p>This article may have been removed.</p></>}
        {error && !missing && <><h1>Could not load article</h1><p role="alert">{articleErrorMessage(error)}</p><button type="button" className="landing-button" onClick={retry}>Try again</button></>}
        {post && <>
          <header className="blog-article-header">
            {post.category && <span className="blog-category blog-category-highlight">{post.category}</span>}
            <h1>{post.title}</h1>
            <BlogByline username={post.username} date={post.created_at} />
          </header>
          <img className="blog-article-image" src={post.featureImage || blogImagePlaceholder} alt="" width={1400} height={805} fetchPriority="high" />
          <div className="blog-prose"><ArticleContent key={post.id} content={post.content} /></div>
        </>}
      </article>
    </div>
  );
}

function ArticleSkeleton() {
  return (
    <>
      <h1 className="sr-only">Article</h1>
      <div className="blog-article-skeleton" aria-hidden="true">
        <div className="blog-article-header">
          <Skeleton className="h-7 w-32 rounded-full" />
          <div className="my-4 space-y-2">
            <Skeleton className="blog-skeleton-title w-full" />
            <Skeleton className="blog-skeleton-title w-3/4" />
          </div>
          <Skeleton className="h-5 w-48 max-w-full" />
        </div>
        <Skeleton className="blog-article-image" />
        <div className="mt-8 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </>
  );
}
