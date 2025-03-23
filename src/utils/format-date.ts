export function formatDate(date: Date | string): string {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: '2-digit' 
  };

  return new Date(date).toLocaleDateString("en-US", options);
}
