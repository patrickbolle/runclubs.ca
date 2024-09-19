<script>
  import { page } from '$app/stores';
  import WeeklyCalendar from '$lib/components/WeeklyCalendar.svelte';
  import vancouverData from '$lib/data/vancouver.json';

  $: city = $page.params.city;
  $: cityData = city.toLowerCase() === 'vancouver' ? vancouverData : null;

  $: title = cityData ? `${cityData.city} Run Clubs - runclubs.ca` : 'City Not Found - runclubs.ca';
  $: description = cityData 
    ? `Discover the best running clubs in ${cityData.city}. Join local running groups and stay active with fellow runners.`
    : 'Explore run clubs in cities across Canada. Find your perfect running group today!';
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
</svelte:head>

{#if cityData}
  <div class="mb-6 bg-white p-4 rounded-lg shadow">
    <p class="mb-2"><strong>Number of Run Clubs:</strong> {cityData.runClubs.length}</p>
    <p>{cityData.description}</p>
  </div>
  <WeeklyCalendar runClubs={cityData.runClubs} />
{:else}
  <p>No data available for {city}. Please check back later.</p>
{/if}