<script context="module">
  /** @type {import('../../../../.svelte-kit/types/src/routes/documentation./../../../.svelte-kit/types/src/routes/documentation/[slug]').Load} */
  export async function load() {
    return {
      status: 301,
      redirect: '/documentation',
    };
  }
</script>
