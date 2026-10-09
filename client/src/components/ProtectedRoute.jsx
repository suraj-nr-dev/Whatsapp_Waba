import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.js'

// Pages placed inside this route open only for a logged-in user.
// Everyone else is sent to the login page.
function ProtectedRoute() {
  const { user, isCheckingLogin } = useAuth()
  const location = useLocation()

  // Still asking the backend if the saved login is valid
  if (isCheckingLogin) {
    return <div className="page-loading">Loading...</div>
  }

  if (!user) {
    // Remember the page they wanted, so login can send them back to it
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export default ProtectedRoute
