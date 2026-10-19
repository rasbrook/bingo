import { useState } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Bingo from './pages/bingo'
import { useAuthStore } from './store/authstore'
import { maincolor } from './constant/colors'

import Header from './pages/header/header'
import SignIn from './pages/signin'
import Signup from './pages/signup'


function App() {
  const { isAuthenticated } = useAuthStore()


  return (
    <BrowserRouter >
      {isAuthenticated && (
        <Header
          name='Lucky bet'
          CompanyColor={maincolor}
          pages={['Bingo', 'Profile']} />
      )}
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/" element={<SignIn />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Home />} />

            <Route path="/bingo" element={<Bingo />} />
            {/* <Route path="/Keno" element={<Keno />} />
            <Route path="/Aviator" element={<Aviator />} />
            <Route path="/aviator" element={<Aviator />} />
            <Route path="/blackjack" element={<Blackjack />} />
            <Route path="/luckychicken" element={<LuckyChicken />} />
            <Route path="/plinko" element={<Plinko />} />*/}
          </>
        )}
      </Routes>
    </BrowserRouter>
  )
}

export default App
