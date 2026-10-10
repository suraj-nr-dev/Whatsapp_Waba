import Icon from './Icon.jsx'
import './ChartCard.css'

// White box around one chart, with a heading on top.
// Example:
//   <ChartCard title="Messages Sent" subtitle="per day" icon="trendUp"
//              tone="purple" total="1,250">
//     <TrendChart ... />
//   </ChartCard>
// title     = heading of the chart
// subtitle  = small grey text under the heading
// icon      = a name from Icon.jsx
// tone      = 'purple' or 'orange': the color of the icon
// total     = big number on the right side of the heading (optional)
// isLoading = true while the first data is being fetched: shows a grey box
// isEmpty   = true when there is nothing to draw: shows a short message
// children  = the chart itself
function ChartCard({
  title,
  subtitle,
  icon,
  tone,
  total,
  isLoading,
  isEmpty,
  children,
}) {
  return (
    <section className={'chart-card ' + tone} aria-busy={isLoading}>
      <header className="chart-card-header">
        <span className="chart-card-icon">
          <Icon name={icon} size={18} />
        </span>
        <div className="chart-card-titles">
          <h2 className="chart-card-title">{title}</h2>
          <p className="chart-card-subtitle">{subtitle}</p>
        </div>
        {!isLoading && !isEmpty && total && (
          <p className="chart-card-total">{total}</p>
        )}
      </header>

      {isLoading && <div className="chart-card-skeleton" />}

      {!isLoading && isEmpty && (
        <div className="chart-card-empty">
          <span className="chart-card-empty-icon">
            <Icon name="chat" size={22} />
          </span>
          <p className="chart-card-empty-title">No messages in this period</p>
          <p>Pick another date range, or send a campaign to see it here.</p>
        </div>
      )}

      {!isLoading && !isEmpty && children}
    </section>
  )
}

export default ChartCard
