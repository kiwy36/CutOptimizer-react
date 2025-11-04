/**
 * 🔐 AUTH CONTEXT - Contexto de autenticación global MEJORADO
 * 
 * 📍 FUNCIÓN:
 * - Maneja autenticación integrada con perfiles de usuario
 * - Crea automáticamente workspace al registrar usuario
 * - Gestiona estado global de usuario y perfil
 * - Sincroniza con Firestore para datos extendidos
 */

import React, { createContext, useState, useEffect } from 'react'
import { 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth' // ✅ REMOVIDOS los imports no usados
import { auth } from '../services/firebase/config'
import { userService } from '../services/firebase'

// Crear contexto - NO lo exportamos aquí
const AuthContext = createContext()

/**
 * 🎯 AuthProvider - Proveedor del contexto de autenticación MEJORADO
 */
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /**
   * 🔑 LOGIN MEJORADO - Con gestión de perfil
   */
  const login = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      // Login completo con perfil
      const result = await userService.completeUserLogin(email, password)
      
      setUser(result.user)
      setUserProfile(result.profile)
      
      console.log('✅ Usuario logueado con perfil:', result.user.uid)
      return result

    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  /**
   * 📝 REGISTRO MEJORADO - Con creación de perfil y workspace
   */
  const register = async (email, password, userData = {}) => {
    try {
      setLoading(true)
      setError(null)
      
      // Registro completo con perfil y workspace
      const result = await userService.completeUserRegistration(email, password, userData)
      
      setUser(result.user)
      setUserProfile(result.profile)
      
      console.log('✅ Usuario registrado con perfil y workspace:', result.user.uid)
      return result

    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  /**
   * 🚪 LOGOUT MEJORADO
   */
  const logout = async () => {
    try {
      setLoading(true)
      setError(null)
      await signOut(auth)
      setUser(null)
      setUserProfile(null)
      console.log('✅ Usuario deslogueado')
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  /**
   * ✏️ ACTUALIZAR PERFIL DE USUARIO
   */
  const updateProfile = async (updates) => {
    try {
      if (!user) {
        throw new Error('Usuario no autenticado')
      }

      const updatedProfile = await userService.updateUserProfile(user.uid, updates)
      setUserProfile(updatedProfile)
      
      console.log('✅ Perfil actualizado:', user.uid)
      return updatedProfile

    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  /**
   * 📊 ACTUALIZAR ESTADÍSTICAS DEL USUARIO
   */
  const updateUserStats = async () => {
    try {
      if (!user) return
      
      await userService.updateUserStats(user.uid)
      // Recargar perfil para obtener estadísticas actualizadas
      const refreshedProfile = await userService.getUserProfile(user.uid)
      setUserProfile(refreshedProfile)
      
    } catch (error) {
      console.error('Error al actualizar estadísticas:', error)
      // No interrumpir el flujo por errores de estadísticas
    }
  }

  const clearError = () => {
    setError(null)
  }

  /**
   * 👂 OBSERVADOR DE ESTADO DE AUTENTICACIÓN MEJORADO
   */
  useEffect(() => {
    console.log('🚀 Inicializando conexión con Firebase...') // ✅ CONSOLE.LOG DE CONEXIÓN
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('📡 Estado de autenticación cambiado:', user ? `Usuario: ${user.uid}` : 'No autenticado')
      
      if (user) {
        setUser(user)
        
        try {
          // Cargar perfil del usuario desde Firestore
          const profile = await userService.getUserProfile(user.uid)
          setUserProfile(profile)
          console.log('✅ Perfil de usuario cargado:', user.uid)
        } catch (error) {
          console.error('❌ Error al cargar perfil de usuario:', error)
          // Si hay error cargando el perfil, mantener usuario básico
          setUserProfile(null)
        }
        
      } else {
        setUser(null)
        setUserProfile(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    // Estado
    user,
    userProfile,
    loading,
    error,
    
    // Autenticación
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user,
    
    // Perfil extendido
    updateProfile,
    updateUserStats
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