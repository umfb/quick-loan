import { format } from "date-fns";

export function dateFormatter(date: string): string {
  return format(new Date(date), "dd/MM/yyyy");
}
