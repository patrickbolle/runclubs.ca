<script>
  import { formatTime } from '$lib/utils';
  import { page } from '$app/stores';

  export let club;
  export let compact = false;

  $: city = $page.params.city;

  function truncate(str, n) {
    return (str.length > n) ? str.slice(0, n-1) + '...' : str;
  }
</script>

{#if compact}
  <a href="/{city}/{club.id}" class="block bg-gray-50 shadow rounded p-1 hover:bg-gray-100 transition-colors">
    <h4 class="font-bold text-xs">{truncate(club.name, 20)}</h4>
    <p class="text-xs text-gray-600">{formatTime(club.time)}</p>
  </a>
{:else}
  <a href="/{city}/{club.id}" class="block bg-gray-50 shadow rounded-lg p-3 hover:bg-gray-100 transition-colors">
    <h4 class="font-bold text-sm mb-1">{club.name}</h4>
    <p class="text-xs text-gray-600">{club.day}</p>
    <p class="text-xs text-gray-600">{formatTime(club.time)}</p>
    <p class="text-xs text-gray-600">{club.location}</p>
  </a>
{/if}