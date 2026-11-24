import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Search } from "lucide-react";
import { allBlogPosts, blogCategories, blogPosts, featuredBlogImage, featuredBlogPost, type BlogCategory } from "../../lib/blog";
import { BlogByline } from "./byline";

const categories = ["All", ...blogCategories] as const;

export default function BlogIndexPage() {
  const [category, setCategory] = useState<BlogCategory | "All">("All");
  const [query, setQuery] = useState("");
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const matchingPosts = category === "All" && terms.length === 0 ? blogPosts : allBlogPosts.filter((post) => {
    const topics = [post.category, post.relatedCategory];
    if (category !== "All" && !topics.includes(category)) return false;

    const searchText = [post.title, post.excerpt, post.author.name, ...topics].join(" ").toLowerCase();
    return terms.every((term) => searchText.includes(term));
  });

  return (
    <div className="blog-page landing-container">
      <h1 className="blog-heading">Blog</h1>
      <section className="blog-feature" aria-labelledby="featured-post-title">
        <img className="blog-feature-image" {...featuredBlogImage} fetchPriority="high" />
        <div className="blog-feature-card">
          <p className="blog-post-meta">
            <span className="blog-category blog-category-highlight">{featuredBlogPost.category}</span>
            <span>{featuredBlogPost.readingMinutes} min read</span>
          </p>
          <h2 id="featured-post-title">{featuredBlogPost.title}</h2>
          <p className="blog-feature-excerpt">{featuredBlogPost.excerpt}</p>
          <BlogByline author={featuredBlogPost.author} publishedAt={featuredBlogPost.publishedAt} />
          <Link className="blog-read-more" to="/blog/$slug" params={{ slug: featuredBlogPost.slug }} aria-label={`Read more about ${featuredBlogPost.title}`}>
            Read more <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="blog-library" aria-labelledby="blog-library-title">
        <h2 id="blog-library-title" className="blog-library-heading">Mental Wellness Articles<br />Just for You.</h2>
        <div role="search" aria-label="Blog articles" className="blog-search">
          <label htmlFor="blog-search" className="sr-only">Search articles by keyword or topic</label>
          <Search size={21} aria-hidden="true" />
          <input id="blog-search" type="search" placeholder="Search by keyword or topic" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>

        <div className="blog-library-layout">
          <aside className="blog-filters" aria-labelledby="blog-categories">
            <h3 id="blog-categories">Categories</h3>
            <ul>
              {categories.map((item) => (
                <li key={item}>
                  <button type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>
                </li>
              ))}
            </ul>
          </aside>

          <div>
            <p role="status" className="sr-only">{matchingPosts.length} {matchingPosts.length === 1 ? "article" : "articles"} found</p>
            {matchingPosts.length > 0 ? (
              <ul className="blog-post-grid">
                {matchingPosts.map((post) => (
                  <li key={post.slug}>
                    <article className="blog-card">
                      <Link className="blog-card-link" to="/blog/$slug" params={{ slug: post.slug }}>
                        <img className="blog-card-image" src={post.image.src} alt="" width={post.image.width} height={post.image.height} loading="lazy" />
                        <div className="blog-card-content">
                          <p className="blog-post-meta">
                            <span className="blog-category">{post.category}</span>
                            <span>{post.readingMinutes} min read</span>
                          </p>
                          <h3>{post.title}</h3>
                          <BlogByline author={post.author} publishedAt={post.publishedAt} />
                        </div>
                      </Link>
                    </article>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="blog-empty">
                <h3>No articles found</h3>
                <p>Try another keyword or category.</p>
                <button type="button" className="landing-button" onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
