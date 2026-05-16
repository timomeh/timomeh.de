import {
  differenceInHours,
  differenceInMinutes,
  isBefore,
  isSameMonth,
  isSameWeek,
  isSameYear,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns'

export function isWeekAgo(date: Date, weeks: number) {
  return isSameWeek(date, subWeeks(new Date(), weeks), { weekStartsOn: 1 })
}

export function isMonthAgo(date: Date, months: number) {
  return isSameMonth(date, subMonths(new Date(), months))
}

export function isYearAgo(date: Date, years: number) {
  return isSameYear(date, subYears(new Date(), years))
}

export function formatRelativeDate(date: Date) {
  const now = new Date()

  const minutes = differenceInMinutes(now, date)
  if (minutes < 3) return 'just now'
  if (minutes < 60) return `${minutes} minutes ago`

  const hours = differenceInHours(now, date)
  if (hours < 36) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`

  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    hour12: false,
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'Europe/Berlin',
  })
}

export function isMoreThanWeeksAgo(date: Date, weeks: number) {
  return isBefore(date, subWeeks(new Date(), weeks))
}
