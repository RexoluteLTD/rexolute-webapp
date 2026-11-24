import { formatBlogDate } from "../../lib/blog";

export function BlogByline({ author, publishedAt }: {
  author: { name: string; avatar: string };
  publishedAt: string;
}) {
  return (
    <div className="blog-byline">
      <img src={author.avatar} alt="" width={36} height={36} loading="lazy" />
      <span>{author.name}</span>
      <time dateTime={publishedAt}>{formatBlogDate(publishedAt)}</time>
    </div>
  );
}
