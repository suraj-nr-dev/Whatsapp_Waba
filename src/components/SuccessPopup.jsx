import './SuccessPopup.css'

// Popup shown in the middle of the screen with a blurred background.
// message = text to show
// onClose = function called when the user clicks OK
function SuccessPopup({ message, onClose }) {
  return (
    <div className="popup-background">
      <div className="popup-box" role="alertdialog" aria-modal="true" aria-label={message}>
        {/* Green circle with a tick mark */}
        <div className="popup-tick">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m5 12 5 5 9-10" />
          </svg>
        </div>

        <p className="popup-message">{message}</p>

        {/* autoFocus lets the user press Enter to close the popup */}
        <button type="button" className="btn btn-primary" onClick={onClose} autoFocus>
          OK
        </button>
      </div>
    </div>
  )
}

export default SuccessPopup
