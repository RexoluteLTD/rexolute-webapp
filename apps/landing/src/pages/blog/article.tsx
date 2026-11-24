import { getRouteApi, Link } from "@tanstack/react-router";
import StarterKit from "@tiptap/starter-kit";
import { renderToReactElement } from "@tiptap/static-renderer/pm/react";
import { ArrowLeft } from "lucide-react";
import { BlogByline } from "./byline";

const articleRoute = getRouteApi("/blog/$slug");
const extensions = [StarterKit.configure({ heading: { levels: [2, 3, 4, 5, 6] } })];

export default function BlogArticlePage() {
  const post = articleRoute.useRouteContext({ select: ({ post }) => post });

  return (
    <div className="blog-page landing-container">
      <div className="blog-article-navigation">
        <Link to="/blog" activeOptions={{ exact: true }} className="blog-back" aria-label="Back to blog"><ArrowLeft size={24} aria-hidden="true" /></Link>
        <p className="blog-heading">Blog</p>
      </div>
      <article className="blog-article">
        <header className="blog-article-header">
          <span className="blog-category blog-category-highlight">{post.category}</span>
          <h1>{post.title}</h1>
          <BlogByline author={post.author} publishedAt={post.publishedAt} />
        </header>
        <img className="blog-article-image" src={post.image.src} alt={post.image.alt} width={post.image.width} height={post.image.height} fetchPriority="high" />
        <div className="blog-prose">
          {renderToReactElement({ extensions, content: post.content })}
        </div>
      </article>
    </div>
  );
}
