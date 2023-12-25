import { format, formatDistanceToNow, getTime } from "date-fns";
import moment from "moment";
// ----------------------------------------------------------------------

export function fDate(date: string | Date, newFormat = "") {
  const fm = newFormat || "dd MMM yyyy";

  return date ? format(new Date(date), fm) : "";
}

export function fDateTime(date: string | Date, newFormat = "") {
  const fm = newFormat || "dd MMM yyyy p";

  return date ? format(new Date(date), fm) : "";
}

export function fTimestamp(date: string | Date) {
  return date ? getTime(new Date(date)) : "";
}

export function fToNow(date: string | Date) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : "";
}

export const fDateWithMoment = (date: string | Date, formatOld = "", formatNew = "YYYY-MM-DD") => {
  const results = moment(date, formatOld).format(formatNew);
  return results;
};

export const FORMAT_DATE_TIME_SQL = "YYYY-MM-DD HH:mm:ss";
export const FORMAT_DATE_SQL = "YYYY-MM-DD";
