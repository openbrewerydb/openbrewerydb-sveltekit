import type { BlogFrontmatter } from '$lib/types';

export type PostSegments = [string, string, string]; // [yyyy, mm, slug]

export type PostModule = {
  // default export is a Svelte component constructor, but we won't expose it from server loads
  default: unknown;
  metadata?: BlogFrontmatter;
};

export type PostItem = {
  segments: PostSegments;
  slug: string;
  href: string; // /blog/yyyy/mm/slug
  path: string; // module path used by import.meta.glob
  meta: BlogFrontmatter;
};

const modules = import.meta.glob<PostModule>(
  '$lib/data/posts/**/*.{md,svx}',
  { eager: true }
);

function toSegments(path: string): PostSegments | null {
  // Expect: /src/lib/data/posts/YYYY/MM/slug.ext
  const m = path.match(/\/posts\/(\d{4})\/(\d{2})\/([^/]+)\.(?:md|svx)$/);
  if (!m) return null;
  return [m[1], m[2], m[3]];
}

function normalizeAuthors(meta?: BlogFrontmatter): string[] {
  if (!meta) return [];
  const arr = (meta.authors && meta.authors.length ? meta.authors : meta.author ? [meta.author] : []) as string[];
  return arr.map((s) => s.toLowerCase());
}

const allPosts: PostItem[] = Object.entries(modules)
  .map(([path, mod]) => {
    const segments = toSegments(path);
    if (!segments) return null;
    const [yyyy, mm, slug] = segments;
    const href = `/blog/${yyyy}/${mm}/${slug}`;
    const meta: BlogFrontmatter = {
      ...(mod.metadata ?? {}),
      // ensure normalized fields we rely on
      authors: normalizeAuthors(mod.metadata),
    };
    return {
      segments,
      slug,
      href,
      path,
      meta,
    } as PostItem;
  })
  .filter(Boolean) as PostItem[];

function parseDate(d?: string): number {
  if (!d) return 0;
  const t = Date.parse(d);
  return isNaN(t) ? 0 : t;
}

export function getAllPosts(): PostItem[] {
  return [...allPosts].sort((a, b) => parseDate(b.meta.date) - parseDate(a.meta.date));
}

export function getPostBySegments(seg: PostSegments): PostItem | undefined {
  const [yyyy, mm, slug] = seg;
  return allPosts.find((p) => p.segments[0] === yyyy && p.segments[1] === mm && p.segments[2] === slug);
}
