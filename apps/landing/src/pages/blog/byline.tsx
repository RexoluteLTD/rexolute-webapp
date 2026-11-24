import { formatBlogDate } from "../../lib/blog";

export function BlogByline({ username, date }: { username: string; date: string }) {
  return (
    <div className="blog-byline">
      {username && <span>{username}</span>}
      <time dateTime={date}>{formatBlogDate(date)}</time>
    </div>
  );
}
