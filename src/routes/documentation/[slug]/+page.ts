/** @type {import('./$types').PageLoad} */
export async function load() {
  return {
    status: 301,
    redirect: '/documentation',
  };
}
