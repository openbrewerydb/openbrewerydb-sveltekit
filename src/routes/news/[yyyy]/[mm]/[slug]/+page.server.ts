import type { EntryGenerator, PageServerLoad } from './$types';
import { getAllPosts, getPostBySegments } from '$lib/posts';
import { error } from '@sveltejs/kit';

export const prerender = true;
export const entries: EntryGenerator = () =>
  getAllPosts().map((p) => ({
    yyyy: p.segments[0],
    mm: p.segments[1],
    slug: p.segments[2],
  }));

export const load: PageServerLoad = async ({ params }) => {
  const { yyyy, mm, slug } = params as {
    yyyy: string;
    mm: string;
    slug: string;
  };
  const post = getPostBySegments([yyyy, mm, slug]);

  if (!post) throw error(404, 'Post not found');

  return {
    post: {
      segments: post.segments,
      slug: post.slug,
      href: post.href,
      path: post.path,
      meta: post.meta,
    },
  };
};
