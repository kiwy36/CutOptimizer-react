/**
 * 🔧 AUTH CONTEXT INSTANCE - Instancia del contexto de autenticación
 * 
 * 📍 FUNCIÓN:
 * - Exporta solo la instancia del contexto para uso en hooks
 * - Separa completamente el contexto del componente provider
 * - Cumple con las reglas de Fast Refresh
 * 
 * 🔄 USO:
 * import { AuthContext } from '../context/AuthContextInstance'
 */

import { createContext } from 'react'

// Crear y exportar solo la instancia del contexto
export const AuthContext = createContext()