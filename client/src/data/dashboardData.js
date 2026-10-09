// Sample data for the Dashboard page.
// TODO (backend): replace these with the real API response.

export const userName = 'KSTEWD'

// The 4 cards at the top of the dashboard
export const statCards = [
  { title: 'Yesterday', amount: 0, count: 0 },
  { title: 'Last 15 Days', amount: 1.3, count: 10 },
  { title: 'This Month', amount: 3.38, count: 26 },
  { title: 'Last Month', amount: 2.73, count: 21 },
]

// Consumption for each day of this month.
// First value is day 1, second value is day 2, and so on.
export const daywiseConsumption = [
  0.13, 0, 0.26, 0.13, 0, 0, 0.39, 0.13, 0, 0.26, 0, 0.13, 0, 0, 0.52, 0.13,
  0, 0.26, 0, 0, 0.13, 0.39, 0, 0, 0.26, 0.13, 0, 0, 0.13, 0, 0,
]

// Rows of the "Waba Information" table
export const wabaInfo = [
  { label: 'Waba number', value: '918951872233' },
  { label: 'Display name', value: 'kstewd' },
  { label: 'Quality', value: 'UNKNOWN' },
  { label: 'Message limit', value: '10000' },
]
