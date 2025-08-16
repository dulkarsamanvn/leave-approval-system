import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import { Toaster } from 'react-hot-toast'
import ManagerDashboard from './pages/ManagerDashboard'
import EmployeeDashboard from './pages/EmployeeDashboard'
import PublicRoute from './routes/PublicRoute'
import ProtectedRoute from './routes/ProtectedRoute'

function App() {
  return (
    <Router>
      <Toaster/>
      <Routes>
        <Route path='/' element={<Navigate to='/login' replace />} />
        <Route path='/login' element={
          <PublicRoute>
            <LoginPage/>
          </PublicRoute>
          }/>
        <Route path='/manager-dashboard' element={
          <ProtectedRoute>
            <ManagerDashboard/>
          </ProtectedRoute>
          }/>
        <Route path='/employee-dashboard' element={
          <ProtectedRoute>
            <EmployeeDashboard/>
          </ProtectedRoute>
          }/>
      </Routes>
    </Router>
  )
}

export default App
