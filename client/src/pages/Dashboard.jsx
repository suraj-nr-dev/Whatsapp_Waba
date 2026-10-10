import { useEffect, useState } from 'react'
import DateRangeFilter from '../components/DateRangeFilter.jsx'
import StatCard from '../components/StatCard.jsx'
import ChartCard from '../components/ChartCard.jsx'
import TrendChart from '../components/TrendChart.jsx'
import StatusChart from '../components/StatusChart.jsx'
import WabaInfo from '../components/WabaInfo.jsx'
import Icon from '../components/Icon.jsx'
import { getDashboardAnalytics } from '../api/analytics.js'
import { dateRanges, wabaInfo } from '../data/dashboardData.js'
import {
  formatDay,
  formatMoney,
  formatMoneyShort,
  formatNumber,
  formatPercent,
} from '../utils/format.js'
import './Dashboard.css'

// Text that shows which days the numbers are for.
// One day: "10 Oct 2026".  More days: "26 Sep 2026 – 10 Oct 2026".
function getPeriodText(dailyData) {
  const firstDay = formatDay(dailyData[0].date)
  const lastDay = formatDay(dailyData[dailyData.length - 1].date)
  return firstDay === lastDay ? firstDay : firstDay + ' – ' + lastDay
}

function Dashboard() {
  // The date filter that is selected now
  const [range, setRange] = useState('today')

  // Goes up by 1 when the user clicks Refresh or "Try again",
  // to ask the backend again
  const [reloadCount, setReloadCount] = useState(0)

  // The last answer from the backend: { requestId, data } when it worked,
  // { requestId, error } when it failed. null before the first answer.
  const [result, setResult] = useState(null)

  // Name of the request the screen is waiting for right now
  const requestId = range + '-' + reloadCount

  // Ask the backend again when the filter changes or the user refreshes
  useEffect(() => {
    // If the user picks another filter before this answer arrives, the old
    // answer is thrown away, so it can never replace the newer one.
    let isCancelled = false

    getDashboardAnalytics(range)
      .then((data) => {
        if (!isCancelled) setResult({ requestId, data })
      })
      .catch((error) => {
        if (!isCancelled) setResult({ requestId, error: error.message })
      })

    return () => {
      isCancelled = true
    }
  }, [range, requestId])

  // An answer for an older request does not count, we are still loading
  const isLoading = result === null || result.requestId !== requestId
  const errorMessage = isLoading ? undefined : result.error

  // While a new filter is loading, the numbers of the old one stay on the
  // screen (faded), so the page does not jump. They are replaced as soon
  // as the new answer arrives.
  const data = result ? result.data : undefined
  const isFirstLoad = isLoading && data === undefined
  const isRefreshing = isLoading && data !== undefined

  const rangeLabel = dateRanges.find((item) => item.value === range).label
  const summary = data ? data.summary : undefined
  const isEmpty = summary !== undefined && summary.totalAttempts === 0

  // Money needs the currency that the backend sent
  function formatCost(value) {
    return formatMoney(value, data.currency)
  }

  function formatCostShort(value) {
    return formatMoneyShort(value, data.currency)
  }

  function handleRefresh() {
    setReloadCount(reloadCount + 1)
  }

  return (
    <div className="dashboard">
      {/* Top row: title on the left, filter and refresh on the right */}
      <div className="dashboard-top">
        <div>
          <h1 className="dashboard-title">Message Analytics</h1>
          <p className="dashboard-period">
            <Icon name="calendar" size={16} />
            {data && !isLoading ? getPeriodText(data.dailyData) : rangeLabel}
          </p>
        </div>

        <div className="dashboard-controls">
          <DateRangeFilter
            ranges={dateRanges}
            selected={range}
            onSelect={setRange}
          />
          <button
            type="button"
            className={
              isLoading ? 'dashboard-refresh spinning' : 'dashboard-refresh'
            }
            onClick={handleRefresh}
            disabled={isLoading}
            aria-label="Refresh"
            title="Refresh"
          >
            <Icon name="refresh" size={18} />
          </button>
        </div>
      </div>

      {/* The request failed: say so, never show zeros that are not true */}
      {errorMessage && (
        <div className="dashboard-message" role="alert">
          <span className="dashboard-message-icon">
            <Icon name="xCircle" size={24} />
          </span>
          <h2>Could not load the dashboard</h2>
          <p>{errorMessage}</p>
          <button
            type="button"
            className="btn btn-primary dashboard-retry"
            onClick={handleRefresh}
          >
            <Icon name="refresh" size={16} />
            Try again
          </button>
        </div>
      )}

      {!errorMessage && (
        <div
          className={
            isRefreshing ? 'dashboard-content refreshing' : 'dashboard-content'
          }
        >
          {/* The 4 number cards */}
          <div className="stat-cards">
            <StatCard
              title="Messages Sent"
              icon="send"
              tone="purple"
              isLoading={isFirstLoad}
              value={summary && summary.messagesSent}
              format={formatNumber}
              hint={
                summary &&
                'of ' + formatNumber(summary.totalAttempts) + ' attempts'
              }
            />
            <StatCard
              title="Total Cost"
              icon="rupee"
              tone="orange"
              isLoading={isFirstLoad}
              value={summary && summary.totalCost}
              format={formatCost}
              hint="billed for sent messages"
              warning={
                summary && summary.messagesMissingCost > 0
                  ? 'Cost not available yet for ' +
                    formatNumber(summary.messagesMissingCost) +
                    ' sent messages'
                  : undefined
              }
            />
            <StatCard
              title="Delivered"
              icon="checkCircle"
              tone="purple"
              isLoading={isFirstLoad}
              value={summary && summary.deliveredMessages}
              format={formatNumber}
              hint={
                summary &&
                formatPercent(summary.deliveredMessages, summary.messagesSent) +
                  ' of sent messages'
              }
            />
            <StatCard
              title="Failed"
              icon="xCircle"
              tone="red"
              isLoading={isFirstLoad}
              value={summary && summary.failedMessages}
              format={formatNumber}
              hint={
                summary &&
                formatNumber(summary.pendingMessages) + ' still pending'
              }
            />
          </div>

          {/* Row 1: messages per day + status ring */}
          <div className="dashboard-row">
            <ChartCard
              title="Messages Sent"
              subtitle="Successfully sent messages per day"
              icon="trendUp"
              tone="purple"
              total={summary && formatNumber(summary.messagesSent)}
              isLoading={isFirstLoad}
              isEmpty={isEmpty}
            >
              {data && (
                <TrendChart
                  data={data.dailyData}
                  dataKey="messagesSent"
                  name="Messages sent"
                  kind="area"
                  color="var(--purple)"
                  formatValue={formatNumber}
                  formatAxis={formatNumber}
                  wholeNumbers
                />
              )}
            </ChartCard>

            <ChartCard
              title="Message Status"
              subtitle="Latest status of every message"
              icon="pieChart"
              tone="orange"
              isLoading={isFirstLoad}
              isEmpty={isEmpty}
            >
              {data && (
                <StatusChart
                  breakdown={data.statusBreakdown}
                  total={summary.totalAttempts}
                />
              )}
            </ChartCard>
          </div>

          {/* Row 2: cost per day + Waba details */}
          <div className="dashboard-row">
            <ChartCard
              title="Messaging Cost"
              subtitle="Amount billed per day"
              icon="barChart"
              tone="orange"
              total={summary && formatCost(summary.totalCost)}
              isLoading={isFirstLoad}
              isEmpty={isEmpty}
            >
              {data && (
                <TrendChart
                  data={data.dailyData}
                  dataKey="totalCost"
                  name="Cost"
                  kind="bar"
                  color="var(--orange)"
                  formatValue={formatCost}
                  formatAxis={formatCostShort}
                />
              )}
            </ChartCard>

            <WabaInfo rows={wabaInfo} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
