import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import './Header.css'

// Top bar of the page.
// userName     = name shown next to the profile picture
// onToggleMenu = function that shows / hides the sidebar
// onLogout     = function that runs when the user clicks Logout
function Header({ userName, onToggleMenu, onLogout }) {
  // Is the small profile box under the picture open?
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef(null)

  // Close the profile box when the user clicks outside it or presses Escape
  useEffect(() => {
    if (!isProfileOpen) return

    function handleClickOutside(event) {
      if (!profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isProfileOpen])

  function handleLogoutClick() {
    setIsProfileOpen(false)
    onLogout()
  }

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

      <div className="header-profile" ref={profileRef}>
        <button
          type="button"
          className="header-avatar"
          aria-label="Profile"
          aria-haspopup="menu"
          aria-expanded={isProfileOpen}
          onClick={() => setIsProfileOpen(!isProfileOpen)}
        >
          <Icon name="user" size={18} />
        </button>

        {isProfileOpen && (
          <div className="profile-menu" role="menu">
            <div className="profile-menu-user">
              <span className="header-avatar profile-menu-avatar">
                <Icon name="user" size={18} />
              </span>
              <span className="profile-menu-name">{userName}</span>
            </div>

            <button
              type="button"
              className="profile-menu-logout"
              role="menuitem"
              onClick={handleLogoutClick}
            >
              <Icon name="logout" size={18} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
