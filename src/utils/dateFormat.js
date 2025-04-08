import { getTimeZone } from "../index.js";

const localTimeZone = getTimeZone();

export function formatLocalDate(dateUTC) {

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
