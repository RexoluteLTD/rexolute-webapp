import { publicArticles } from "@rexolute/api/articles";

export async function loadBlogFilters(signal: AbortSignal) {
  const categories = new Set<string>();
  const tags = new Set<string>();
  const limit = 100;
  let lastPage = 1;

  for (let page = 1; page <= lastPage; page++) {
    const result = await publicArticles.list({ page, limit, state: "published" }, signal);
    signal.throwIfAborted();
    if (!Number.isSafeInteger(result.total_count) || result.total_count < 0 ||
        !Number.isSafeInteger(result.limit) || result.limit < 1) {
      throw new Error("The article service returned invalid pagination.");
    }
    lastPage = Math.ceil(result.total_count / result.limit);
    for (const article of result.items) {
      if (article.state !== "published") continue;
      if (article.category) categories.add(article.category);
      for (const tag of article.tags ?? []) {
        if (tag) tags.add(tag);
      }
    }
  }

  const alphabetical = (first: string, second: string) => first.localeCompare(second);
  return { categories: [...categories].sort(alphabetical), tags: [...tags].sort(alphabetical) };
}
