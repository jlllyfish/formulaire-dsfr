import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Import du CSS DSFR
import '@gouvfr/dsfr/dist/dsfr.min.css'
import '@gouvfr/dsfr/dist/utility/utility.min.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)