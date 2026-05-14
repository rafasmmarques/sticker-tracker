import { useEffect } from "react";
import { SEO } from "../constants/seo";

type PageSeo = {
  title?: string;
  description?: string;
  canonicalPath?: string;
  robots?: string;
  image?: string;
};

const SITE_URL = "https://minhacolecao.app.br";

function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

function upsertMeta(
  selector: string,
  attribute: "name" | "property",
  value: string,
  content: string
) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]'
  );

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
}

export function usePageSeo({
  title = SEO.defaultTitle,
  description = SEO.defaultDescription,
  canonicalPath = "/",
  robots = "index, follow",
  image = SEO.ogImage,
}: PageSeo) {
  useEffect(() => {
    const canonicalUrl = absoluteUrl(canonicalPath);

    document.title = title;
    upsertCanonical(canonicalUrl);
    upsertMeta('meta[name="description"]', "name", "description", description);
    upsertMeta('meta[name="robots"]', "name", "robots", robots);
    upsertMeta('meta[property="og:title"]', "property", "og:title", title);
    upsertMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      description
    );
    upsertMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    upsertMeta('meta[property="og:image"]', "property", "og:image", image);
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    upsertMeta(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      description
    );
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", image);
  }, [canonicalPath, description, image, robots, title]);
}
