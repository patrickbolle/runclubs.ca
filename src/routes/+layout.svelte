<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import '../app.css';
  import { cities } from '$lib/cityData.js';

  $: currentCity = $page.params.city || '';
  $: currentClub = $page.params.clubId || '';
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
    <header class="mb-4 flex justify-between items-center">
      <h1 class="text-3xl font-bold flex items-center flex-wrap">
        <a href="/" class=" text-gray-900 hover:text-emerald-500 transition-colors duration-200 py-1 border-neutral-10">runclubs.ca
        <span class="mr-2 font-bold"> //</span></a>
        <div class="relative inline-flex items-center">
          <select 
            class="appearance-none bg-transparent border-b-2 border-emerald-500 text-emerald-500 py-1 pr-8 pl-1 lowercase focus:outline-none"
            value={currentCity}
            on:change={handleCityChange}
          >
            <option value="" disabled selected>select a city</option>
            {#each cities as city}
              <option value={city.toLowerCase()}>{city}</option>
            {/each}
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-emerald-500">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </h1>
      <a
        href="mailto:patrick@runclubs.ca?subject=Submit%20a%20Club"
        class="bg-emerald-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Submit a Club
      </a>
    </header>

    <!-- Breadcrumb navigation (only for club pages) -->
    {#if currentClub}
      <nav class="text-sm mb-4">
        <ol class="list-none p-0 inline-flex font-bold">
          <li class="flex items-center">
            <a href="/{currentCity}" class="text-emerald-500 hover:underline">&#8624; <span class="capitalize">{currentCity}</span></a>
          </li>
        </ol>
      </nav>
    {/if}

    <main>
      <slot />
    </main>

    <footer class="mt-8 text-center text-gray-500">
      <p>🏃🏽 runclubs.ca</p>
      <p>
        <a class="text-emerald-500" target="_blank" href="https://bollenbach.ca/?utm_source=runclubs">Built by Patrick Bollenbach</a>
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