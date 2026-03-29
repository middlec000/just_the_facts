/**
 * Format an ISO timestamp into a human-readable date string,
 * e.g. "Jan 15, 2025 at 10:00 AM"
 */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}
