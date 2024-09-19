<script>
  import { page } from '$app/stores';
  import { formatTime } from '$lib/utils';
  import vancouverData from '$lib/data/vancouver.json';

  $: city = $page.params.city;
  $: clubId = $page.params.clubId;
  $: cityData = city.toLowerCase() === 'vancouver' ? vancouverData : null;
  $: club = cityData?.runClubs.find(c => c.id === clubId);

  // ... rest of the script ...
</script>

// ... rest of the component ...