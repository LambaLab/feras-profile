import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { profile } from './data/profileData'
import { profileHumain } from './data/profileDataHumain'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App profile={profile} />} />
        <Route path="/humain" element={<App profile={profileHumain} />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
