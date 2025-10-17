/**
 * 🎯 USE AUTH - Hook personalizado para acceso al contexto de autenticación
 * 
 * 📍 FUNCIONALIDAD:
 * - Provee acceso fácil al contexto de autenticación
 * - Evita tener que usar useContext(AuthContext) en cada componente
 * - Lanza error si se usa fuera del AuthProvider
 * 
 * 🔄 USO:
 * import useAuth from '../hooks/useAuth'
 * 
 * const { user, login, logout } = useAuth()
 * 
 * @returns {Object} Contexto de autenticación con:
 *   - user: Usuario actual o null
 *   - loading: Estado de carga
 *   - error: Mensaje de error
 *   - login: Función para iniciar sesión
 *   - register: Función para registrar usuario
 *   - logout: Función para cerrar sesión
 *   - clearError: Función para limpiar errores
 *   - isAuthenticated: Boolean que indica si está autenticado
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