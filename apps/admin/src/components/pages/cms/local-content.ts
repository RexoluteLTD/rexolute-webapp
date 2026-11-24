export type CmsPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  status: "Draft" | "Published";
  author: string;
  date: string;
  content?: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  count: number;
};

const seedPosts: CmsPost[] = [
  { id: "1", title: "Welcome to Rexolute", slug: "welcome-to-rexolute", excerpt: "Introducing the Rexolute platform.", category: "News", status: "Published", author: "Admin", date: "2026-11-20T09:00:00Z" },
  { id: "2", title: "How online therapy works", slug: "how-online-therapy-works", excerpt: "A practical guide for clients.", category: "Resources", status: "Draft", author: "Admin", date: "2026-11-18T09:00:00Z" },
];

const seedCategories: Category[] = [
  { id: "1", name: "News", slug: "news", description: "Platform announcements and updates", count: 8 },
  { id: "2", name: "Resources", slug: "resources", description: "Guides and educational content", count: 12 },
  { id: "3", name: "Therapy", slug: "therapy", description: "Therapy and wellbeing articles", count: 6 },
];

function localCollection<T extends { slug: string }>(key: string, seeds: T[]) {
  function read(): T[] {
    const stored = localStorage.getItem(key);
    if (stored === null) return seeds;

    const data = JSON.parse(stored);
    if (Array.isArray(data)) {
      // Earlier versions stored only custom entries and added seeds on every read.
      const custom = data as T[];
      return [...custom, ...seeds.filter((seed) => !custom.some((item) => item.slug === seed.slug))];
    }
    if (data?.version === 1 && Array.isArray(data.items)) return data.items;
    throw new Error("Unrecognized CMS storage format.");
  }

  function update(change: (items: T[]) => T[]) {
    const items = change(read());
    localStorage.setItem(key, JSON.stringify({ version: 1, items }));
    return items;
  }

  return { read, update };
}

export const localPosts = localCollection("rexolute-cms-posts", seedPosts);
export const localCategories = localCollection("rexolute-cms-categories", seedCategories);

export function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
