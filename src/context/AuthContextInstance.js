/**
 * 🔧 AUTH CONTEXT INSTANCE - Instancia del contexto de autenticación
 * 
 * 📍 FUNCIÓN:
 * - Solo contiene y exporta la instancia del contexto
 * - Separa completamente el contexto del componente provider
 * - Cumple con las reglas de Fast Refresh (solo exporta no-componentes)
 * 
 * 🔄 USO:
 * import { AuthContext } from '../context/AuthContextInstance'
 */

import { createContext } from 'react'

// Crear y exportar solo la instancia del contexto
const AuthContext = createContext()

export { AuthContext }