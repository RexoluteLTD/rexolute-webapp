import moment from "moment";
import { FileType } from "@rexolute/types";

export const getFileType = (url: string): FileType => {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.endsWith(".pdf")) return "pdf";
  if (/\.(png|jpg|jpeg|webp|gif)$/.test(lowerUrl)) return "image";
  if (/\.(doc|docx|txt|csv|xls|xlsx)$/i.test(lowerUrl)) return "doc";
  return "unsupported";
};

export const capitalizeFirstLetter = (text: string) => {
  if (text.length === 0) {
    // Handle empty string case
    return "";
  }
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Interface to mimic Flutter's TimeOfDay
 */
export interface TimeOfDay {
  hour: number;
  minute: number;
}

export class DateTimeFormatter {
  /**
   * Format datetime string as a Date object
   * Pattern: 'yyyy-MM-dd h:mm a'
   */
  static toDateTime(datetime: string): Date {
    // moment parsing with explicit format
    return moment(datetime, "YYYY-MM-DD h:mm A").toDate();
  }

  /**
   * Format date as yyyy-MM-DD
   */
  static formatDate(date: Date): string {
    return moment(date).format("YYYY-MM-DD");
  }

  /**
   * Format time as hh:mm A (e.g., 02:30 PM)
   */
  static formatTime(date: Date): string {
    return moment(date).format("hh:mm A");
  }

  /**
   * Format full date and time as EEE, MMM d, yyyy - hh:mm A
   */
  static formatDateTime(date: Date): string {
    return moment(date).format("ddd, MMM D, YYYY - hh:mm A");
  }

  /**
   * Format date nicely as EEE, MMM d, yyyy (e.g., Wed, May 20, 2025)
   */
  static formatPrettyDate(date: Date): string {
    return moment(date).format("ddd, MMM D, YYYY");
  }

  /**
   * Format date with suffix (e.g., Wed, 20th May, 2025)
   */
  static formatDateWithSuffix(date: Date): string {
    const day = date.getDate();
    const suffix = this._getDaySuffix(day);
    const mDate = moment(date);

    const weekday = mDate.format("ddd");
    const month = mDate.format("MMM");
    const year = mDate.format("YYYY");

    return `${weekday}, ${day}${suffix} ${month}, ${year}`;
  }

  /**
   * Format with a custom pattern
   */
  static formatWithPattern(date: Date, pattern: string): string {
    return moment(date).format(pattern);
  }

  /**
   * Format as relative time (Replicating your custom Dart logic)
   */
  static formatRelativeTime(date: Date): string {
    const now = moment();
    const target = moment(date);
    const diffInSeconds = now.diff(target, "seconds");
    const isFuture = diffInSeconds < 0;
    const absSeconds = Math.abs(diffInSeconds);

    if (absSeconds < 60) {
      return isFuture ? "starting now" : "just now";
    }

    const absMinutes = Math.floor(absSeconds / 60);
    if (absMinutes < 60) {
      return isFuture
        ? `starts in ${absMinutes} minute${absMinutes === 1 ? "" : "s"}`
        : `${absMinutes} minute${absMinutes === 1 ? "" : "s"} ago`;
    }

    const absHours = Math.floor(absMinutes / 60);
    if (absHours < 24) {
      return isFuture
        ? `starts in ${absHours} hour${absHours === 1 ? "" : "s"}`
        : `${absHours} hour${absHours === 1 ? "" : "s"} ago`;
    }

    const absDays = Math.floor(absHours / 24);
    if (absDays === 1) {
      return isFuture ? "starts tomorrow" : "yesterday";
    }

    if (absDays < 30) {
      return isFuture
        ? `starts in ${absDays} day${absDays === 1 ? "" : "s"}`
        : `${absDays} day${absDays === 1 ? "" : "s"} ago`;
    }

    if (absDays < 365) {
      const months = Math.floor(absDays / 30);
      return isFuture
        ? `starts in ${months} month${months === 1 ? "" : "s"}`
        : `${months} month${months === 1 ? "" : "s"} ago`;
    }

    const years = Math.floor(absDays / 365);
    return isFuture
      ? `starts in ${years} year${years === 1 ? "" : "s"}`
      : `${years} year${years === 1 ? "" : "s"} ago`;
  }

  /**
   * Helper: Get day suffix (st, nd, rd, th)
   */
  private static _getDaySuffix(day: number): string {
    if (day >= 11 && day <= 13) {
      return "th";
    }
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }
}

/**
 * Equivalent of your global formatTime(TimeOfDay) function
 */
export const formatTimeFromObject = (time: TimeOfDay): string => {
  const dt = moment().set({ hour: time.hour, minute: time.minute });
  return dt.format("hh:mm A");
};
