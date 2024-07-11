import {
  format,
  formatDistance,
  formatRelative,
  isSameDay,
  isSameWeek,
  isThisYear,
  isToday,
  parseISO,
  subDays,
} from "date-fns";

export const formatDateAgo = (date: Date | null): string => {
  if (!date) {
    return "";
  }
  if (isSameDay(date, new Date()) || isSameWeek(date, new Date())) {
    return formatDistance(date, new Date(), { addSuffix: true });
  } else if (isThisYear(date)) {
    return format(date, "dd MMM");
  } else {
    return format(date, "yyyy-MM-dd");
  }
};
