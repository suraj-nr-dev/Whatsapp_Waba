import { apiRequest } from './client.js'

// Gets the dashboard numbers for one date filter.
// range = 'today', 'yesterday', 'last15days', 'thisMonth' or 'lastMonth'
// All counting and adding is done by the backend, the page only shows it.
export function getDashboardAnalytics(range) {
  return apiRequest('/api/analytics/dashboard?range=' + range)
}
