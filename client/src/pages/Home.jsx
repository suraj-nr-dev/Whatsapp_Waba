import { Link } from 'react-router-dom'
import AppShell from '../layouts/AppShell.jsx'
import Icon from '../components/Icon.jsx'
import { useAuth } from '../auth/AuthContext.js'
import { homeMenu } from '../data/menuItems.js'
import './Home.css'

// The two areas the user can open from Home.
// "path" is the page that opens when the card is clicked.
const options = [
  {
    title: 'WhatsApp Campaign',
    description:
      'Send WhatsApp messages from your WABA number, manage templates and see reports.',
    icon: 'chat',
    path: '/whatsapp',
  },
  {
    title: 'SMS Campaign',
    description: 'Send SMS campaigns to your contacts and track delivery.',
    icon: 'sms',
    path: '/sms',
  },
]

// First page after login. The user picks what they want to work on.
// The sidebar shows only "Home" here; the full menu appears after
// the user opens WhatsApp or SMS.
function Home() {
  const { user } = useAuth()

  return (
    // Home is the only menu item and we are already on it,
    // so clicking it has nothing to do.
    <AppShell menuItems={homeMenu} activePage="Home" onSelectPage={() => {}}>
      <h1 className="home-title">Welcome, {user.name}</h1>
      <p className="home-subtitle">Choose what you want to work on.</p>

      <div className="home-options">
        {options.map((option) => (
          <Link key={option.path} to={option.path} className="home-option">
            <span className="home-option-icon">
              <Icon name={option.icon} size={26} />
            </span>
            <span className="home-option-title">{option.title}</span>
            <span className="home-option-text">{option.description}</span>
            <span className="home-option-open">
              Open
              <Icon name="chevronRight" size={16} />
            </span>
          </Link>
        ))}
      </div>
    </AppShell>
  )
}

export default Home
