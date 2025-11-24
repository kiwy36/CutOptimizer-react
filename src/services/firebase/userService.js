/**
 * 👤 USER SERVICE - Servicio para gestión de usuarios en Firestore MEJORADO
 * 
 * 📍 FUNCIÓN:
 * - Maneja la creación y gestión de perfiles de usuario
 * - Crea espacios de trabajo automáticamente al registrar usuario
 * - Gestiona metadatos y preferencias de usuario
 * - Proporciona operaciones CRUD para usuarios
 * - MEJORADO: Manejo robusto de errores y creación automática de perfiles
 */

import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  query,
  orderBy,
  getDocs,
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
  WORKSPACES: 'workspaces',
  USER_PROJECTS: 'projects' // ✅ NUEVA: Colección para proyectos de usuario
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
 * ➕ CREAR PERFIL DE USUARIO - MEJORADO
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

    console.log('🔄 Creando perfil para usuario:', user.uid)

    // Verificar si el usuario ya existe
    const userRef = doc(db, COLLECTIONS.USERS, user.uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      console.log('✅ Perfil de usuario ya existe:', user.uid)
      const existingData = userSnap.data()
      return {
        id: user.uid,
        ...existingData,
        // Actualizar datos que puedan haber cambiado
        email: user.email,
        displayName: user.displayName || additionalData.displayName || existingData.displayName,
        photoURL: user.photoURL || additionalData.photoURL || existingData.photoURL,
        updatedAt: serverTimestamp()
      }
    }

    // Crear perfil de usuario nuevo
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
 * 📥 OBTENER PERFIL DE USUARIO - MEJORADO
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
    
    console.log('✅ Perfil cargado para usuario:', userId)
    
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
 */
export const updateUserStats = async (userId) => {
  try {
    if (!userId) {
      return
    }

    // Obtener proyectos del usuario para calcular estadísticas
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
// GESTIÓN DE PROYECTOS DEL USUARIO
// =============================================================================

/**
 * 📥 OBTENER PROYECTOS DEL USUARIO - CON MANEJO MEJORADO DE FECHAS
 * 
 * @param {string} userId - ID del usuario
 * @returns {Promise<Array>} Array de proyectos del usuario
 */
export const getUserProjects = async (userId) => {
  try {
    if (!userId) {
      throw new Error('Se requiere ID de usuario para obtener proyectos')
    }

    const userProjectsRef = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.USER_PROJECTS)
    const q = query(userProjectsRef, orderBy('updatedAt', 'desc'))

    const querySnapshot = await getDocs(q)
    const projects = []

    querySnapshot.forEach((doc) => {
      const projectData = doc.data()
      
      if (!projectData.isDeleted) {
        // ✅ MANEJO MEJORADO DE FECHAS
        const createdAt = projectData.createdAt 
          ? (projectData.createdAt.toDate ? projectData.createdAt.toDate() : new Date(projectData.createdAt))
          : new Date()
        
        const updatedAt = projectData.updatedAt 
          ? (projectData.updatedAt.toDate ? projectData.updatedAt.toDate() : new Date(projectData.updatedAt))
          : new Date()

        projects.push({
          id: doc.id,
          ...projectData,
          createdAt,
          updatedAt
        })
      }
    })

    console.log(`✅ Se obtuvieron ${projects.length} proyectos del usuario ${userId}`)
    return projects

  } catch (error) {
    console.error('❌ Error al obtener proyectos del usuario:', error)
    throw new Error(`No se pudieron cargar los proyectos: ${error.message}`)
  }
}

// =============================================================================
// GESTIÓN DE WORKSPACES
// =============================================================================

/**
 * 🏢 CREAR WORKSPACE POR DEFECTO
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
 * 🔐 REGISTRO COMPLETO DE USUARIO - MEJORADO
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

    console.log('🔄 Iniciando registro para:', email)

    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    console.log('✅ Usuario creado en Auth:', user.uid)

    // Crear perfil en Firestore
    const userProfile = await createUserProfile(user, userData)

    console.log('✅ Registro de usuario completado:', user.uid)
    
    return {
      user: userCredential.user,
      profile: userProfile
    }

  } catch (error) {
    console.error('❌ Error en registro completo:', error)
    
    // MEJOR MANEJO DE ERRORES
    let errorMessage = 'Error en el registro'
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Este email ya está registrado. ¿Quieres iniciar sesión?'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'El formato del email no es válido'
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'La contraseña es demasiado débil (mínimo 6 caracteres)'
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Error de conexión. Verifica tu internet.'
    } else {
      errorMessage = `Error en el registro: ${error.message}`
    }
    
    throw new Error(errorMessage)
  }
}

/**
 * 🔑 LOGIN COMPLETO DE USUARIO - MEJORADO
 * 
 * @param {string} email - Email del usuario
 * @param {string} password - Password del usuario
 * @returns {Promise<Object>} Usuario logueado con perfil
 */
export const completeUserLogin = async (email, password) => {
  try {
    const { signInWithEmailAndPassword } = await import('firebase/auth')
    const { auth } = await import('./config')

    console.log('🔄 Iniciando login para:', email)

    // Login en Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    console.log('✅ Login exitoso en Auth:', user.uid)

    // ✅ MEJORA: Manejar caso donde el perfil no existe
    let userProfile
    try {
      userProfile = await getUserProfile(user.uid)
      console.log('✅ Perfil existente cargado:', user.uid)
    } catch {
      console.log('⚠️ Perfil no encontrado, creando uno automáticamente...')
      userProfile = await createUserProfile(user, {
        displayName: user.email.split('@')[0]
      })
    }

    // Actualizar último login
    const userRef = doc(db, COLLECTIONS.USERS, user.uid)
    await updateDoc(userRef, {
      lastLoginAt: serverTimestamp()
    })

    console.log('✅ Login de usuario completado:', user.uid)
    
    return {
      user: userCredential.user,
      profile: userProfile
    }

  } catch (error) {
    console.error('❌ Error en login completo:', error)
    
    // ✅ MEJOR MANEJO DE ERRORES
    let errorMessage = 'Error en el login'
    
    if (error.code === 'auth/invalid-credential') {
      errorMessage = 'Email o contraseña incorrectos'
    } else if (error.code === 'auth/user-not-found') {
      errorMessage = 'Usuario no encontrado. Regístrate primero.'
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Contraseña incorrecta'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'El formato del email no es válido'
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Error de conexión. Verifica tu internet.'
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Demasiados intentos fallidos. Intenta más tarde.'
    } else {
      errorMessage = `Error en el login: ${error.message}`
    }
    
    throw new Error(errorMessage)
  }
}

// =============================================================================
// FUNCIONES UTILITARIAS ADICIONALES
// =============================================================================


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
  
  // Gestión de proyectos
  getUserProjects, // ✅ NUEVA: Función para obtener proyectos
  
  // Workspaces
  createDefaultWorkspace,
  getUserWorkspace,
  
  // Autenticación mejorada
  completeUserRegistration,
  completeUserLogin,
}

export default userService