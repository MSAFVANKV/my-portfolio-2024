import React from 'react';

interface FormattedDateProps {
  date?: string | number | Date;
  hideDate?: boolean;
  showTime?: boolean;
  showSeconds?: boolean;
  showMinutes?: boolean;
  showHours?: boolean;
  use12Hour?: boolean;
  dateFormat?:
    | 'MM/DD/YYYY'
    | 'DD/MM/YYYY'
    | 'DD MMM YYYY'
    | 'MMMM/DD/YYYY'
    | 'DDD, DD MMM `YY';
  timeFormat?: '2H 1M 20S' | 'HH:MM:SS' | 'HH:MM' | '1H 28M 30S AM/PM';
  startDate?: string | number | Date;
  endDate?: string | number | Date;
  className?: string;
  errorMessage?: string;
}

const MyClock: React.FC<FormattedDateProps> = ({
  date,
  hideDate = false,
  showTime = false,
  showSeconds = true,
  showMinutes = true,
  showHours = true,
  use12Hour = true,
  dateFormat = 'MMMM/DD/YYYY',
  timeFormat,
  startDate,
  endDate,
  className,
  errorMessage = 'N/A',
}) => {
  const normalizedDate = date ? normalizeDate(date) : null;

  // Calculate totalDuration if startDate and endDate are provided
  const totalDuration =
    startDate && endDate ? calculateDuration(startDate, endDate) : null;

  // Format as duration if timeFormat is specified and we have totalDuration
  const formattedDuration =
    timeFormat && totalDuration !== null
      ? formatDuration(
          totalDuration,
          timeFormat,
          showSeconds,
          showMinutes,
          showHours,
        )
      : null;

  // Format as time if timeFormat is specified and we have a date
  const formattedTimeFromDate =
    timeFormat && normalizedDate && !startDate && !endDate
      ? formatTimeFromDate(
          normalizedDate,
          timeFormat,
          showSeconds,
          showMinutes,
          showHours,
        )
      : null;

  if (!normalizedDate && !formattedDuration && !formattedTimeFromDate) {
    return <span className={className}>{errorMessage}</span>;
  }

  // If we have formattedDuration, return it (priority to duration)
  if (formattedDuration) {
    return <span className={className}>{formattedDuration}</span>;
  }

  // If we have formattedTimeFromDate, return it
  if (formattedTimeFromDate) {
    return <span className={className}>{formattedTimeFromDate}</span>;
  }

  const options: Intl.DateTimeFormatOptions = hideDate
    ? {}
    : getDateFormatOptions(dateFormat);

  if (showTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
    if (showSeconds) options.second = '2-digit';
    options.hour12 = use12Hour;
  }

  let formattedDate = '';
  if (normalizedDate) {
    if (dateFormat === 'DDD, DD MMM `YY') {
      const parts = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: '2-digit',
      }).formatToParts(normalizedDate);

      const weekday = parts.find((p) => p.type === 'weekday')?.value;
      const day = parts.find((p) => p.type === 'day')?.value;
      const month = parts.find((p) => p.type === 'month')?.value;
      const year = parts.find((p) => p.type === 'year')?.value;

      formattedDate = `${weekday}, ${day} ${month}\`${year}`;
    } else {
      formattedDate = new Intl.DateTimeFormat(
        getDateFormatLocale(dateFormat),
        options,
      ).format(normalizedDate);

      if (dateFormat === 'MMMM/DD/YYYY') {
        formattedDate = formattedDate.toUpperCase();
      }
    }
  }

  return <span className={className}>{formattedDate || errorMessage}</span>;
};

export default MyClock;

const getDateFormatLocale = (dateFormat: FormattedDateProps['dateFormat']) => {
  switch (dateFormat) {
    case 'DD/MM/YYYY':
      return 'en-GB';
    case 'DD MMM YYYY':
      return 'en-GB';
    case 'DDD, DD MMM `YY':
    case 'MMMM/DD/YYYY':
    case 'MM/DD/YYYY':
    default:
      return 'en-US';
  }
};

const getDateFormatOptions = (
  dateFormat: FormattedDateProps['dateFormat'],
): Intl.DateTimeFormatOptions => {
  switch (dateFormat) {
    case 'DDD, DD MMM `YY':
      return {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: '2-digit',
      };
    case 'DD/MM/YYYY':
      return {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      };
    case 'DD MMM YYYY':
      return {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      };
    case 'MMMM/DD/YYYY':
      return {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      };
    case 'MM/DD/YYYY':
    default:
      return {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      };
  }
};

