import { createContext, useContext } from 'react'

// Holds the logged-in user for the whole app.
// The values are filled in by AuthProvider.jsx.
export const AuthContext = createContext(null)

// Use this in any component that needs the logged-in user:
//   const { user, login, logout } = useAuth()
export function useAuth() {
  return useContext(AuthContext)
}
