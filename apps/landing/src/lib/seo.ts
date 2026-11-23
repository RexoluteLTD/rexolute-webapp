import { appUrls } from "@rexolute/utils/app-urls";

export const siteOrigin = new URL(appUrls.landing).origin;
export const siteIndexable = import.meta.env.VITE_SITE_INDEXABLE === "true";
export const publicPaths = ["/", "/about-us", "/contact-us", "/privacy", "/policy", "/terms-condition"] as const;

const pages: Record<string, { title: string; description: string; noindex?: boolean }> = {
  "/": { title: "Online Therapy & Mental Wellness | Rexolute", description: "Find space to be heard with Rexolute. Explore online therapy, mental wellness support, and a thoughtful next step towards your wellbeing." },
  "/about-us": { title: "About Us | Therapy with a Human Approach | Rexolute", description: "Learn about Rexolute's purpose: making therapy more approachable through meaningful conversations, individual experiences, and support that fits everyday life." },
  "/contact-us": { title: "Contact Rexolute | Therapy & Platform Enquiries", description: "Contact the Rexolute team at hello@example.co with questions about getting started, the platform, partnerships, or therapist opportunities." },
  "/privacy": { title: "Privacy Information | Rexolute", description: "How the Rexolute public website handles contact enquiries and how its privacy information differs from authenticated therapy services.", noindex: true },
  "/policy": { title: "Cookie Policy | Rexolute", description: "Learn about cookies and browser storage on the Rexolute public website and separate signed-in services.", noindex: true },
  "/terms-condition": { title: "Terms and Conditions | Rexolute", description: "Information about using the Rexolute public website, enquiries, and the arrangements to clarify before starting a therapy service.", noindex: true },
};

export function pageMetadata(pathname: string) {
  const path = pathname.replace(/\/$/, "") || "/";
  const page = pages[path] ?? { title: "Page Not Found | Rexolute", description: "The page you requested could not be found. Explore Rexolute's therapy and mental wellness information.", noindex: true };
  const canonical = pages[path] ? new URL(path, siteOrigin).href : undefined;
  return {
    ...page,
    canonical,
    robots: siteIndexable && !page.noindex ? "index, follow" : "noindex, follow",
    image: new URL("/images/pic1.jpg", siteOrigin).href,
  };
}

export function structuredData() {
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "Organization", "@id": `${siteOrigin}/#organization`, name: "Rexolute", url: siteOrigin, logo: `${siteOrigin}/svg/logos/green.svg`, email: "hello@example.co" },
    { "@type": "WebSite", "@id": `${siteOrigin}/#website`, name: "Rexolute", url: siteOrigin, publisher: { "@id": `${siteOrigin}/#organization` }, inLanguage: "en" },
  ] };
}

export function metadataTags(pathname: string) {
  const meta = pageMetadata(pathname);
  return [
    { name: "description", content: meta.description },
    { name: "robots", content: meta.robots },
    { name: "theme-color", content: "#287703" },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Rexolute" },
    { property: "og:title", content: meta.title },
    { property: "og:description", content: meta.description },
    ...(meta.canonical ? [{ property: "og:url", content: meta.canonical }] : []),
    { property: "og:image", content: meta.image },
    { property: "og:image:alt", content: "People connecting with professionals through online appointments" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: meta.title },
    { name: "twitter:description", content: meta.description },
    { name: "twitter:image", content: meta.image },
  ];
}
