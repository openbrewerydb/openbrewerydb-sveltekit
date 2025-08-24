import type { PageServerLoad } from './$types';
import { getPostBySegments } from '$lib/posts';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const { yyyy, mm, slug } = params as {
    yyyy: string;
    mm: string;
    slug: string;
  };
  const post = getPostBySegments([yyyy, mm, slug]);
  if (!post) throw error(404, 'Post not found');
  // Only return serializable data
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
