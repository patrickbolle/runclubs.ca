<script>
  import { getWeekDays, formatDate } from '$lib/utils';
  import RunClubCard from './RunClubCard.svelte';

  export let runClubs;
  export let citySlug;

  // Ensure citySlug is always lowercase
  $: lowerCitySlug = citySlug.toLowerCase();

  let weekDays = getWeekDays();
  let today = new Date().toLocaleString('en-us', {weekday: 'long'});

  // Reorder weekDays to start with today
  let todayIndex = weekDays.findIndex(date => formatDate(date) === today);
  weekDays = [...weekDays.slice(todayIndex), ...weekDays.slice(0, todayIndex)];

  function formatTime(time) {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const parsedHours = parseInt(hours, 10);
    const ampm = parsedHours >= 12 ? 'PM' : 'AM';
    const formattedHours = parsedHours % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  }

  $: clubsByDay = weekDays.map(date => {
    const dayName = formatDate(date);
    return {
      date,
      clubs: runClubs.flatMap(club => {
        const clubDays = club.day.split(',').map(d => d.trim());
        const clubTimes = club.time.split(',').map(t => t.trim());
        
        const dayIndex = clubDays.indexOf(dayName);
        if (dayIndex !== -1) {
          return [{
            ...club,
            relevantTime: formatTime(clubTimes[dayIndex])
          }];
        }
        return [];
      })
    };
  });

  function getCardClasses(index) {
    let classes = "border border-gray-200 rounded-lg p-3 bg-white shadow-md transition-all duration-300 hover:shadow-lg flex flex-col";
    
    if (index === 0) {
      classes += " md:col-span-2 md:col-start-1 md:row-start-1";
      classes += " ring-2 ring-blue-500";
    } else if (index === 1) {
      classes += " md:col-span-1 md:col-start-3 md:row-start-1";
    } else if (index === 2) {
      classes += " md:col-span-1 md:col-start-4 md:row-start-1";
    } else {
      classes += " md:col-span-1 md:row-start-2";
    }

    return classes;
  }
</script>

<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
  {#each clubsByDay as { date, clubs }, index}
    <div 
      class={getCardClasses(index)}
      style="min-height: 300px;"
    >
      <h3 class="font-bold mb-3 text-center text-sm sm:text-base {index === 0 ? 'text-blue-600' : 'text-gray-700'}">
        {formatDate(date)} {index === 0 ? '(Today)' : ''}
      </h3>
      <div class="space-y-2 flex-grow overflow-y-auto">
        {#if clubs.length > 0}
          {#each clubs as club}
            <a href="/{lowerCitySlug}/{club.id}" class="block bg-gray-50 rounded p-2 text-xs sm:text-sm hover:bg-gray-100 transition-colors duration-200">
              <p class="font-semibold">{club.name}</p>
              <p class="text-gray-600">{club.relevantTime}</p>
            </a>
          {/each}
        {:else}
          <p class="text-xs sm:text-sm text-center text-gray-500">No runs scheduled</p>
        {/if}
      </div>
    </div>
  {/each}
</div>