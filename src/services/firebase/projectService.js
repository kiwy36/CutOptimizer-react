/**
 * 🗄️ PROJECT SERVICE - Servicio para operaciones con proyectos en Firestore
 * 
 * 📍 FUNCIÓN:
 * - Maneja todas las operaciones CRUD para proyectos
 * - Conecta la aplicación con Firestore
 * - Proporciona métodos para crear, leer, actualizar y eliminar proyectos
 * - Gestiona la estructura de datos de proyectos
 * 
 * 🎯 OPERACIONES:
 * - createProject: Crear nuevo proyecto
 * - getUserProjects: Obtener proyectos del usuario
 * - getProject: Obtener proyecto específico
 * - updateProject: Actualizar proyecto existente
 * - deleteProject: Eliminar proyecto
 * - duplicateProject: Duplicar proyecto
 */

import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy,
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
  PROJECTS: 'projects'
}

/**
 * 🎯 Estructura de datos de un proyecto
 */
const PROJECT_SCHEMA = {
  name: '',
  sheetConfig: {
    width: 2440,
    height: 1220
  },
  pieces: [],
  sheets: [],
  userId: '',
  createdAt: null,
  updatedAt: null,
  isDeleted: false
}

// =============================================================================
// OPERACIONES CRUD - PROYECTOS
// =============================================================================

/**
 * ➕ CREAR NUEVO PROYECTO
 * 
 * @param {Object} projectData - Datos del proyecto a crear
 * @param {string} userId - ID del usuario propietario
 * @returns {Promise<Object>} Proyecto creado con ID
 */
export const createProject = async (projectData, userId) => {
  try {
    // Validar datos requeridos
    if (!userId) {
      throw new Error('Se requiere ID de usuario para crear proyecto')
    }

    if (!projectData.name || !projectData.name.trim()) {
      throw new Error('El proyecto debe tener un nombre')
    }

    // Preparar datos del proyecto
    const project = {
      ...PROJECT_SCHEMA,
      ...projectData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isDeleted: false
    }

    // Crear documento en Firestore
    const docRef = await addDoc(collection(db, COLLECTIONS.PROJECTS), project)
    
    console.log('✅ Proyecto creado exitosamente:', docRef.id)
    
    // Retornar proyecto con ID
    return {
      id: docRef.id,
      ...project,
      createdAt: new Date(),
      updatedAt: new Date()
    }

  } catch (error) {
    console.error('❌ Error al crear proyecto:', error)
    throw new Error(`No se pudo crear el proyecto: ${error.message}`)
  }
}

/**
 * 📥 OBTENER PROYECTOS DEL USUARIO
 * 
 * @param {string} userId - ID del usuario
 * @returns {Promise<Array>} Lista de proyectos del usuario
 */
export const getUserProjects = async (userId) => {
  try {
    if (!userId) {
      throw new Error('Se requiere ID de usuario para obtener proyectos')
    }

    // Consultar proyectos del usuario, ordenados por fecha de actualización
    const q = query(
      collection(db, COLLECTIONS.PROJECTS),
      where('userId', '==', userId),
      where('isDeleted', '==', false),
      orderBy('updatedAt', 'desc')
    )

    const querySnapshot = await getDocs(q)
    const projects = []

    querySnapshot.forEach((doc) => {
      const projectData = doc.data()
      projects.push({
        id: doc.id,
        ...projectData,
        // Convertir timestamps de Firestore a Date objects
        createdAt: projectData.createdAt?.toDate() || new Date(),
        updatedAt: projectData.updatedAt?.toDate() || new Date()
      })
    })

    console.log(`✅ Se obtuvieron ${projects.length} proyectos para el usuario ${userId}`)
    return projects

  } catch (error) {
    console.error('❌ Error al obtener proyectos del usuario:', error)
    throw new Error(`No se pudieron cargar los proyectos: ${error.message}`)
  }
}

/**
 * 📄 OBTENER PROYECTO ESPECÍFICO
 * 
 * @param {string} projectId - ID del proyecto
 * @param {string} userId - ID del usuario (para seguridad)
 * @returns {Promise<Object>} Proyecto solicitado
 */
export const getProject = async (projectId, userId) => {
  try {
    if (!projectId || !userId) {
      throw new Error('Se requieren ID de proyecto y usuario')
    }

    const docRef = doc(db, COLLECTIONS.PROJECTS, projectId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      throw new Error('El proyecto no existe')
    }

    const projectData = docSnap.data()

    // Verificar que el usuario sea el propietario
    if (projectData.userId !== userId) {
      throw new Error('No tienes permisos para acceder a este proyecto')
    }

    // Verificar que no esté eliminado
    if (projectData.isDeleted) {
      throw new Error('Este proyecto ha sido eliminado')
    }

    const project = {
      id: docSnap.id,
      ...projectData,
      createdAt: projectData.createdAt?.toDate() || new Date(),
      updatedAt: projectData.updatedAt?.toDate() || new Date()
    }

    console.log('✅ Proyecto obtenido exitosamente:', projectId)
    return project

  } catch (error) {
    console.error('❌ Error al obtener proyecto:', error)
    throw new Error(`No se pudo cargar el proyecto: ${error.message}`)
  }
}

