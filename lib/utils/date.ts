import { CalendarDate } from "@internationalized/date";

export function convertCalendarDateToDate(val: any): Date | undefined {
  if (!val) return undefined;
  if (val instanceof Date) return val;
  if (val instanceof CalendarDate) {
    return new Date(val.year, val.month - 1, val.day);
  }

  return val;
}

export function convertCalendarDateToISO(
  date: Date | CalendarDate | undefined,
): string | undefined {
  if (!date) return undefined;

  const dateObj = convertCalendarDateToDate(date);

  if (!dateObj || !(dateObj instanceof Date)) return undefined;

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
