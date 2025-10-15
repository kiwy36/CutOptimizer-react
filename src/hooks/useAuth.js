import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

/**
 * 🔐 HOOK PERSONALIZADO PARA AUTENTICACIÓN
 * 📍 Provee acceso fácil al contexto de autenticación
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}