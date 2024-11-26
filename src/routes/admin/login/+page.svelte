<script>
  export let form;
</script>

<div class="max-w-md mx-auto mt-8 p-4">
  <h1 class="text-2xl font-bold mb-4">Admin Login</h1>

  <form method="POST" class="space-y-4">
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
      <input
        type="password"
        name="password"
        id="password"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
      />
    </div>

    <button
      type="submit"
      class="w-full bg-emerald-500 text-white py-2 px-4 rounded hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
    >
      Login
    </button>

    {#if form?.error}
      <p class="text-red-500 text-sm">{form.error}</p>
    {/if}
  </form>
</div> 