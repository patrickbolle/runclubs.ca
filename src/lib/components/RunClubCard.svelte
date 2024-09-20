<script>
  export let club;

  function formatDayAndTime(day, time) {
    const days = day.split(',');
    const times = time.split(',');
    
    return days.map((d, i) => {
      const [hours, minutes] = times[i].split(':');
      const parsedHours = parseInt(hours, 10);
      const ampm = parsedHours >= 12 ? 'PM' : 'AM';
      const formattedHours = parsedHours % 12 || 12;
      return `${d}: ${formattedHours}:${minutes} ${ampm}`;
    }).join(', ');
  }
</script>

<!-- Update the template to use formatDayAndTime -->
<div class="...">
  <h3>{club.name}</h3>
  <p>Schedule: {formatDayAndTime(club.day, club.time)}</p>
  <!-- ... rest of the template ... -->
</div>