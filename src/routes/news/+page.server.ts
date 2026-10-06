import type { PageServerLoad } from './$types';
import { getAllPosts } from '$lib/posts';

export const prerender = true;

export const load: PageServerLoad = async () => {
  const posts = getAllPosts();
  return { posts };
};
