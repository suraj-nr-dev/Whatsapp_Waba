import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Header from './components/Header.jsx'
import Dashboard from './pages/Dashboard.jsx'
import PushCampaign from './pages/PushCampaign.jsx'
import { userName } from './data/dashboardData.js'
import './App.css'

// Pages that are ready. Add the page name here when you build a new page.
const builtPages = ['Dashboard', 'Push Campaign']

// Below this screen width the sidebar works like a slide-in drawer.
// Keep this number the same as the one in App.css.
const MOBILE_WIDTH = 900

function App() {
  // Which page is open now
  const [activePage, setActivePage] = useState('Dashboard')

  // Is the sidebar visible? Open on big screens, closed on phones.
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    window.innerWidth > MOBILE_WIDTH,
  )

  function handleSelectPage(pageName) {
    setActivePage(pageName)

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
      <Sidebar activePage={activePage} onSelectPage={handleSelectPage} />

      {/* Dark layer behind the menu on phones. Click it to close the menu. */}
      <div className="sidebar-overlay" onClick={handleToggleMenu} />

      <main className="main">
        <Header userName={userName} onToggleMenu={handleToggleMenu} />

        {activePage === 'Dashboard' && <Dashboard />}
        {activePage === 'Push Campaign' && <PushCampaign />}

        {/* Other pages are not built yet */}
        {!builtPages.includes(activePage) && (
          <div className="coming-soon">
            <h2>{activePage}</h2>
            <p>This page is coming soon.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
