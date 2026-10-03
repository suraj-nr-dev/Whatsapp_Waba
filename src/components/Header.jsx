import Icon from './Icon.jsx'
import './Header.css'

// Top bar of the page.
// userName     = name shown next to the profile picture
// onToggleMenu = function that shows / hides the sidebar
function Header({ userName, onToggleMenu }) {
  return (
    <header className="header">
      <button type="button" className="header-button" aria-label="Billing">
        <Icon name="card" />
      </button>

      <button
        type="button"
        className="header-button"
        aria-label="Show or hide menu"
        onClick={onToggleMenu}
      >
        <Icon name="menu" />
      </button>

      <span className="header-user">{userName}</span>

      <span className="header-avatar">
        <Icon name="user" size={18} />
      </span>
    </header>
  )
}

export default Header
