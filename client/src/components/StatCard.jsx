import Icon from './Icon.jsx'
import './StatCard.css'

// One small card at the top of the dashboard.
// Example: <StatCard title="Yesterday" amount={0} count={0} />
function StatCard({ title, amount, count }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span className="stat-card-icon">
          <Icon name="monitor" size={26} />
        </span>
        <span className="stat-card-title">{title}</span>
      </div>

      <p className="stat-card-amount">{amount}</p>
      <p className="stat-card-count">Count : {count}</p>
    </div>
  )
}

export default StatCard
