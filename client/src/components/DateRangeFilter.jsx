import './DateRangeFilter.css'

// Row of buttons to pick the date filter of the dashboard.
// ranges   = list like [{ value: 'today', label: 'Today' }]
// selected = value of the filter that is active now
// onSelect = function to call with the value the user clicked
function DateRangeFilter({ ranges, selected, onSelect }) {
  return (
    <div className="date-filter" role="group" aria-label="Date range">
      {ranges.map((range) => (
        <button
          key={range.value}
          type="button"
          className={
            range.value === selected
              ? 'date-filter-button active'
              : 'date-filter-button'
          }
          aria-pressed={range.value === selected}
          onClick={() => onSelect(range.value)}
        >
          {range.label}
        </button>
      ))}
    </div>
  )
}

export default DateRangeFilter
