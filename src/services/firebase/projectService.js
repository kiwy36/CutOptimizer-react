/**
 * 🗄️ PROJECT SERVICE - Servicio CORREGIDO con manejo de índices
 * 
 * 📍 CORRECCIONES APLICADAS:
 * - Consulta simplificada para evitar índices compuestos
 * - Mantiene funcionalidad completa
 * - Optimizado para nueva estructura de subcolecciones
 */

import { collection, doc, getDocs, getDoc, query, orderBy } from 'firebase/firestore'
import { addDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './config'

// =============================================================================
// CONSTANTES Y CONFIGURACIÓN
// =============================================================================

const COLLECTIONS = {
  USERS: 'users',
  USER_PROJECTS: 'projects'
}

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
// OPERACIONES CRUD - PROYECTOS (OPTIMIZADAS)
// =============================================================================

/**
 * ➕ CREAR NUEVO PROYECTO
 */
export const createProject = async (projectData, userId) => {
  try {
    if (!userId) {
      throw new Error('Se requiere ID de usuario para crear proyecto')
    }

    if (!projectData.name || !projectData.name.trim()) {
      throw new Error('El proyecto debe tener un nombre')
    }

    const project = {
      ...PROJECT_SCHEMA,
      ...projectData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isDeleted: false
    }

    // ✅ ESTRUCTURA SEGURA: users/{userId}/projects
    const userProjectsRef = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.USER_PROJECTS)
    const docRef = await addDoc(userProjectsRef, project)
    
    console.log('✅ Proyecto creado en subcolección usuario:', userId, docRef.id)
    
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
 * 📥 OBTENER PROYECTOS DEL USUARIO - CORREGIDO (SIN ÍNDICE COMPUESTO)
 */
export const getUserProjects = async (userId) => {
  try {
    if (!userId) {
      throw new Error('Se requiere ID de usuario para obtener proyectos')
    }

    // ✅ ESTRUCTURA SEGURA: users/{userId}/projects
    const userProjectsRef = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.USER_PROJECTS)

    // ✅ CONSULTA SIMPLIFICADA: Solo ordenamiento, filtrado se hace en cliente
    // Esto evita necesidad de índices compuestos
    const q = query(
      userProjectsRef,
      orderBy('updatedAt', 'desc')  // Solo ordenamiento - no requiere índice compuesto
    )

    const querySnapshot = await getDocs(q)
    const projects = []

    querySnapshot.forEach((doc) => {
      const projectData = doc.data()
      
      // ✅ FILTRADO EN CLIENTE: Proyectos no eliminados
      if (!projectData.isDeleted) {
        projects.push({
          id: doc.id,
          ...projectData,
          createdAt: projectData.createdAt?.toDate() || new Date(),
          updatedAt: projectData.updatedAt?.toDate() || new Date()
        })
      }
    })

    console.log(`✅ Se obtuvieron ${projects.length} proyectos del usuario ${userId}`)
    return projects

  } catch (error) {
    console.error('❌ Error al obtener proyectos del usuario:', error)
    
    // Manejo específico de error de índice
    if (error.code === 'failed-precondition') {
      throw new Error('Error de configuración de base de datos. Por favor, contacta al administrador.')
    }
    
    throw new Error(`No se pudieron cargar los proyectos: ${error.message}`)
  }
}

/**
 * 📄 OBTENER PROYECTO ESPECÍFICO
 */
export const getProject = async (projectId, userId) => {
  try {
    if (!projectId || !userId) {
      throw new Error('Se requieren ID de proyecto y usuario')
    }

    // ✅ ESTRUCTURA SEGURA: users/{userId}/projects/{projectId}
    const projectRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.USER_PROJECTS, projectId)
    const docSnap = await getDoc(projectRef)

    if (!docSnap.exists()) {
      throw new Error('El proyecto no existe')
    }

    const projectData = docSnap.data()

    // ✅ VERIFICACIÓN DE PROPIEDAD
    if (projectData.userId !== userId) {
      throw new Error('No tienes permisos para acceder a este proyecto')
    }

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
 */
export const updateProject = async (projectId, updates, userId) => {
  try {
    if (!projectId || !userId) {
      throw new Error('Se requieren ID de proyecto y usuario')
    }

    // Verificar que el proyecto existe y pertenece al usuario
    await getProject(projectId, userId)

    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    }

    // ✅ ESTRUCTURA SEGURA: users/{userId}/projects/{projectId}
    const projectRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.USER_PROJECTS, projectId)
    await updateDoc(projectRef, updateData)

    console.log('✅ Proyecto actualizado exitosamente:', projectId)
    
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
 */
export const deleteProject = async (projectId, userId) => {
  try {
    if (!projectId || !userId) {
      throw new Error('Se requieren ID de proyecto y usuario')
    }

    // Verificar que el proyecto existe y pertenece al usuario
    await getProject(projectId, userId)

    // ✅ ESTRUCTURA SEGURA: users/{userId}/projects/{projectId}
    const projectRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.USER_PROJECTS, projectId)
    
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
 */
export const duplicateProject = async (projectId, userId, newName = '') => {
  try {
    if (!projectId || !userId) {
      throw new Error('Se requieren ID de proyecto y usuario')
    }

    const originalProject = await getProject(projectId, userId)

    const duplicatedProject = {
      ...originalProject,
      name: newName || `${originalProject.name} (Copia)`,
      sheets: [], // No duplicar resultados de optimización
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isDeleted: false
    }

    delete duplicatedProject.id

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
 */
export const searchProjects = async (userId, searchTerm) => {
  try {
    if (!userId) {
      throw new Error('Se requiere ID de usuario')
    }

    if (!searchTerm) {
      return await getUserProjects(userId)
    }

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