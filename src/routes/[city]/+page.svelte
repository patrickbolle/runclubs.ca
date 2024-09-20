<script>
  export let data;
  import WeeklyCalendar from '$lib/components/WeeklyCalendar.svelte';
  import RunClubCard from '$lib/components/RunClubCard.svelte';

  function formatCityName(city) {
    return city.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
  }

  $: numberOfClubs = data.runClubs.length;
  $: lowerCitySlug = data.city.toLowerCase();
</script>

<svelte:head>
  <title>{numberOfClubs} Run Clubs in {formatCityName(data.city)} | runclubs.ca</title>
  <meta name="description" content="Find {numberOfClubs} running clubs and group runs in {formatCityName(data.city)}. Join a local running community today!" />
</svelte:head>

<h2 class="text-2xl font-bold mb-4">{numberOfClubs} Run Club{numberOfClubs !== 1 ? 's' : ''} in {formatCityName(data.city)}</h2>

<p class="mb-4">{data.description}</p>

<div class="mb-8">
  <h3 class="text-xl font-semibold mb-4">Weekly Schedule</h3>
  <WeeklyCalendar runClubs={data.runClubs} citySlug={data.city} />
</div>

<div class="mb-8">
  <h3 class="text-xl font-semibold mb-4">All Run Clubs</h3>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each data.runClubs as club}
      <a href="/{lowerCitySlug}/{club.id}" class="block">
        <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4">
          <h4 class="text-lg font-semibold mb-2">{club.name}</h4>
          <p class="text-sm text-gray-600 mb-2">{club.description}</p>
          <p class="text-sm"><strong>Day(s):</strong> {club.day}</p>
          <p class="text-sm"><strong>Time(s):</strong> {club.time}</p>
          <p class="text-sm text-blue-600 mt-2">Click for more details</p>
        </div>
      </a>
    {/each}
  </div>
</div>

<!-- Rest of the component remains the same -->