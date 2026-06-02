<script lang="ts">
  import { page } from '$app/state';

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

  const isActive = $derived(
    href === '/'
      ? page.url.pathname === '/'
      : page.url.pathname === href || page.url.pathname.startsWith(href + '/')
  );

  const classes = $derived(
    className
      ? className
      : isMobile
        ? isActive
          ? 'block w-full px-4 py-3 rounded-lg text-base font-bold text-amber-900 bg-amber-100 border-l-4 border-amber-600 transition-all duration-200'
          : 'block w-full px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-amber-900 hover:bg-amber-100/60 transition-colors duration-200'
        : isActive
          ? 'font-semibold text-amber-900 bg-amber-100 px-3 py-1.5 rounded-md transition-colors duration-150'
          : 'font-medium text-gray-700 hover:text-amber-900 hover:bg-amber-50 px-3 py-1.5 rounded-md transition-colors duration-150'
  );
</script>

<a {href} class={classes} onclick={toggleMenu}>{@render children?.()}</a>
