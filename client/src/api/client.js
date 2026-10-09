import { API_URL } from '../config.js'

// All calls to the backend go through this file, so the login token is
// added in one place only.

// Name under which the login token is saved in the browser
const TOKEN_KEY = 'reaplift_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

// Runs when the backend says the token is no longer valid (for example it
// expired). AuthProvider sets this to "log the user out".
let onSessionExpired = () => {}

export function setOnSessionExpired(handler) {
  onSessionExpired = handler
}

// Calls the backend and returns the JSON answer.
// path    = for example '/api/auth/login'
// options = { method: 'POST', body: { ... } }  (both are optional)
// If the backend answers with an error, this throws an Error whose
// message can be shown to the user.
export async function apiRequest(path, options = {}) {
  const token = getToken()

  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response
  try {
    response = await fetch(API_URL + path, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    })
  } catch {
    throw new Error('Cannot reach the server. Please try again in a moment.')
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    if (response.status === 401 && token) {
      onSessionExpired()
    }

    const error = new Error(
      data.error || 'Something went wrong. Please try again.',
    )
    error.status = response.status
    throw error
  }

  return data
}
