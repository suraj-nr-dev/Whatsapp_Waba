import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext.js'
import {
  apiRequest,
  getToken,
  removeToken,
  saveToken,
  setOnSessionExpired,
} from '../api/client.js'

// Wraps the whole app (see main.jsx) and remembers who is logged in.
function AuthProvider({ children }) {
  // The logged-in user. null means nobody is logged in.
  const [user, setUser] = useState(null)

  // True while we ask the backend if the saved token still works.
  // Nothing to check when there is no saved token.
  const [isCheckingLogin, setIsCheckingLogin] = useState(getToken() !== null)

  // When the page loads (or is refreshed), use the saved token to get
  // the user back, so they do not have to log in again.
  useEffect(() => {
    if (!getToken()) return

    let isCancelled = false

    apiRequest('/api/auth/me')
      .then((data) => {
        if (!isCancelled) setUser(data.user)
      })
      .catch(() => {
        // Not logged in. The login page will be shown.
      })
      .finally(() => {
        if (!isCancelled) setIsCheckingLogin(false)
      })

    return () => {
      isCancelled = true
    }
  }, [])

  // If the backend rejects the token later (for example it expired),
  // log the user out so they land on the login page.
  useEffect(() => {
    setOnSessionExpired(() => {
      removeToken()
      setUser(null)
    })
  }, [])

  // Throws an Error with a message for the user when the login fails.
  async function login(userId, password) {
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: { userId, password },
    })

    saveToken(data.token)
    setUser(data.user)
  }

  function logout() {
    removeToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isCheckingLogin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
