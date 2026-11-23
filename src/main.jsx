import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { IN_FRAME } from './lib/frame'

// Lets the CSS hide the scrollbar when the invite runs inside the phone frame.
if (IN_FRAME) document.documentElement.classList.add('in-frame')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
