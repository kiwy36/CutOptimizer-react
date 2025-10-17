/**
 * 🔐 AUTH CONTEXT - Contexto de autenticación global
 * 
 * 📦 PROVEE:
 * - Estado global del usuario autenticado
 * - Funciones para login, registro y logout
 * - Estado de loading durante operaciones de auth
 * - Manejo de errores de autenticación
 * 
 * 🎯 FUNCIONALIDAD:
 * - Centraliza toda la lógica de autenticación
 * - Persiste el estado del usuario entre recargas
 * - Sincroniza con Firebase Auth
 * - Provee el contexto a toda la aplicación
 */

import React, { createContext, useState, useEffect } from 'react'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../services/firebase/config'

// Crear contexto de autenticación - NO lo exportamos aquí
const AuthContext = createContext()

/**
 * 🎯 AuthProvider - Proveedor del contexto de autenticación
 * 
 * 📍 FUNCIÓN:
 * - Envuelve la aplicación para proveer acceso al contexto de auth
 * - Maneja el estado global del usuario y loading
 * - Proporciona funciones para autenticación
 * 
 * @param {Object} children - Componentes hijos que tendrán acceso al contexto
 */
const AuthProvider = ({ children }) => {
  // Estado del usuario autenticado (null = no logueado, object = usuario)
  const [user, setUser] = useState(null)
  
  // Estado de loading durante operaciones de autenticación
  const [loading, setLoading] = useState(true)
  
  // Estado para manejar errores de autenticación
  const [error, setError] = useState(null)

  /**
   * 🔑 login - Inicia sesión con email y password
   * 
   * @param {string} email - Email del usuario
   * @param {string} password - Password del usuario
   * @returns {Promise} Promesa con el resultado del login
   */
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

  /**
   * 📝 register - Registra un nuevo usuario con email y password
   * 
   * @param {string} email - Email del nuevo usuario
   * @param {string} password - Password del nuevo usuario
   * @returns {Promise} Promesa con el resultado del registro
   */
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

  /**
   * 🚪 logout - Cierra la sesión del usuario actual
   * 
   * @returns {Promise} Promesa con el resultado del logout
   */
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

  /**
   * 🗑️ clearError - Limpia el mensaje de error actual
   */
  const clearError = () => {
    setError(null)
  }

  // Efecto para escuchar cambios en el estado de autenticación
  useEffect(() => {
    /**
     * 👂 Observador de estado de autenticación de Firebase
     * 
     * 📍 FUNCIÓN:
     * - Se ejecuta cuando el estado de autenticación cambia
     * - Actualiza el estado del usuario en el contexto
     * - Marca el loading como false cuando termina la verificación inicial
     */
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    // Cleanup: desuscribir el observador cuando el componente se desmonte
    return unsubscribe
  }, [])

  // Valor que se proveerá a través del contexto
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user // Boolean que indica si está autenticado
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Exportamos SOLO el componente AuthProvider (sin exportar AuthContext)
export default AuthProvider