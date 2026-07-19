export function formatDate(
  date: Date | string
): string {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(new Date(date));
}

export function formatDateTime(
  date: Date | string
): string {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(new Date(date));
}

export function timeAgo(
  date: Date | string
): string {
  const seconds = Math.floor(
    (Date.now() -
      new Date(date).getTime()) /
      1000
  );

  const intervals = [
    { label: "year", secs: 31536000 },
    { label: "month", secs: 2592000 },
    { label: "day", secs: 86400 },
    { label: "hour", secs: 3600 },
    { label: "minute", secs: 60 },
  ];

  for (const interval of intervals) {
    const value = Math.floor(
      seconds / interval.secs
    );

    if (value >= 1) {
      return `${value} ${interval.label}${value > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
}