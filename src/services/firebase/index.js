/**
 * 📦 BARREL EXPORTS - Exportaciones centralizadas de servicios Firebase
 * 
 * 📍 FUNCIÓN:
 * - Centraliza las exportaciones de todos los servicios Firebase
 * - Facilita los imports en otros componentes
 * - Mantiene la organización del código
 */

// Configuración y servicios base
export { auth, db, storage } from './config'

// Servicios específicos
export { default as projectService } from './projectService'

export { default as userService } from './userService' // ✅ NUEVO
// Exportar otros servicios futuros aquí
// export { default as userService } from './userService'