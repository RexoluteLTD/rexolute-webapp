import { appUrls } from "@rexolute/utils/app-urls";
import type { Article } from "@rexolute/types";
import { articleIdPattern, articleText } from "./blog";

export const siteOrigin = new URL(appUrls.landing).origin;
export const siteIndexable = import.meta.env.VITE_SITE_INDEXABLE === "true";
export const publicPaths = [
  "/", "/about-us", "/contact-us", "/privacy", "/policy", "/terms-condition", "/blog",
];

const pages: Record<string, { title: string; description: string; noindex?: boolean }> = {
  "/": { title: "Online Therapy & Mental Health Support for Africans | Rexolute", description: "Rexolute offers online therapy for individuals, workplace wellbeing programmes and free mental wellness articles for Africans at home and abroad." },
  "/about-us": { title: "About Us | Mental Health Support for Africans | Rexolute", description: "Learn how Rexolute makes mental health support more affordable, accessible and available through individual therapy, workplace wellbeing and free resources." },
  "/contact-us": { title: "Contact Rexolute | Therapy & Platform Enquiries", description: "Contact the Rexolute team at hello@example.co with questions about getting started, the platform, partnerships, or therapist opportunities." },
  "/blog": { title: "Mental Wellness Blog | Rexolute", description: "Browse articles on relationships, coping strategies, parenting, work-life balance and everyday mental wellness." },
  "/privacy": { title: "Privacy Information | Rexolute", description: "How the Rexolute public website handles contact enquiries and how its privacy information differs from authenticated therapy services.", noindex: true },
  "/policy": { title: "Cookie Policy | Rexolute", description: "Learn about cookies and browser storage on the Rexolute public website and separate signed-in services.", noindex: true },
  "/terms-condition": { title: "Terms and Conditions | Rexolute", description: "Information about using the Rexolute public website, enquiries, and the arrangements to clarify before starting a therapy service.", noindex: true },
};

export function pageMetadata(pathname: string, article?: Article) {
  const path = pathname.replace(/\/$/, "") || "/";
  const post = article?.state === "published" && path === `/blog/${article.id}` ? article : undefined;
  const page = post ? { title: `${post.title} | Rexolute`, description: articleText(post.content).replace(/\s+/g, " ").slice(0, 160).trim() || post.title, noindex: false }
    : pages[path] ?? (path.startsWith("/blog/") && articleIdPattern.test(path.slice("/blog/".length))
      ? { title: "Blog Article | Rexolute", description: "Read articles on the Rexolute mental wellness blog.", noindex: true }
      : { title: "Page Not Found | Rexolute", description: "The page you requested could not be found. Explore Rexolute's therapy and mental wellness information.", noindex: true });
  const canonical = pages[path] || post ? new URL(path, siteOrigin).href : undefined;
  return {
    ...page,
    canonical,
    robots: siteIndexable && !page.noindex ? "index, follow" : "noindex, follow",
    image: new URL(post?.featureImage || "/images/pic1.jpg", siteOrigin).href,
    imageAlt: post?.featureImage ? "" : "People connecting with professionals through online appointments",
    type: post ? "article" : "website",
  };
}

export function structuredData() {
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "Organization", "@id": `${siteOrigin}/#organization`, name: "Rexolute", url: siteOrigin, logo: `${siteOrigin}/svg/logos/green.svg`, email: "hello@example.co" },
    { "@type": "WebSite", "@id": `${siteOrigin}/#website`, name: "Rexolute", url: siteOrigin, publisher: { "@id": `${siteOrigin}/#organization` }, inLanguage: "en" },
  ] };
}

export function metadataTags(pathname: string, article?: Article) {
  const meta = pageMetadata(pathname, article);
  return [
    { name: "description", content: meta.description },
    { name: "robots", content: meta.robots },
    { name: "theme-color", content: "#287703" },
    { property: "og:type", content: meta.type },
    { property: "og:site_name", content: "Rexolute" },
    { property: "og:title", content: meta.title },
    { property: "og:description", content: meta.description },
    ...(meta.canonical ? [{ property: "og:url", content: meta.canonical }] : []),
    { property: "og:image", content: meta.image },
    { property: "og:image:alt", content: meta.imageAlt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: meta.title },
    { name: "twitter:description", content: meta.description },
    { name: "twitter:image", content: meta.image },
  ];
}
