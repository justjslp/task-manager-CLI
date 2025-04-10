import { getTimeZone } from "../index.js";

export function formatLocalDate(dateUTC) {
  const localTimeZone = getTimeZone();

  const currentLocale = Intl.DateTimeFormat().resolvedOptions().locale;

  const formattedLocal = new Intl.DateTimeFormat(currentLocale, {
    timeZone: localTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(dateUTC);

  return formattedLocal;
}
