<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import '../app.css';
  import { cities } from '$lib/cityData.js';

  $: currentCity = $page.params.city || '';
  $: isRootPage = $page.url.pathname === '/';

  function handleCityChange(event) {
    const selectedCity = event.target.value;
    goto(selectedCity ? `/${selectedCity.toLowerCase()}` : '/');
  }
</script>

<svelte:head>
  <title>{$page.data.title || 'runclubs.ca'}</title>
  <script async src="https://data.kwconcerts.ca/script.js" data-website-id="21f20d8e-556d-499e-b62d-5c6ca8c6c38e"></script>
  <meta name="description" content={$page.data.description || 'Find run clubs in your city across Canada'} />
</svelte:head>

<div class="min-h-screen bg-gray-100 text-gray-900">
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <header class="mb-4">
      <h1 class="text-3xl font-bold flex items-center flex-wrap">
        <span class="mr-2">runclubs.ca //</span>
        <div class="relative inline-flex items-center">
          <select 
            class="appearance-none bg-transparent border-b-2 border-blue-600 text-blue-600 py-1 pr-8 pl-2 lowercase focus:outline-none"
            value={currentCity}
            on:change={handleCityChange}
          >
            <option value="">{isRootPage ? 'select a city' : 'home'}</option>
            {#each cities as city}
              <option value={city.toLowerCase()}>{city}</option>
            {/each}
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-600">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </h1>
    </header>

    <main>
      <slot />
    </main>

    <footer class="mt-8 text-center text-gray-500">
      <p>runclubs.ca</p>
      <p>
        <a class="text-blue-600" target="_blank" href="https://bollenbach.ca/?utm_source=runclubs">Built by Patrick Bollenbach</a>
      </p>
    </footer>
  </div>
</div>

<style>
  select {
    max-width: 100%;
    min-width: 120px;
    width: auto;
  }
</style>