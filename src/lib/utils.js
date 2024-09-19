import { format, startOfWeek, addDays, parse } from 'date-fns';

export function getWeekDays(date = new Date()) {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function formatDate(date) {
  return format(date, 'EEEE');
}

export function formatTime(time) {
  if (!time) return 'Time not specified';
  try {
    if (time.includes('(') && time.includes(')')) {
      // Handle cases like "18:30 (Wed) / 08:15 (Sat)"
      return time.split('/').map(t => {
        const [timeStr, day] = t.trim().split(' ');
        const parsedTime = parse(timeStr, 'HH:mm', new Date());
        return `${format(parsedTime, 'h:mm a')} ${day}`;
      }).join(' / ');
    } else {
      // Handle simple time format
      const [hours, minutes] = time.split(':');
      return format(new Date(0, 0, 0, hours, minutes), 'h:mm a');
    }
  } catch (error) {
    console.error('Error formatting time:', time, error);
    return time; // Return the original time string if parsing fails
  }
}