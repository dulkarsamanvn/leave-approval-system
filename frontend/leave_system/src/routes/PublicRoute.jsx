import React from 'react'
import { Navigate } from 'react-router-dom'

function PublicRoute({ children }) {
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    const role = localStorage.getItem('role')

    if (isAuthenticated === 'true') {
        if (role === 'manager') return <Navigate to='/manager-dashboard' replace />
        if (role === 'employee') return <Navigate to='/employee-dashboard' replace />
    }

    return children
}

export default PublicRoute
