import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { LanguageProvider } from './content/Language'
import { App } from './app/App'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
