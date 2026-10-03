import StatCard from '../components/StatCard.jsx'
import DaywiseChart from '../components/DaywiseChart.jsx'
import WabaInfo from '../components/WabaInfo.jsx'
import {
  statCards,
  daywiseConsumption,
  wabaInfo,
} from '../data/dashboardData.js'
import './Dashboard.css'

function Dashboard() {
  return (
    <div className="dashboard">
      {/* Left side: cards and chart */}
      <div className="dashboard-left">
        <div className="stat-cards">
          {statCards.map((card) => (
            <StatCard
              key={card.title}
              title={card.title}
              amount={card.amount}
              count={card.count}
            />
          ))}
        </div>

        <h2 className="dashboard-heading">Daywise Consumption</h2>
        <DaywiseChart values={daywiseConsumption} />
      </div>

      {/* Right side: Waba details */}
      <WabaInfo rows={wabaInfo} />
    </div>
  )
}

export default Dashboard
