import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {BrowserRouter as Router} from "react-router-dom"
import { UserContextProvider } from './assets/context/userContext'
import './index.css'
import './assets/stylings/main.css'
import './assets/stylings/header.css'
import './assets/stylings/animations.css'
import './assets/stylings/backgroundeffects.css'
import './assets/stylings/finish.css'
import './assets/stylings/settings.css'
import './assets/stylings/credentials.css'
import './assets/stylings/sequential.css'
import './assets/stylings/detailedStats.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <Router>
        <UserContextProvider>
            <App />
        </UserContextProvider>
    </Router>
)
