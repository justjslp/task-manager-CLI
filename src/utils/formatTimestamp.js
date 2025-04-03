import { format } from "date-fns";

export function formatTimestamp(timestamp) {
  return format(new Date(timestamp), "yyyy/MM/dd HH:mm:ss");
}
