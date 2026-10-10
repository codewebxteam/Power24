import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Prevent mouse wheel / touchpad scroll from changing values in number inputs across the entire application
if (typeof window !== 'undefined') {
  document.addEventListener(
    'wheel',
    (e) => {
      if (e.target && e.target.tagName === 'INPUT' && e.target.type === 'number') {
        e.target.blur();
      }
      if (
        document.activeElement &&
        document.activeElement.tagName === 'INPUT' &&
        document.activeElement.type === 'number'
      ) {
        document.activeElement.blur();
      }
    },
    { passive: true }
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

