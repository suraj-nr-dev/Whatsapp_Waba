import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatDay, formatShortDay } from '../utils/format.js'
import { prefersReducedMotion } from '../utils/motion.js'

// Style of the small grey numbers and dates around the chart
const axisText = { fontSize: 12, fill: 'var(--grey-text)' }

// The small box shown when the mouse is over a day.
// Recharts fills in "active", "payload" and "label" by itself.
function TrendTooltip({ active, payload, label, name, color, formatValue }) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{formatDay(label)}</p>
      <div className="chart-tooltip-row">
        <span className="chart-tooltip-dot" style={{ background: color }} />
        <span>{name}</span>
        <span className="chart-tooltip-value">
          {formatValue(payload[0].value)}
        </span>
      </div>
    </div>
  )
}

// Chart of one number for each day.
// Example:
//   <TrendChart data={dailyData} dataKey="messagesSent" name="Messages sent"
//               kind="area" color="var(--purple)" formatValue={formatNumber}
//               formatAxis={formatNumber} wholeNumbers />
// data         = list like [{ date: '2026-10-10', messagesSent: 12 }]
// dataKey      = which field of each day to draw
// name         = what the number is, shown in the hover box
// kind         = 'area' (line with a soft fill) or 'bar'
// color        = color of the line or the bars
// formatValue  = turns a number into text for the hover box
// formatAxis   = turns a number into text for the left side
// wholeNumbers = true when the number can never have decimals (a count)
function TrendChart({
  data,
  dataKey,
  name,
  kind,
  color,
  formatValue,
  formatAxis,
  wholeNumbers,
}) {
  const isAnimated = !prefersReducedMotion()

  // A line needs at least 2 days. One day alone is drawn as a bar.
  const ChartType = kind === 'bar' || data.length < 2 ? BarChart : AreaChart

  return (
    <ResponsiveContainer width="100%" height={260}>
      <ChartType data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--grey-line)" />
        <XAxis
          dataKey="date"
          tickFormatter={formatShortDay}
          tick={axisText}
          tickLine={false}
          axisLine={{ stroke: 'var(--grey-line)' }}
          minTickGap={24}
        />
        <YAxis
          tickFormatter={formatAxis}
          tick={axisText}
          tickLine={false}
          axisLine={false}
          allowDecimals={!wholeNumbers}
          width={56}
        />
        <Tooltip
          content={
            <TrendTooltip name={name} color={color} formatValue={formatValue} />
          }
          cursor={
            ChartType === BarChart
              ? { fill: 'var(--grey-fill)' }
              : { stroke: 'var(--grey-text)', strokeDasharray: '4 4' }
          }
        />

        {ChartType === BarChart ? (
          <Bar
            dataKey={dataKey}
            fill={color}
            radius={[4, 4, 0, 0]}
            maxBarSize={36}
            isAnimationActive={isAnimated}
            animationDuration={500}
          />
        ) : (
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill={color}
            fillOpacity={0.12}
            activeDot={{ r: 5, stroke: 'var(--white)', strokeWidth: 2 }}
            isAnimationActive={isAnimated}
            animationDuration={500}
          />
        )}
      </ChartType>
    </ResponsiveContainer>
  )
}

export default TrendChart
