<script lang="ts">

  interface Props {
    href: string;
    isMobile?: boolean;
    toggleMenu?: any;
    class?: string;
    children?: import('svelte').Snippet;
  }

  let {
    href,
    isMobile = false,
    toggleMenu = undefined,
    class: classes = $bindable(undefined),
    children
  }: Props = $props();
  

  classes = classes
    ? classes
    : isMobile
    ? 'block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50'
    : 'font-medium text-gray-600 hover:text-gray-900';
</script>

<a {href} class={classes} onclick={toggleMenu}>{@render children?.()}</a>
