import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {HeroUIProvider} from "@heroui/react"

import { Amplify } from 'aws-amplify'
import config from './amplifyconfiguration.json'

import '@aws-amplify/ui-react/styles.css'

Amplify.configure(config)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HeroUIProvider>
      <main className='dark text-foreground bg-background'>
        <App />
      </main>
    </HeroUIProvider>
  </StrictMode>,
)
