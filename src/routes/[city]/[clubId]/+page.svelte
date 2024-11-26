<script>
  import { page } from '$app/stores';
  import { formatTime } from '$lib/utils';

  export let data;

  $: club = data.club;
</script>

<svelte:head>
  <title>{club.name} in {$page.params.city} - runclubs.ca</title>
  <meta name="description" content="Join {club.name} in {$page.params.city} every {club.day} at {formatTime(club.time)}. Meet at {club.location} for a great run!" />
</svelte:head>

<div class="bg-white p-6 rounded-lg shadow">
  <h2 class="text-2xl font-bold mb-4">{club.name}</h2>
  <p class="mb-2"><strong>Day:</strong> {club.day}</p>
  <p class="mb-2"><strong>Time:</strong> {formatTime(club.time)}</p>
  <p class="mb-2"><strong>Location:</strong> {club.location}</p>
  <p class="mb-4">{club.description}</p>

  <h3 class="text-xl font-bold mb-2">Social Media</h3>
  <ul>
    {#if club.socialMedia.instagram}
      <li>Instagram: <a href="https://instagram.com/{club.socialMedia.instagram.slice(1)}" target="_blank" rel="noopener noreferrer" class="text-emerald-600 hover:underline">{club.socialMedia.instagram}</a></li>
    {/if}
    {#if club.socialMedia.facebook}
      <li>Facebook: <a href="https://facebook.com/{club.socialMedia.facebook}" target="_blank" rel="noopener noreferrer" class="text-emerald-600 hover:underline">{club.socialMedia.facebook}</a></li>
    {/if}
  </ul>
</div>