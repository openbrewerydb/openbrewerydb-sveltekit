export type RobotsConfig = {
  index?: boolean;
  follow?: boolean;
};

export type OpenGraphConfig = {
  type?: 'website' | 'article' | string;
  siteName?: string;
  url?: string;
  image?: string;
};

export type SEOConfig = {
  title?: string;
  titleTemplate?: string;
  description?: string;
  canonical?: string;
  robots?: RobotsConfig;
  openGraph?: OpenGraphConfig;
};

export const SEO_CTX: unique symbol = Symbol('seo');

export function applyTitleTemplate(
  title: string | undefined,
  template?: string
): string | undefined {
  if (!title) return title;
  if (!template) return title;
  return template.replace(/%s/g, title);
}

export function canonicalFrom(input: URL): string {
  return `${input.origin}${input.pathname}`;
}

export function absoluteFrom(
  input: string | undefined,
  base?: URL
): string | undefined {
  if (!input) return undefined;
  try {
    return new URL(input, base)?.toString();
  } catch {
    return input;
  }
}

export function mergeSEO(
  parent: SEOConfig | undefined,
  child: SEOConfig | undefined
): SEOConfig {
  if (!parent) return { ...(child || {}) };
  if (!child) return { ...parent };

  const merged: SEOConfig = { ...parent, ...child };

  if (parent.openGraph || child.openGraph) {
    merged.openGraph = {
      ...(parent.openGraph || {}),
      ...(child.openGraph || {}),
    };
  }
  if (parent.robots || child.robots) {
    merged.robots = { ...(parent.robots || {}), ...(child.robots || {}) };
  }

  return merged;
}

export function formatRobotsMeta(robots?: RobotsConfig): string | undefined {
  if (!robots) return undefined;
  const index = robots.index === false ? 'noindex' : 'index';
  const follow = robots.follow === false ? 'nofollow' : 'follow';
  return `${index},${follow}`;
}