/**
 * ✏️ ACTUALIZAR PROYECTO EXISTENTE
 * 
 * @param {string} projectId - ID del proyecto a actualizar
 * @param {Object} updates - Campos a actualizar
 * @param {string} userId - ID del usuario (para seguridad)
 * @returns {Promise<Object>} Proyecto actualizado
 */
export const updateProject = async (projectId, updates, userId) => {
  try {
    if (!projectId || !userId) {
      throw new Error('Se requieren ID de proyecto y usuario')
    }

    // Primero verificar que el proyecto existe y pertenece al usuario
    await getProject(projectId, userId)

    // Preparar datos de actualización
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    }

    // Actualizar en Firestore
    const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId)
    await updateDoc(projectRef, updateData)

    console.log('✅ Proyecto actualizado exitosamente:', projectId)
    
    // Retornar proyecto actualizado (simulado)
    return {
      id: projectId,
      ...updateData,
      updatedAt: new Date()
    }

  } catch (error) {
    console.error('❌ Error al actualizar proyecto:', error)
    throw new Error(`No se pudo actualizar el proyecto: ${error.message}`)
  }
}

/**
 * 🗑️ ELIMINAR PROYECTO (Borrado lógico)
 * 
 * @param {string} projectId - ID del proyecto a eliminar
 * @param {string} userId - ID del usuario (para seguridad)
 * @returns {Promise<void>}
 */
export const deleteProject = async (projectId, userId) => {
  try {
    if (!projectId || !userId) {
      throw new Error('Se requieren ID de proyecto y usuario')
    }

    // Verificar que el proyecto existe y pertenece al usuario
    await getProject(projectId, userId)

    // Borrado lógico (marcar como eliminado)
    const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId)
    await updateDoc(projectRef, {
      isDeleted: true,
      updatedAt: serverTimestamp()
    })

    console.log('✅ Proyecto eliminado exitosamente:', projectId)

  } catch (error) {
    console.error('❌ Error al eliminar proyecto:', error)
    throw new Error(`No se pudo eliminar el proyecto: ${error.message}`)
  }
}

/**
 * 📋 DUPLICAR PROYECTO
 * 
 * @param {string} projectId - ID del proyecto a duplicar
 * @param {string} userId - ID del usuario
 * @param {string} newName - Nombre para el proyecto duplicado
 * @returns {Promise<Object>} Nuevo proyecto duplicado
 */
export const duplicateProject = async (projectId, userId, newName = '') => {
  try {
    if (!projectId || !userId) {
      throw new Error('Se requieren ID de proyecto y usuario')
    }

    // Obtener proyecto original
    const originalProject = await getProject(projectId, userId)

    // Preparar datos del nuevo proyecto
    const duplicatedProject = {
      ...originalProject,
      name: newName || `${originalProject.name} (Copia)`,
      sheets: [], // No duplicar resultados de optimización
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isDeleted: false
    }

    // Remover ID del original
    delete duplicatedProject.id

    // Crear nuevo proyecto
    const newProject = await createProject(duplicatedProject, userId)
    
    console.log('✅ Proyecto duplicado exitosamente:', newProject.id)
    return newProject

  } catch (error) {
    console.error('❌ Error al duplicar proyecto:', error)
    throw new Error(`No se pudo duplicar el proyecto: ${error.message}`)
  }
}

// =============================================================================
// OPERACIONES ESPECIALIZADAS
// =============================================================================

/**
 * 🔍 BUSCAR PROYECTOS POR NOMBRE
 * 
 * @param {string} userId - ID del usuario
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Promise<Array>} Proyectos que coinciden con la búsqueda
 */
export const searchProjects = async (userId, searchTerm) => {
  try {
    if (!userId || !searchTerm) {
      return await getUserProjects(userId)
    }

    // Obtener todos los proyectos y filtrar localmente
    // (Firestore no soporta búsqueda de texto completo en el plan gratuito)
    const allProjects = await getUserProjects(userId)
    const filteredProjects = allProjects.filter(project =>
      project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.id?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return filteredProjects

  } catch (error) {
    console.error('❌ Error al buscar proyectos:', error)
    throw new Error(`No se pudo realizar la búsqueda: ${error.message}`)
  }
}

/**
 * 📊 OBTENER ESTADÍSTICAS DE PROYECTOS
 * 
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} Estadísticas de proyectos
 */
export const getProjectStats = async (userId) => {
  try {
    const projects = await getUserProjects(userId)
    
    const stats = {
      totalProjects: projects.length,
      totalSheets: projects.reduce((sum, project) => sum + (project.sheets?.length || 0), 0),
      totalPieces: projects.reduce((sum, project) => sum + (project.pieces?.length || 0), 0),
      totalArea: projects.reduce((sum, project) => {
        const projectSheets = project.sheets || []
        return sum + projectSheets.reduce((sheetSum, sheet) => 
          sheetSum + (sheet.usedArea || 0), 0)
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

    return stats

  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error)
    throw new Error(`No se pudieron cargar las estadísticas: ${error.message}`)
  }
}

// =============================================================================
// EXPORTACIÓN POR DEFECTO
// =============================================================================

/**
 * 📦 Exportar todas las funciones como un objeto servicio
 */
const projectService = {
  createProject,
  getUserProjects,
  getProject,
  updateProject,
  deleteProject,
  duplicateProject,
  searchProjects,
  getProjectStats
}

export default projectService