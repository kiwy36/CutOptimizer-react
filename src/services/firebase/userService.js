/**
 * 👤 USER SERVICE - Servicio para gestión de usuarios en Firestore
 * 
 * 📍 FUNCIÓN:
 * - Maneja la creación y gestión de perfiles de usuario
 * - Crea espacios de trabajo automáticamente al registrar usuario
 * - Gestiona metadatos y preferencias de usuario
 * - Proporciona operaciones CRUD para usuarios
 */

import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from './config'

// =============================================================================
// CONSTANTES Y CONFIGURACIÓN
// =============================================================================

/**
 * 📋 Nombres de colecciones en Firestore
 */
const COLLECTIONS = {
  USERS: 'users',
  WORKSPACES: 'workspaces'
}

/**
 * 🎯 Estructura de datos de un usuario
 */
const USER_SCHEMA = {
  email: '',
  displayName: '',
  photoURL: '',
  createdAt: null,
  updatedAt: null,
  lastLoginAt: null,
  preferences: {
    language: 'es',
    theme: 'light',
    defaultSheetSize: {
      width: 2440,
      height: 1220
    },
    allowRotation: true,
    algorithm: 'shelf'
  },
  stats: {
    totalProjects: 0,
    totalSheets: 0,
    totalPieces: 0,
    totalMaterialSaved: 0, // en mm²
    averageEfficiency: 0
  },
  isActive: true
}

/**
 * 🏢 Estructura de datos de un workspace
 */
const WORKSPACE_SCHEMA = {
  name: 'Mi Espacio de Trabajo',
  ownerId: '',
  members: [], // Array de { userId, role, joinedAt }
  createdAt: null,
  updatedAt: null,
  settings: {
    maxProjects: 100,
    maxSheetsPerProject: 50,
    allowedFileTypes: ['json', 'csv']
  },
  isActive: true
}

// =============================================================================
// OPERACIONES CRUD - USUARIOS
// =============================================================================

/**
 * ➕ CREAR PERFIL DE USUARIO
 * 
 * @param {Object} user - Objeto usuario de Firebase Auth
 * @param {Object} additionalData - Datos adicionales del perfil
 * @returns {Promise<Object>} Perfil de usuario creado
 */
export const createUserProfile = async (user, additionalData = {}) => {
  try {
    if (!user || !user.uid) {
      throw new Error('Usuario no válido para crear perfil')
    }

    // Verificar si el usuario ya existe
    const userRef = doc(db, COLLECTIONS.USERS, user.uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      console.log('✅ Perfil de usuario ya existe:', user.uid)
      return {
        id: user.uid,
        ...userSnap.data()
      }
    }

    // Crear perfil de usuario
    const userProfile = {
      ...USER_SCHEMA,
      email: user.email,
      displayName: user.displayName || additionalData.displayName || user.email.split('@')[0],
      photoURL: user.photoURL || additionalData.photoURL || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      ...additionalData
    }

    await setDoc(userRef, userProfile)

    // Crear workspace por defecto para el usuario
    await createDefaultWorkspace(user.uid)

    console.log('✅ Perfil de usuario creado exitosamente:', user.uid)
    
    return {
      id: user.uid,
      ...userProfile
    }

  } catch (error) {
    console.error('❌ Error al crear perfil de usuario:', error)
    throw new Error(`No se pudo crear el perfil de usuario: ${error.message}`)
  }
}

/**
 * 📥 OBTENER PERFIL DE USUARIO
 * 
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} Perfil del usuario
 */
export const getUserProfile = async (userId) => {
  try {
    if (!userId) {
      throw new Error('Se requiere ID de usuario')
    }

    const userRef = doc(db, COLLECTIONS.USERS, userId)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      throw new Error('Perfil de usuario no encontrado')
    }

    const userData = userSnap.data()
    
    return {
      id: userSnap.id,
      ...userData
    }

  } catch (error) {
    console.error('❌ Error al obtener perfil de usuario:', error)
    throw new Error(`No se pudo cargar el perfil de usuario: ${error.message}`)
  }
}

/**
 * ✏️ ACTUALIZAR PERFIL DE USUARIO
 * 
 * @param {string} userId - ID del usuario
 * @param {Object} updates - Campos a actualizar
 * @returns {Promise<Object>} Perfil actualizado
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    if (!userId) {
      throw new Error('Se requiere ID de usuario')
    }

    const userRef = doc(db, COLLECTIONS.USERS, userId)
    
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    }

    await updateDoc(userRef, updateData)

    console.log('✅ Perfil de usuario actualizado:', userId)
    
    // Obtener perfil actualizado
    return await getUserProfile(userId)

  } catch (error) {
    console.error('❌ Error al actualizar perfil de usuario:', error)
    throw new Error(`No se pudo actualizar el perfil: ${error.message}`)
  }
}

/**
 * 📊 ACTUALIZAR ESTADÍSTICAS DEL USUARIO
 * 
 * @param {string} userId - ID del usuario
 * @returns {Promise<void>}
 */
