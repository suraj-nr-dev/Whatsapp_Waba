// Small helpers that turn numbers and dates into text for the screen.

// 12345 -> "12,345" (Indian style commas). For counts: no decimals.
export function formatNumber(value) {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(value)
}

// 1250.5 -> "₹1,250.50"
// currency = the code sent by the backend, for example 'INR'
export function formatMoney(value, currency) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

// "2026-10-10" -> "10 Oct 2026"
// The backend already decided which calendar day it is, so the date is
// read as UTC here. That way the browser's timezone can never change it.
export function formatDay(dateKey) {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateKey + 'T00:00:00Z'))
}

// "2026-10-10" -> "10 Oct"  (short form for the bottom of a chart)
export function formatShortDay(dateKey) {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'short',
  }).format(new Date(dateKey + 'T00:00:00Z'))
}

// 1250 -> "₹1,250" and 0.5 -> "₹0.5"  (short form for the side of a chart)
export function formatMoneyShort(value, currency) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

// 85 out of 200 -> "43%".  Nothing out of nothing is "0%".
export function formatPercent(part, whole) {
  if (whole === 0) {
    return '0%'
  }
  return Math.round((part / whole) * 100) + '%'
}
