<script lang="ts">
  interface Props {
    title: string;
    content: string;
  }

  let { title, content }: Props = $props();
</script>

<div>
  <h2
    class="mt-6 tracking-tight font-extrabold text-gray-900 sm:text-3xl md:text-4xl"
  >
    {title}
  </h2>
  <p
    class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-3 md:text-xl md:max-w-3xl"
  >
    {content}
  </p>
</div>
