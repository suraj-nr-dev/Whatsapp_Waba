import './WabaInfo.css'

// Table on the right side of the dashboard.
// rows = list like [{ label: 'Waba number', value: '9189...' }]
function WabaInfo({ rows }) {
  return (
    <div className="waba-info">
      <h2 className="waba-info-title">Waba Information</h2>

      <table className="waba-info-table">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default WabaInfo
