/**
 * 🎯 USE AUTH - Hook personalizado para acceso al contexto de autenticación MEJORADO
 * 
 * 📍 FUNCIONALIDAD:
 * - Provee acceso al contexto de autenticación con perfil extendido
 * - Incluye funciones para gestión de perfil y estadísticas
 * - Maneja usuario básico y perfil extendido de Firestore
 * 
 * 🔄 USO:
 * import useAuth from '../hooks/useAuth'
 * 
 * const { user, userProfile, login, register, updateProfile } = useAuth()
 * 
 * @returns {Object} Contexto de autenticación mejorado
 */

import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  
  return context
}

export default useAuth