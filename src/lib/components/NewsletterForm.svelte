<script lang="ts">
  /**
   * Component for newsletter subscription form
   */
</script>

<h3 class="text-sm font-semibold text-amber-600 tracking-wider uppercase">
  Subscribe to the newsletter
</h3>
<form class="mt-4 sm:flex sm:max-w-md">
  <label for="email-address" class="sr-only">Email address</label>
  <input
    type="email"
    name="email-address"
    id="email-address"
    autocomplete="email"
    required
    class="appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:placeholder-gray-400 transition-colors duration-200 hover:shadow transition-shadow duration-200"
    placeholder="Enter your email"
  />
  <div class="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
    <button
      type="submit"
      class="w-full bg-amber-600 flex items-center justify-center border border-transparent rounded-md py-2 px-4 text-base font-medium text-white hover:bg-amber-700 focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200 shadow-md hover:shadow-lg transition-shadow duration-200"
      >Subscribe</button
    >
  </div>
</form>
