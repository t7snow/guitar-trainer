import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/common/NavBar'
import Card from './components/HomePage/Card'
import Timer from './components/NotePractice/Timer'
import NoteFinder from './pages/NoteFinder/NoteFinder'
import LearnHome from './pages/Learn/LearnHome'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
function App() {

  return (
    
    <Router>
      <Navbar />
      <Routes>
        <Route path="/practice" element={<NoteFinder/>} />
        <Route path="/learn" element={<LearnHome />} />
      </Routes>
    </Router>
  );
}

export default App
