<script>
  import '../app.css';
  import { page } from '$app/stores';
  import vancouverData from '$lib/data/vancouver.json';

  $: currentCity = $page.params.city || '';
  $: cityData = currentCity.toLowerCase() === 'vancouver' ? vancouverData : null;
  $: displayCity = cityData ? cityData.city : currentCity;
</script>

<svelte:head>
  <title>{$page.data.title || 'runclubs.ca'}</title>
  <meta name="description" content={$page.data.description || 'Find run clubs in your city across Canada'} />
</svelte:head>

<div class="min-h-screen bg-gray-100 text-gray-900">
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <header class="mb-8">
      <h1 class="text-3xl font-bold">
        {#if displayCity}
          <b class="text-blue-600 lowercase">{displayCity}</b> // runclubs.ca
        {:else}
          runclubs.ca
        {/if}
      </h1>
      <p class="text-gray-600">Find your new favourite running clubs in {displayCity}.</p>
    </header>

    <main>
      <slot />
    </main>

    <footer class="mt-8 text-center text-gray-500">
      <p>runclubs.ca</p>
      <p>
        <a class="text-blue-600" href="https://bollenbach.ca/?utm_source=runclubs">Built by Patrick Bollenbach</a>
      </p>
    </footer>
  </div>
</div>