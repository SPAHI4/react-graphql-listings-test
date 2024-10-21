export function truncateDescription(str: string, length: number): string {
  if (str.length < 100) {
    return str;
  }
  const trimmedString = str.substring(0, length);
  return trimmedString.substring(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' '))) + '...';
}
