<script>
  import { page } from '$app/stores';
  import WeeklyCalendar from '$lib/components/WeeklyCalendar.svelte';

  $: ({ cityData, clubs } = $page.data);

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
    <h1 class="text-2xl font-bold mb-2">{cityData.city} Run Clubs</h1>
    <p class="mb-2"><strong>Number of Run Clubs:</strong> {clubs.length}</p>
    <p>{cityData.description}</p>
  </div>
  <WeeklyCalendar runClubs={clubs} />
  
  <div class="mt-6">
    <h2 class="text-xl font-bold mb-2">All Clubs</h2>
    <ul>
      {#each clubs as club}
        <li>{club.name}</li>
      {/each}
    </ul>
  </div>
{:else}
  <p>No data available for {$page.params.city}. Please check the URL and try again.</p>
{/if}