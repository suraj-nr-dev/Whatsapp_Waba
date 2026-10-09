import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import WhatsappLayout from './layouts/WhatsappLayout.jsx'
import SmsLayout from './layouts/SmsLayout.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import './App.css'

// The list of pages (routes) in the app.
function App() {
  return (
    <Routes>
      {/* Open for everyone */}
      <Route path="/login" element={<Login />} />

      {/* Everything inside here needs a login */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/whatsapp/*" element={<WhatsappLayout />} />
        <Route path="/sms/*" element={<SmsLayout />} />

        {/* Any other address goes to Home */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>
    </Routes>
  )
}

export default App
