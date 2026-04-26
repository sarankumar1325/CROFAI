import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/typography.css'
import { ThemeProvider } from './contexts/ThemeContext.tsx'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
)