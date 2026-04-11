/**
 * Parse date string from API that includes timezone info like "+0700 WIB"
 * Example: "2026-04-03 16:40:00 +0700 WIB" -> Date object
 */
export function parseApiDate(dateString: string | null | undefined): Date | null {
  if (!dateString) return null;
  
  // Remove timezone suffix like "+0700 WIB" and parse
  // Format: "2026-04-03 16:40:00 +0700 WIB" -> "2026-04-03 16:40:00 +0700"
  const cleanedDate = dateString.replace(/\s+[A-Z]{3,4}$/, '');
  
  const date = new Date(cleanedDate);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return null;
  }
  
  return date;
}

/**
 * Format date to Indonesian locale
 */
export function formatDate(
  date: Date | string | null | undefined, 
  locale: string = 'id-ID',
  options?: Intl.DateTimeFormatOptions
): string {
  if (!date) return '-';
  
  const dateObj = typeof date === 'string' ? parseApiDate(date) : date;
  
  if (!dateObj) return '-';
  
  return dateObj.toLocaleDateString(locale, options);
}

/**
 * Get year from date string
 */
export function getYear(date: Date | string | null | undefined): number | null {
  if (!date) return null;
  
  const dateObj = typeof date === 'string' ? parseApiDate(date) : date;
  
  if (!dateObj) return null;
  
  return dateObj.getFullYear();
}
