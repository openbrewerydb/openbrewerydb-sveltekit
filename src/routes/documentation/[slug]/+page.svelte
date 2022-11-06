<script context="module">
  /** @type {import('../../../../../.svelte-kit/types/src/routes/documentation/[slug]/$types').Load} */
  export async function load() {
    return {
      status: 301,
      redirect: '/documentation',
    };
  }
</script>
