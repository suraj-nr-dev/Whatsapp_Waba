// Fixed lists for the Dashboard page.
// The numbers on the dashboard come from the backend (see api/analytics.js).

// The date filters above the cards.
// "value" is the name the backend understands, "label" is what the user sees.
export const dateRanges = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last15days', label: 'Last 15 Days' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
]

// How each message status is shown in the status chart.
// The three purples go from light to dark, like the journey of a message:
// sent -> delivered -> read. Orange is "still waiting" and red is "failed".
// "icon" is a name from components/Icon.jsx.
export const statusInfo = {
  pending: { label: 'Pending', color: '#f7941d', icon: 'clock' },
  sent: { label: 'Sent', color: '#c08bc7', icon: 'send' },
  delivered: { label: 'Delivered', color: '#8e3a98', icon: 'checkCircle' },
  read: { label: 'Read', color: '#5e2466', icon: 'eye' },
  failed: { label: 'Failed', color: '#b3261e', icon: 'xCircle' },
  // A status this page does not know yet
  other: { label: 'Other', color: '#8a7f8c', icon: 'info' },
}

// Rows of the "Waba Information" table
// TODO (backend): replace these with the real API response.
export const wabaInfo = [
  { label: 'Waba number', value: '918951872233' },
  { label: 'Display name', value: 'kstewd' },
  { label: 'Quality', value: 'UNKNOWN' },
  { label: 'Message limit', value: '10000' },
]
