import { useEffect } from "react";
import { metadataTags, pageMetadata, structuredData } from "../lib/seo";

export function Seo({ pathname }: { pathname: string }) {
  useEffect(() => {
    const meta = pageMetadata(pathname);
    document.title = meta.title;
    document.head.querySelectorAll('[data-landing-seo]').forEach((element) => element.remove());
    for (const attributes of metadataTags(pathname)) {
      const element = document.createElement("meta");
      element.setAttribute("data-landing-seo", "");
      for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
      document.head.append(element);
    }
    if (meta.canonical) {
      const link = document.createElement("link");
      link.rel = "canonical"; link.href = meta.canonical;
      link.setAttribute("data-landing-seo", "");
      document.head.append(link);
    }
    const data = document.createElement("script");
    data.type = "application/ld+json";
    data.setAttribute("data-landing-seo", "");
    data.textContent = JSON.stringify(structuredData());
    document.head.append(data);
  }, [pathname]);
  return null;
}
