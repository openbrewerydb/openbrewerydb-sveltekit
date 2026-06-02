<script lang="ts">
  interface Props {
    href: string;
    isMobile?: boolean;
    toggleMenu?: () => void;
    class?: string;
    children?: import('svelte').Snippet;
  }

  let {
    href,
    isMobile = false,
    toggleMenu = undefined,
    class: className = $bindable(undefined),
    children,
  }: Props = $props();

  const classes = $derived(
    className
      ? className
      : isMobile
        ? 'block w-full px-4 py-4 rounded-lg text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-amber-50 transition-colors duration-200'
        : 'font-medium text-gray-600 hover:text-gray-900'
  );
</script>

<a {href} class={classes} onclick={toggleMenu}>{@render children?.()}</a>
