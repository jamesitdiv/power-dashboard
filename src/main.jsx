import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import Dashboard from './Dashboard.jsx'
import PasswordGate from './components/PasswordGate.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PasswordGate>
      <Dashboard />
    </PasswordGate>
  </StrictMode>
)
