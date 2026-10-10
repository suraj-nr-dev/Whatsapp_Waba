import { useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import Icon from './Icon.jsx'
import { statusInfo } from '../data/dashboardData.js'
import { formatNumber, formatPercent } from '../utils/format.js'
import { prefersReducedMotion } from '../utils/motion.js'
import './StatusChart.css'

// The small box shown when the mouse is over a slice.
// Recharts fills in "active" and "payload" by itself.
function StatusTooltip({ active, payload, total }) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const slice = payload[0].payload

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-row">
        <span
          className="chart-tooltip-dot"
          style={{ background: slice.color }}
        />
        <span>{slice.label}</span>
        <span className="chart-tooltip-value">
          {formatNumber(slice.count)} ({formatPercent(slice.count, total)})
        </span>
      </div>
    </div>
  )
}

// Ring chart that shows how many messages are in each status.
// Every message has exactly one status, so the slices add up to the total.
// breakdown = list like [{ status: 'sent', count: 12 }]
// total     = number of all messages (all attempts)
function StatusChart({ breakdown, total }) {
  // The status under the mouse (in the ring or in the list). The other
  // slices fade, so the chosen one stands out.
  const [activeStatus, setActiveStatus] = useState(null)

  // Add the label, color and icon of each status (see data/dashboardData.js)
  const rows = breakdown.map((item) => ({
    ...item,
    ...(statusInfo[item.status] || statusInfo.other),
  }))

  // A slice of 0 cannot be drawn
  const slices = rows.filter((row) => row.count > 0)

  return (
    <div className="status-chart">
      <div className="status-chart-ring">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={slices}
              dataKey="count"
              nameKey="label"
              innerRadius={62}
              outerRadius={88}
              paddingAngle={slices.length > 1 ? 2 : 0}
              stroke="none"
              startAngle={90}
              endAngle={-270}
              isAnimationActive={!prefersReducedMotion()}
              animationDuration={500}
              onMouseEnter={(slice) => setActiveStatus(slice.payload.status)}
              onMouseLeave={() => setActiveStatus(null)}
            >
              {slices.map((slice) => (
                <Cell
                  key={slice.status}
                  fill={slice.color}
                  fillOpacity={
                    activeStatus === null || activeStatus === slice.status
                      ? 1
                      : 0.3
                  }
                />
              ))}
            </Pie>
            <Tooltip content={<StatusTooltip total={total} />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Total in the middle of the ring */}
        <div className="status-chart-center">
          <span className="status-chart-total">{formatNumber(total)}</span>
          <span className="status-chart-total-label">attempts</span>
        </div>
      </div>

      {/* List of all statuses with their numbers */}
      <ul className="status-chart-legend">
        {rows.map((row) => (
          <li
            key={row.status}
            className={
              activeStatus === row.status
                ? 'status-chart-row active'
                : 'status-chart-row'
            }
            onMouseEnter={() => setActiveStatus(row.status)}
            onMouseLeave={() => setActiveStatus(null)}
          >
            <span
              className="status-chart-row-icon"
              style={{ background: row.color }}
            >
              <Icon name={row.icon} size={12} />
            </span>
            <span className="status-chart-row-label">{row.label}</span>
            <span className="status-chart-row-count">
              {formatNumber(row.count)}
            </span>
            <span className="status-chart-row-percent">
              {formatPercent(row.count, total)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default StatusChart
