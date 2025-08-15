import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import { Toaster } from 'react-hot-toast'
import ManagerDashboard from './pages/ManagerDashboard'
import EmployeeDashboard from './pages/EmployeeDashboard'

function App() {
  return (
    <Router>
      <Toaster/>
      <Routes>
        <Route path='/' element={<Navigate to='/login' replace />} />
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/manager-dashboard' element={<ManagerDashboard/>}/>
        <Route path='/employee-dashboard' element={<EmployeeDashboard/>}/>
      </Routes>
    </Router>
  )
}

export default App
