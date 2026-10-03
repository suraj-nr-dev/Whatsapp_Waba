import './DaywiseChart.css'

// Bar chart made with plain HTML and CSS (no chart library needed).
// values = list of numbers, one number for each day of the month.
function DaywiseChart({ values }) {
  // Add all the days to get the month total
  let total = 0
  for (const value of values) {
    total = total + value
  }

  // The tallest bar decides the top of the chart.
  // If every day is 0 we use 1, so we never divide by zero.
  const biggestValue = Math.max(...values)
  const chartTop = biggestValue > 0 ? biggestValue : 1

  // 6 labels on the left side, from top to bottom
  const steps = [1, 0.8, 0.6, 0.4, 0.2, 0]

  return (
    <div className="chart-card">
      <p className="chart-total">{total.toFixed(2)}</p>
      <p className="chart-subtitle">This Month</p>

      <div className="chart-scroll">
        <div className="chart">
          {/* Numbers on the left side */}
          <div className="chart-y-axis">
            {steps.map((step) => (
              <span key={step}>{(step * chartTop).toFixed(2)}</span>
            ))}
          </div>

          <div className="chart-right">
            {/* The bars. Height of each bar is a percentage of the chart. */}
            <div className="chart-bars">
              {values.map((value, index) => (
                <div className="chart-bar-box" key={index}>
                  <div
                    className="chart-bar"
                    style={{ height: (value / chartTop) * 100 + '%' }}
                    title={'Day ' + (index + 1) + ' : ' + value}
                  />
                </div>
              ))}
            </div>

            {/* Day numbers under the bars */}
            <div className="chart-x-axis">
              {values.map((value, index) => (
                <span key={index}>{index + 1}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DaywiseChart
