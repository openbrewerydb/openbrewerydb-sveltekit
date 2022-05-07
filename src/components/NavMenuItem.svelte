<script lang="ts">
  export let href: string
  export let isMobile = false
  let classes: string = undefined
  export { classes as class }

  classes = classes
    ? classes
    : isMobile
    ? "block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
    : "font-medium text-gray-600 hover:text-gray-900"
</script>

<a {href} class={classes}><slot /></a>
