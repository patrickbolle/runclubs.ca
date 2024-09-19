<script>
  import { goto } from '$app/navigation';

  let city = '';

  function handleSubmit() {
    if (city) {
      goto(`/${city.toLowerCase()}`);
    }
  }
</script>

<h2 class="text-2xl font-bold mb-4">Select a City</h2>

<form on:submit|preventDefault={handleSubmit} class="mb-8">
  <input
    bind:value={city}
    placeholder="Enter city name"
    class="border rounded px-4 py-2 mr-2"
  />
  <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
    Go
  </button>
</form>

<p>
  Currently available: <a href="/vancouver" class="text-blue-500 hover:underline">Vancouver</a>
</p>