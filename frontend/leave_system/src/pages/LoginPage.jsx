import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(
        'https://leave-approval-system.onrender.com/accounts/login/',
        { email, password },
        { withCredentials: true }
      )
      
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('role', res.data.role)

      toast.success('Login Successful')

      if (res.data.role === 'manager') {
        navigate('/manager-dashboard')
      }
      if (res.data.role === 'employee') {
        navigate('/employee-dashboard')
      }
    } catch (err) {
      console.error('error while logging', err)
      toast.error('Login Failed')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[rgb(47,82,73)]">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>

        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-[rgb(151,176,103)] text-white py-3 rounded-lg font-semibold hover:bg-[rgb(151,176,103)]-400 transition duration-200"
        >
          Login
        </button>
      </form>
    </div>
  )
}

export default LoginPage
