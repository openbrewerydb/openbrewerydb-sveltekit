<script context="module">
  /** @type {import('./[slug]').Load} */
  export async function load() {
    return {
      status: 301,
      redirect: '/documentation',
    };
  }
</script>
