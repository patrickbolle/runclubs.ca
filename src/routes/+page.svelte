<script>
  export let data;
  
  const cityImages = {
    vancouver: '/vancouver.jpg',
    toronto: '/toronto.jpg',
    'kitchener-waterloo': '/kitchener.jpg',
  };
</script>

<svelte:head>
  <title>runclubs.ca - Find Running Clubs Across Canada</title>
  <meta name="description" content="Discover and join local running communities across Canada. Find group runs, make new friends, and stay motivated with runclubs.ca." />
</svelte:head>

<p class="text-gray-600 mb-4">Discover and join local running communities across Canada. Find group runs, make new friends, and stay motivated with runclubs.ca.</p>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {#each data.cities as city}
    <a href="/{city.slug}" class="relative overflow-hidden rounded-lg shadow-lg h-64 group">
      <div class="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110" style="background-image: url({cityImages[city.slug] || '/images/default-city.jpg'});">
      </div>
      <div class="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 group-hover:bg-opacity-30"></div>
      <div class="absolute inset-0 flex items-center justify-center">
        <h2 class="text-white text-4xl font-bold">{city.name}</h2>
      </div>
    </a>
  {/each}
</div>