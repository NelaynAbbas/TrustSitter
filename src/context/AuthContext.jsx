"use client"

import { createContext, useState, useEffect, useContext } from "react"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token")
      const userData = localStorage.getItem("user")

      if (token && userData) {
        try {
          // Verify token by making a profile request
          const response = await fetch("http://localhost:5000/api/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const profileData = await response.json()
            setCurrentUser(profileData)
          } else {
            // If token is invalid or expired, clear storage
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            setCurrentUser(null)
          }
        } catch (e) {
          console.error("Error verifying token", e)
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          setCurrentUser(null)
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      setCurrentUser(data.user)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      setCurrentUser(data.user)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setCurrentUser(null)
  }

  const updateProfile = async (profileData) => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Not authenticated")
      }

      const response = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile")
      }

      // Update local user data
      const updatedUser = { ...currentUser, ...profileData }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setCurrentUser(updatedUser)

      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Not authenticated")
      }

      const response = await fetch("http://localhost:5000/api/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch profile")
      }

      // Update local storage and state
      localStorage.setItem("user", JSON.stringify(data))
      setCurrentUser(data)

      return data
    } catch (err) {
      if (err.message === "Token has expired") {
        // Clear storage and state if token expired
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setCurrentUser(null)
      }
      setError(err.message)
      throw err
    }
  }

  const requestVerification = async () => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Not authenticated")
      }

      const response = await fetch("http://localhost:5000/api/sitter/request-verification", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to request verification")
      }

      // Update local user data to show verification requested
      const updatedUser = {
        ...currentUser,
        verificationRequested: true,
      }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setCurrentUser(updatedUser)

      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    getProfile,
    requestVerification,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