export const updateUserStats = async (userId) => {
  try {
    if (!userId) {
      return
    }

    // Obtener proyectos del usuario para calcular estadísticas
    const { getUserProjects } = await import('./projectService')
    const projects = await getUserProjects(userId)

    const stats = {
      totalProjects: projects.length,
      totalSheets: projects.reduce((sum, project) => sum + (project.sheets?.length || 0), 0),
      totalPieces: projects.reduce((sum, project) => sum + (project.pieces?.length || 0), 0),
      totalMaterialSaved: projects.reduce((sum, project) => {
        const projectSheets = project.sheets || []
        return sum + projectSheets.reduce((sheetSum, sheet) => 
          sheetSum + (sheet.wasteArea || 0), 0)
      }, 0),
      averageEfficiency: 0
    }

    // Calcular eficiencia promedio
    const projectsWithSheets = projects.filter(p => p.sheets && p.sheets.length > 0)
    if (projectsWithSheets.length > 0) {
      const totalEfficiency = projectsWithSheets.reduce((sum, project) => {
        const projectSheets = project.sheets || []
        const projectEfficiency = projectSheets.reduce((sheetSum, sheet) => 
          sheetSum + (sheet.efficiency || 0), 0) / projectSheets.length
        return sum + projectEfficiency
      }, 0)
      stats.averageEfficiency = totalEfficiency / projectsWithSheets.length
    }

    await updateUserProfile(userId, { stats })

  } catch (error) {
    console.error('❌ Error al actualizar estadísticas:', error)
    // No lanzar error para no interrumpir el flujo principal
  }
}

// =============================================================================
// GESTIÓN DE WORKSPACES
// =============================================================================

/**
 * 🏢 CREAR WORKSPACE POR DEFECTO
 * 
 * @param {string} userId - ID del usuario propietario
 * @returns {Promise<Object>} Workspace creado
 */
export const createDefaultWorkspace = async (userId) => {
  try {
    if (!userId) {
      throw new Error('Se requiere ID de usuario')
    }

    const workspaceId = `${userId}_default`
    const workspaceRef = doc(db, COLLECTIONS.WORKSPACES, workspaceId)

    const workspaceData = {
      ...WORKSPACE_SCHEMA,
      ownerId: userId,
      members: [{
        userId: userId,
        role: 'owner',
        joinedAt: serverTimestamp()
      }],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    await setDoc(workspaceRef, workspaceData)

    console.log('✅ Workspace por defecto creado:', workspaceId)
    
    return {
      id: workspaceId,
      ...workspaceData
    }

  } catch (error) {
    console.error('❌ Error al crear workspace por defecto:', error)
    throw new Error(`No se pudo crear el espacio de trabajo: ${error.message}`)
  }
}

/**
 * 📁 OBTENER WORKSPACE DEL USUARIO
 * 
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} Workspace del usuario
 */
export const getUserWorkspace = async (userId) => {
  try {
    if (!userId) {
      throw new Error('Se requiere ID de usuario')
    }

    const workspaceId = `${userId}_default`
    const workspaceRef = doc(db, COLLECTIONS.WORKSPACES, workspaceId)
    const workspaceSnap = await getDoc(workspaceRef)

    if (!workspaceSnap.exists()) {
      // Si no existe, crear uno por defecto
      return await createDefaultWorkspace(userId)
    }

    const workspaceData = workspaceSnap.data()
    
    return {
      id: workspaceSnap.id,
      ...workspaceData
    }

  } catch (error) {
    console.error('❌ Error al obtener workspace:', error)
    throw new Error(`No se pudo cargar el espacio de trabajo: ${error.message}`)
  }
}

// =============================================================================
// OPERACIONES DE AUTENTICACIÓN MEJORADAS
// =============================================================================

/**
 * 🔐 REGISTRO COMPLETO DE USUARIO
 * 
 * @param {string} email - Email del usuario
 * @param {string} password - Password del usuario
 * @param {Object} userData - Datos adicionales del perfil
 * @returns {Promise<Object>} Usuario registrado con perfil completo
 */
export const completeUserRegistration = async (email, password, userData = {}) => {
  try {
    const { createUserWithEmailAndPassword } = await import('firebase/auth')
    const { auth } = await import('./config')

    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Crear perfil en Firestore
    const userProfile = await createUserProfile(user, userData)

    console.log('✅ Registro de usuario completado:', user.uid)
    
    return {
      user: userCredential.user,
      profile: userProfile
    }

  } catch (error) {
    console.error('❌ Error en registro completo:', error)
    throw new Error(`Error en el registro: ${error.message}`)
  }
}

/**
 * 🔑 LOGIN COMPLETO DE USUARIO
 * 
 * @param {string} email - Email del usuario
 * @param {string} password - Password del usuario
 * @returns {Promise<Object>} Usuario logueado con perfil
 */
export const completeUserLogin = async (email, password) => {
  try {
    const { signInWithEmailAndPassword } = await import('firebase/auth')
    const { auth } = await import('./config')

    // Login en Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Actualizar último login
    const userRef = doc(db, COLLECTIONS.USERS, user.uid)
    await updateDoc(userRef, {
      lastLoginAt: serverTimestamp()
    })

    // Obtener perfil completo
    const userProfile = await getUserProfile(user.uid)

    console.log('✅ Login de usuario completado:', user.uid)
    
    return {
      user: userCredential.user,
      profile: userProfile
    }

  } catch (error) {
    console.error('❌ Error en login completo:', error)
    throw new Error(`Error en el login: ${error.message}`)
  }
}

// =============================================================================
// EXPORTACIÓN POR DEFECTO
// =============================================================================

/**
 * 📦 Exportar todas las funciones como un objeto servicio
 */
const userService = {
  // Perfiles de usuario
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  updateUserStats,
  
  // Workspaces
  createDefaultWorkspace,
  getUserWorkspace,
  
  // Autenticación mejorada
  completeUserRegistration,
  completeUserLogin
}

export default userService