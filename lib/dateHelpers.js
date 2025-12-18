export function formatDateWithWeekday(dateStr) {
  if (!dateStr) return null;

  const date = new Date(dateStr);
  return date.toLocaleDateString("da-DK", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
