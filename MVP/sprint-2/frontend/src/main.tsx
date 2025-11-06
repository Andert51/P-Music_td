import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster 
      position="top-center"
      toastOptions={{
        style: {
          background: '#3c3836',
          color: '#ebdbb2',
          border: '1px solid #504945',
        },
        success: {
          iconTheme: {
            primary: '#b8bb26',
            secondary: '#282828',
          },
        },
        error: {
          iconTheme: {
            primary: '#fb4934',
            secondary: '#282828',
          },
        },
      }}
    />
  </React.StrictMode>,
)
