<script>
  export let data;
  import WeeklyCalendar from '$lib/components/WeeklyCalendar.svelte';

  function formatCityName(city) {
    return city.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
  }

  $: numberOfClubs = data.runClubs.length;
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

<!-- Rest of the component remains the same -->