// == normalize all kind of possibilities in dates ===

const normalizeDate = (date: string | number | Date): Date | null => {
  if (!date) return null;

  // Already a Date
  if (date instanceof Date) {
    return isNaN(date.getTime()) ? null : date;
  }

  // Timestamp (number or numeric string)
  if (typeof date === 'number' || /^\d+$/.test(date)) {
    const timestamp = Number(date);

    // If seconds → convert to ms
    return new Date(timestamp < 1e12 ? timestamp * 1000 : timestamp);
  }

  // String date
  const parsed = new Date(date);
  return isNaN(parsed.getTime()) ? null : parsed;
};

// Calculate duration between two dates in milliseconds
const calculateDuration = (
  start: string | number | Date,
  end: string | number | Date,
): number => {
  const startDate = normalizeDate(start);
  const endDate = normalizeDate(end);

  if (!startDate || !endDate) return 0;

  return Math.abs(endDate.getTime() - startDate.getTime());
};

// Format duration in milliseconds to specified format
const formatDuration = (
  durationMs: number,
  format: string,
  showSeconds: boolean = true,
  showMinutes: boolean = true,
  showHours: boolean = true,
): string => {
  const totalSeconds = Math.floor(durationMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  switch (format) {
    case '2H 1M 20S': {
      let result = '';
      if (showHours && hours > 0) result += `${hours}H `;
      if (showMinutes && minutes > 0) result += `${minutes}M `;
      if (showSeconds && seconds > 0) result += `${seconds}S`;
      return result.trim();
    }
    case '1H 28M 30S AM/PM': {
      const now = new Date();
      const period = now.getHours() >= 12 ? 'PM' : 'AM';
      let result = '';
      if (showHours && hours > 0) result += `${hours}H `;
      if (showMinutes && minutes > 0) result += `${minutes}M `;
      if (showSeconds && seconds > 0) result += `${seconds}S `;
      return `${result.trim()} ${period}`;
    }
    case 'HH:MM:SS': {
      if (!showHours && !showMinutes)
        return seconds.toString().padStart(2, '0');
      if (!showHours)
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      if (!showMinutes)
        return `${hours.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      if (!showSeconds)
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    case 'HH:MM':
      if (!showHours) return minutes.toString().padStart(2, '0');
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    default: {
      let result = '';
      if (showHours && hours > 0) result += `${hours}H `;
      if (showMinutes && minutes > 0) result += `${minutes}M `;
      if (showSeconds && seconds > 0) result += `${seconds}S`;
      return result.trim();
    }
  }
};

// Format a Date object's time using timeFormat
const formatTimeFromDate = (
  date: Date,
  format: string,
  showSeconds: boolean = true,
  showMinutes: boolean = true,
  showHours: boolean = true,
): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const period = hours >= 12 ? 'PM' : 'AM';

  switch (format) {
    case '2H 1M 20S': {
      let result = '';
      if (showHours && hours > 0) result += `${hours}H `;
      if (showMinutes && minutes > 0) result += `${minutes}M `;
      if (showSeconds && seconds > 0) result += `${seconds}S`;
      return result.trim();
    }
    case '1H 28M 30S AM/PM': {
      let result = '';
      if (showHours && hours > 0) result += `${hours}H `;
      if (showMinutes && minutes > 0) result += `${minutes}M `;
      if (showSeconds && seconds > 0) result += `${seconds}S `;
      return `${result.trim()} ${period}`;
    }
    case 'HH:MM:SS': {
      if (!showHours && !showMinutes)
        return seconds.toString().padStart(2, '0');
      if (!showHours)
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      if (!showMinutes)
        return `${hours.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      if (!showSeconds)
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    case 'HH:MM':
      if (!showHours) return minutes.toString().padStart(2, '0');
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    default: {
      let result = '';
      if (showHours && hours > 0) result += `${hours}H `;
      if (showMinutes && minutes > 0) result += `${minutes}M `;
      if (showSeconds && seconds > 0) result += `${seconds}S`;
      return result.trim();
    }
  }
};
