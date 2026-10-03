import { useState } from 'react'
import Icon from './Icon.jsx'
import logo from '../assets/logo.png'
import { menuItems } from '../data/menuItems.js'
import './Sidebar.css'

// Left side menu.
// activePage   = name of the page that is open now
// onSelectPage = function to call when the user clicks a page
function Sidebar({ activePage, onSelectPage }) {
  // Remembers which dropdown is open. Empty text means no dropdown is open.
  const [openDropdown, setOpenDropdown] = useState('')

  function handleDropdownClick(label) {
    if (openDropdown === label) {
      setOpenDropdown('') // click again to close
    } else {
      setOpenDropdown(label)
    }
  }

  return (
    <aside className="sidebar">
      {/* The logo sits on a white box because it should not be placed on purple */}
      <div className="sidebar-logo">
        <img src={logo} alt="ReapLift" />
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          // Normal menu item (no dropdown)
          if (!item.children) {
            const isActive = activePage === item.label
            return (
              <button
                key={item.label}
                type="button"
                className={isActive ? 'menu-item active' : 'menu-item'}
                onClick={() => onSelectPage(item.label)}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
              </button>
            )
          }

          // Menu item with a dropdown
          const isOpen = openDropdown === item.label
          return (
            <div key={item.label}>
              <button
                type="button"
                className="menu-item"
                aria-expanded={isOpen}
                onClick={() => handleDropdownClick(item.label)}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
                <span className={isOpen ? 'menu-arrow open' : 'menu-arrow'}>
                  <Icon name="chevronDown" size={16} />
                </span>
              </button>

              {isOpen && (
                <div className="submenu">
                  {item.children.map((child) => (
                    <button
                      key={child}
                      type="button"
                      className={
                        activePage === child
                          ? 'submenu-item active'
                          : 'submenu-item'
                      }
                      onClick={() => onSelectPage(child)}
                    >
                      {child}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
