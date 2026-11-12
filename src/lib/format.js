import { format, isSameDay, differenceInCalendarDays } from "date-fns";

const toDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

export const fmtTime = (v) => {
  const d = toDate(v);
  return d ? format(d, "h:mm a") : "";
};

export const fmtDay = (v) => {
  const d = toDate(v);
  return d ? format(d, "EEE") : "";
};

export const fmtDate = (v) => {
  const d = toDate(v);
  return d ? format(d, "MMM d") : "";
};

export const fmtLongDate = (v) => {
  const d = toDate(v);
  return d ? format(d, "EEEE, MMM d") : "";
};

export const fmtMonth = (v) => {
  const d = toDate(v);
  return d ? format(d, "MMM").toUpperCase() : "";
};

export const fmtDayNum = (v) => {
  const d = toDate(v);
  return d ? format(d, "d") : "";
};

export const fmtStamp = (v) => {
  const d = toDate(v);
  return d ? format(d, "MMM d, yyyy") : "";
};

export const fmtMoney = (v) => {
  if (v === null || v === undefined || v === "") return "";
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return n === 0 ? "Free" : `$${n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)}`;
};

// An event stays "relevant" for a few hours after it starts.
export const isUpcoming = (v) => {
  const d = toDate(v);
  return !!d && d.getTime() >= Date.now() - 3 * 60 * 60 * 1000;
};

export const isToday = (v) => {
  const d = toDate(v);
  return !!d && isSameDay(d, new Date());
};

export const daysAway = (v) => {
  const d = toDate(v);
  return d ? differenceInCalendarDays(d, new Date()) : null;
};

export const countdown = (v) => {
  const d = daysAway(v);
  if (d === null) return "";
  if (d < 0) return "Done";
  if (d === 0) return "Today";
  if (d === 1) return "Tomorrow";
  if (d < 7) return `In ${d} days`;
  if (d < 14) return "Next week";
  return `In ${Math.round(d / 7)} weeks`;
};