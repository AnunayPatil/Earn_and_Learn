// src/context/AuthContext.js
"use client"

import { createContext, useState, useEffect, useContext } from "react"
import axios from "axios"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkLoggedIn = async () => {
      const storedToken = localStorage.getItem("token")

      if (!storedToken) {
        setLoading(false)
        return
      }

      try {
        const res = await axios.get("https://earn-and-learn-backend.onrender.com/api/auth/me", {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        setUser(res.data)
        setToken(storedToken)
      } catch (error) {
        console.error("Token validation failed:", error)
        localStorage.removeItem("token")
        setUser(null)
        setToken(null)
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  const login = async (email, password) => {
    const res = await axios.post("https://earn-and-learn-backend.onrender.com/api/auth/login", {
      email,
      password,
    })
    const { token, user } = res.data
    localStorage.setItem("token", token)
    setToken(token)
    setUser(user)
    return user
  }

  const register = async (email, password, role) => {
    const res = await axios.post("https://earn-and-learn-backend.onrender.com/api/auth/register", {
      email,
      password,
      role,
    })
    const { token, user } = res.data
    localStorage.setItem("token", token)
    setToken(token)
    setUser(user)
    return user
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
  }

  const contextValue = {
    token,
    user,
    loading,
    login,
    register,
    logout,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
