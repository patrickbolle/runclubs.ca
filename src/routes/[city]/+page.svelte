<script>
  export let data;
  import WeeklyCalendar from '$lib/components/WeeklyCalendar.svelte';

  $: ({ city } = data);
  $: numberOfClubs = city.clubs.length;
</script>

<svelte:head>
  <title>{numberOfClubs} Run Clubs in {city.name} | runclubs.ca</title>
  <meta name="description" content="Find {numberOfClubs} running clubs and group runs in {city.name}. Join a local running community today!" />
</svelte:head>

<h2 class="text-2xl font-bold mb-4">{numberOfClubs} Run Club{numberOfClubs !== 1 ? 's' : ''} in {city.name}</h2>

<p class="mb-4">{city.description}</p>

<div class="mb-8">
  <h3 class="text-xl font-semibold mb-4">Weekly Schedule</h3>
  <WeeklyCalendar clubs={city.clubs} citySlug={city.slug} />
</div>

<div class="mb-8">
  <h3 class="text-xl font-semibold mb-4">All Run Clubs</h3>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each city.clubs as club}
      <a href="/{city.slug}/{club.id}" class="block">
        <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4">
          <h4 class="text-lg font-semibold mb-2">{club.name}</h4>
          <p class="text-sm text-gray-600 mb-2">{club.description}</p>
          <p class="text-sm"><strong>Day(s):</strong> {club.day}</p>
          <p class="text-sm"><strong>Time(s):</strong> {club.time}</p>
          <p class="text-sm text-emerald-600 mt-2">Click for more details</p>
        </div>
      </a>
    {/each}
  </div>
</div>

<!-- Rest of the component remains the same -->