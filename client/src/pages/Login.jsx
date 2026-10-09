import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import logo from '../assets/logo.png'
import { useAuth } from '../auth/AuthContext.js'
import './Login.css'

// Login page. Users log in with the user ID and password
// that the admin created for them.
function Login() {
  const { user, isCheckingLogin, login } = useAuth()
  const location = useLocation()

  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Still asking the backend if the saved login is valid
  if (isCheckingLogin) {
    return <div className="page-loading">Loading...</div>
  }

  // Already logged in (or just logged in): leave the login page.
  // Go back to the page they first asked for, if there was one.
  if (user) {
    return <Navigate to={location.state?.from || '/'} replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!userId.trim() || !password) {
      setErrorMessage('Enter your user ID and password.')
      return
    }

    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await login(userId.trim(), password)
    } catch (error) {
      setErrorMessage(error.message)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      {/* Purple brand side. Hidden on phones. */}
      <section className="login-brand">
        <h1>Reach your customers where they already are.</h1>
        <p>
          Run your WhatsApp and SMS campaigns from one place, and follow
          every message from send to delivery.
        </p>
      </section>

      <main className="login-main">
        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <img className="login-logo" src={logo} alt="ReapLift" />

          <h2 className="login-title">Log in</h2>
          <p className="login-subtitle">
            Use the user ID and password given by your admin.
          </p>

          {errorMessage && (
            <div className="alert alert-error" role="alert">
              {errorMessage}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="login-user-id">
              User ID
            </label>
            <input
              id="login-user-id"
              className="form-control"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              autoFocus
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
            <div className="login-password">
              <input
                id="login-password"
                className="form-control"
                type={isPasswordVisible ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                className="login-password-toggle"
                aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                aria-pressed={isPasswordVisible}
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Icon name={isPasswordVisible ? 'eyeOff' : 'eye'} size={18} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary login-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </button>

          <p className="login-help">
            Forgot your password? Contact your admin.
          </p>
        </form>
      </main>
    </div>
  )
}

export default Login
