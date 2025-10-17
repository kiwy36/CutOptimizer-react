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

// Inicializar Firebase
const app = initializeApp(firebaseConfig)

// Inicializar Analytics (opcional, comentado por ahora)
// const analytics = getAnalytics(app)

// Inicializar y exportar servicios de Firebase
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app