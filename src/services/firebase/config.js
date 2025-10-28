/**
 * 🔥 FIREBASE CONFIGURATION - Configuración y inicialización de Firebase
 * 
 * 📍 FUNCIÓN:
 * - Configura e inicializa Firebase con las credenciales del proyecto
 * - Exporta los servicios de Firebase para usar en toda la aplicación
 * - Centraliza la configuración en un solo lugar
 * 
 * 🔧 SERVICIOS INICIALIZADOS:
 * - Auth: Autenticación de usuarios
 * - Firestore: Base de datos para proyectos
 * - Storage: Almacenamiento de archivos (futuro)
 */

import { initializeApp } from 'firebase/app'
// import { getAnalytics } from 'firebase/analytics' // Comentado por ahora
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Configuración de Firebase (usando tus datos)
const firebaseConfig = {
  apiKey: "AIzaSyBcwEbWfgcxHYb6rb-RojkJUWsetQvwWzA",
  authDomain: "cutoptimizer-react.firebaseapp.com",
  projectId: "cutoptimizer-react",
  storageBucket: "cutoptimizer-react.firebasestorage.app",
  messagingSenderId: "596452166993",
  appId: "1:596452166993:web:2f3d4965322a3a7a4fd770",
  measurementId: "G-KE5VWGGG5S"
}

// =============================================================================
// INICIALIZACIÓN DE FIREBASE
// =============================================================================

/**
 * 🚀 Inicializar la aplicación de Firebase
 */
const app = initializeApp(firebaseConfig)

// =============================================================================
// INICIALIZACIÓN DE SERVICIOS
// =============================================================================

/**
 * 🔐 Servicio de Autenticación
 * - Manejo de usuarios: login, registro, logout
 * - Persistencia de sesión
 * - Verificación de estado de autenticación
 */
export const auth = getAuth(app)

/**
 * 🗄️ Servicio de Firestore (Base de datos)
 * - Almacenamiento de proyectos de usuarios
 * - Colecciones: projects, users, etc.
 * - Operaciones CRUD en tiempo real
 */
export const db = getFirestore(app)

/**
 * 💾 Servicio de Storage (Almacenamiento de archivos)
 * - Futura implementación para imágenes o archivos
 * - Backup de proyectos
 */
export const storage = getStorage(app)

// =============================================================================
// CONFIGURACIONES ADICIONALES
// =============================================================================

/**
 * 📊 Analytics (Opcional - Comentado por ahora)
 * - Seguimiento de uso de la aplicación
 * - Métricas y estadísticas
 */
// export const analytics = getAnalytics(app)

// =============================================================================
// EXPORTACIÓN POR DEFECTO
// =============================================================================

/**
 * 📦 Exportación por defecto de la aplicación Firebase
 * - Útil para casos donde se necesita la instancia completa
 * - La mayoría de casos usarán los servicios individuales (auth, db, storage)
 */
export default app