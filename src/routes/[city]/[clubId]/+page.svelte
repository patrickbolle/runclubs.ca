<script>
  import { page } from '$app/stores';
  import { formatTime } from '$lib/utils';
  import { cityData } from '$lib/cityData';

  $: city = $page.params.city;
  $: clubId = $page.params.clubId;
  $: cityInfo = cityData[city.toLowerCase()];
  $: club = cityInfo?.runClubs.find(c => c.id === clubId);

  $: title = club ? `${club.name} in ${cityInfo.city} - runclubs.ca` : 'Canadian Run Clubs - runclubs.ca';
  $: description = club
    ? `Join ${club.name} in ${cityInfo.city} every ${club.day} at ${formatTime(club.time)}. Meet at ${club.location} for a great run!`
    : 'Explore run clubs in cities across Canada. Find your perfect running group today!';
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
</svelte:head>

{#if club}
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
{:else}
  <p>Run club "{clubId}" not found in {city}. Please check back later.</p>
{/if}