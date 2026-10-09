import { useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import Header from '../components/Header.jsx'
import { useAuth } from '../auth/AuthContext.js'

// Below this screen width the sidebar works like a slide-in drawer.
// Keep this number the same as the one in App.css.
const MOBILE_WIDTH = 900

// The frame around every page a logged-in user sees: sidebar + header.
// Home, WhatsApp and SMS each use it with their own menu.
// menuItems    = the list shown in the sidebar (see data/menuItems.js)
// activePage   = name of the menu item that is open now
// onSelectPage = function to call when the user clicks a menu item
// children     = the page content
function AppShell({ menuItems, activePage, onSelectPage, children }) {
  const { user, logout } = useAuth()

  // Is the sidebar visible? Open on big screens, closed on phones.
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    window.innerWidth > MOBILE_WIDTH,
  )

  function handleSelectPage(pageName) {
    onSelectPage(pageName)

    // On phones, close the menu after the user picks a page
    if (window.innerWidth <= MOBILE_WIDTH) {
      setIsSidebarOpen(false)
    }
  }

  function handleToggleMenu() {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className={isSidebarOpen ? 'app sidebar-open' : 'app sidebar-closed'}>
      <Sidebar
        menuItems={menuItems}
        activePage={activePage}
        onSelectPage={handleSelectPage}
      />

      {/* Dark layer behind the menu on phones. Click it to close the menu. */}
      <div className="sidebar-overlay" onClick={handleToggleMenu} />

      <main className="main">
        {/* Logging out clears the user, and ProtectedRoute then
            sends them to the login page. */}
        <Header
          userName={user.name}
          onToggleMenu={handleToggleMenu}
          onLogout={logout}
        />

        {children}
      </main>
    </div>
  )
}

export default AppShell
