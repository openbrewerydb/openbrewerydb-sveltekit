/** @type {import('./$types').PageLoad} */
export async function load() {
  // Backwards compatibility for old documentation
  return {
    status: 301,
    redirect: '/documentation',
  };
}
