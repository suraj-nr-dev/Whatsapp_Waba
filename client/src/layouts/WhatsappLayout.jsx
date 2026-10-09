import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from './AppShell.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import PushCampaign from '../pages/PushCampaign.jsx'
import { menuItems } from '../data/menuItems.js'

// Pages that are ready. Add the page name here when you build a new page.
const builtPages = ['Dashboard', 'Push Campaign']

// The WhatsApp WABA area: the full WhatsApp menu + its pages.
function WhatsappLayout() {
  const navigate = useNavigate()

  // Which page is open now
  const [activePage, setActivePage] = useState('Dashboard')

  function handleSelectPage(pageName) {
    // "Home" leaves the WhatsApp area and goes back to the Home page
    if (pageName === 'Home') {
      navigate('/home')
      return
    }

    setActivePage(pageName)
  }

  return (
    <AppShell
      menuItems={menuItems}
      activePage={activePage}
      onSelectPage={handleSelectPage}
    >
      {activePage === 'Dashboard' && <Dashboard />}
      {activePage === 'Push Campaign' && <PushCampaign />}

      {/* Other pages are not built yet */}
      {!builtPages.includes(activePage) && (
        <div className="coming-soon">
          <h2>{activePage}</h2>
          <p>This page is coming soon.</p>
        </div>
      )}
    </AppShell>
  )
}

export default WhatsappLayout
