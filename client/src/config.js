// Address of the Node.js backend.
// On your computer it is http://localhost:5000.
// When the backend is hosted, set VITE_API_URL in a .env file
// (example: VITE_API_URL=https://api.example.com) and nothing else changes.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
