// Aajker tarikh "YYYY-MM-DD" format-e (tomar local time onujayi).
export function todayString() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

// "2026-11-25" + "18:00" -> Date object
export function sessionDateTime(date, time) {
  return new Date(`${date}T${time}`);
}

// "2026-11-25" -> "Wed, Nov 25, 2026"
export function formatSessionDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// "18:00" -> "6:00 PM"
export function formatTime(time) {
  const [hours, minutes] = time.split(':').map(Number);
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}