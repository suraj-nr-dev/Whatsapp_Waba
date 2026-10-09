import { useNavigate } from 'react-router-dom'
import AppShell from './AppShell.jsx'
import { homeMenu } from '../data/menuItems.js'

// The SMS Campaign area. Nothing is built here yet.
// TODO (SMS): give this area its own menu and pages.
function SmsLayout() {
  const navigate = useNavigate()

  return (
    <AppShell
      menuItems={homeMenu}
      activePage=""
      onSelectPage={() => navigate('/home')}
    >
      <div className="coming-soon">
        <h2>SMS Campaign</h2>
        <p>This page is coming soon.</p>
      </div>
    </AppShell>
  )
}

export default SmsLayout
