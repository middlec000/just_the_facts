/**
 * Format a timestamp into a readable date
 */
export function formatDate(timestamp: string): string {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);
}

/**
 * Truncate text to a specific length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}...`;
}

/**
 * Format a URL for display
 */
export function formatUrl(url: string): string {
  if (!url) return '';
  
  // Remove protocol
  let formatted = url.replace(/^https?:\/\//, '');
  
  // Remove trailing slash
  formatted = formatted.replace(/\/$/, '');
  
  // Truncate if too long
  if (formatted.length > 40) {
    formatted = `${formatted.substring(0, 40)}...`;
  }
  
  return formatted;
}
