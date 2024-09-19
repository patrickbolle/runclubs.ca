<script>
  import { getWeekDays, formatDate } from '$lib/utils';
  import RunClubCard from './RunClubCard.svelte';

  export let runClubs;

  $: weekDays = getWeekDays();
  $: clubsByDay = weekDays.map(date => {
    const dayName = formatDate(date);
    return {
      date,
      clubs: runClubs.filter(club => {
        if (club.day === 'Various') return true;
        const clubDays = club.day.split(' and ');
        return clubDays.includes(dayName);
      })
    };
  });

  function truncate(str, n) {
    return (str.length > n) ? str.slice(0, n-1) + '...' : str;
  }
</script>

<div class="grid grid-cols-7 gap-2">
  {#each clubsByDay as { date, clubs }}
    <div class="border border-gray-200 rounded p-2 bg-white shadow">
      <h3 class="font-bold mb-2 text-center text-sm">
        {formatDate(date)}
      </h3>
      <div class="space-y-2">
        {#each clubs.slice(0, 3) as club}
          <RunClubCard {club} compact={true} />
        {/each}
        {#if clubs.length > 3}
          <p class="text-xs text-center text-gray-500">+{clubs.length - 3} more</p>
        {/if}
      </div>
    </div>
  {/each}
</div>

<div class="mt-8">
  <h3 class="text-xl font-bold mb-4">All Run Clubs</h3>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each runClubs as club}
      <RunClubCard {club} />
    {/each}
  </div>
</div>