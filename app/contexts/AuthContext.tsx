"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import { login as apiLogin, signup as apiSignup } from "../lib/api"

interface User {
  id: number
  username: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (username: string, password: string) => Promise<void>
  signup: (username: string, password: string, email: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setToken(storedToken)
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    const data = await apiLogin(username, password)
    const newUser = {
      id: data.user_id,
      username: data.username,
      email: data.email,
    }
    setUser(newUser)
    setToken(data.token)
    localStorage.setItem("user", JSON.stringify(newUser))
    localStorage.setItem("token", data.token)
  }

  const signup = async (username: string, password: string, email: string) => {
    const data = await apiSignup(username, password, email)
    const newUser = {
      id: data.user_id,
      username: data.username,
      email: data.email,
    }
    setUser(newUser)
    setToken(data.token)
    localStorage.setItem("user", JSON.stringify(newUser))
    localStorage.setItem("token", data.token)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

