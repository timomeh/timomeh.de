import {
  isBefore,
  isSameMonth,
  isSameWeek,
  isSameYear,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns'
import relativeDate from 'tiny-relative-date'

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
  return relativeDate(date)
}

export function isMoreThanWeeksAgo(date: Date, weeks: number) {
  return isBefore(date, subWeeks(new Date(), weeks))
}
