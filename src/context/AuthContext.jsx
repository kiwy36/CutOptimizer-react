/**
 * 🔐 AUTH CONTEXT - Contexto de autenticación global
 * 
 * 📍 FUNCIÓN:
 * - Solo contiene el componente AuthProvider
 * - Cumple con las reglas de Fast Refresh (solo exporta componentes)
 * - Maneja el estado global de autenticación
 */

import React, { createContext, useState, useEffect } from 'react'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../services/firebase/config'

// Crear contexto - NO lo exportamos aquí
const AuthContext = createContext()

/**
 * 🎯 AuthProvider - Proveedor del contexto de autenticación
 */
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const login = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      setUser(userCredential.user)
      return userCredential
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      setUser(userCredential.user)
      return userCredential
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      setError(null)
      await signOut(auth)
      setUser(null)
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Exportar SOLO el componente (para cumplir con Fast Refresh)
export default AuthProvider
// Exportar el contexto para uso en hooks (pero NO es el export principal)
export { AuthContext }