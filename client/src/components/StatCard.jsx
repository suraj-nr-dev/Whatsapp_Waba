import Icon from './Icon.jsx'
import { useCountUp } from '../hooks/useCountUp.js'
import './StatCard.css'

// One small card at the top of the dashboard.
// Example:
//   <StatCard title="Messages Sent" value={1250} format={formatNumber}
//             icon="send" tone="purple" hint="of 1,300 attempts" />
// title     = small heading of the card
// value     = the number to show. Leave it empty while it is being fetched.
// format    = function that turns the number into text, like formatNumber
// hint      = small grey line under the number (optional)
// warning   = small orange line for something the user must know (optional)
// icon      = a name from Icon.jsx
// tone      = 'purple', 'orange' or 'red': the color of the icon
// isLoading = true while the first number is being fetched: shows grey bars
function StatCard({ title, value, format, hint, warning, icon, tone, isLoading }) {
  // The number on screen counts up or down to the real value
  const shownValue = useCountUp(value === undefined ? 0 : value)

  return (
    <div className={'stat-card ' + tone} aria-busy={isLoading}>
      <div className="stat-card-top">
        <span className="stat-card-title">{title}</span>
        <span className="stat-card-icon">
          <Icon name={icon} size={20} />
        </span>
      </div>

      {isLoading ? (
        <>
          <div className="stat-card-skeleton big" />
          <div className="stat-card-skeleton small" />
        </>
      ) : (
        <>
          <p className="stat-card-value">{format(shownValue)}</p>
          {hint && <p className="stat-card-hint">{hint}</p>}
          {warning && <p className="stat-card-warning">{warning}</p>}
        </>
      )}
    </div>
  )
}

export default StatCard
