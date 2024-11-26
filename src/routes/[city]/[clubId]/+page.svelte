<script>
  import { page } from '$app/stores';

  export let data;

  $: club = data.club;

  function formatEvents(events) {
    if (!events || events.length === 0) return 'No scheduled times';
    return events
      .map(e => `${e.day_of_week}: ${e.start_time.slice(0, 5)}`)
      .join('\n');
  }
</script>

<svelte:head>
  <title>{club.name} in {$page.params.city} - runclubs.ca</title>
  <meta name="description" content="Join {club.name} in {$page.params.city}. Meet at {club.location} for a great run!" />
</svelte:head>

<div class="bg-white p-6 rounded-lg shadow">
  <h2 class="text-2xl font-bold mb-4">{club.name}</h2>
  <p class="mb-2"><strong>Schedule:</strong></p>
  <pre class="mb-4 whitespace-pre-line">{formatEvents(club.events)}</pre>
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