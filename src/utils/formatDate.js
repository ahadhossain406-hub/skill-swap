// "2026-11-18T09:30:00.000Z" -> "Nov 18, 2026"
export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}