import { useState, useEffect } from 'react'
import { projectService } from '../services/firebase'
import useAuth from './useAuth'

/**
 * 📁 HOOK PERSONALIZADO PARA PROYECTOS - COMPLETADO
 * 📍 Maneja el estado y operaciones CRUD completas de proyectos
 */
export function useProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  /**
   * 📥 Cargar proyectos del usuario
   */
  const loadProjects = async () => {
    if (!user) return
    
    setLoading(true)
    setError(null)
    
    try {
      const userProjects = await projectService.getUserProjects(user.uid)
      setProjects(userProjects)
    } catch (err) {
      setError('Error al cargar proyectos: ' + err.message)
      console.error('Error loading projects:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * ➕ Crear nuevo proyecto
   */
  const createProject = async (projectData) => {
    if (!user) throw new Error('Usuario no autenticado')
    
    setLoading(true)
    try {
      const newProject = await projectService.createProject(projectData, user.uid)
      setProjects(prev => [newProject, ...prev])
      return newProject
    } catch (err) {
      setError('Error al crear proyecto: ' + err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * 🗑️ Eliminar proyecto
   */
  const deleteProject = async (projectId) => {
    if (!user) throw new Error('Usuario no autenticado')
    
    setLoading(true)
    try {
      await projectService.deleteProject(projectId, user.uid)
      // Actualizar lista localmente
      setProjects(prev => prev.filter(project => project.id !== projectId))
    } catch (err) {
      setError('Error al eliminar proyecto: ' + err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * 📋 Duplicar proyecto
   */
  const duplicateProject = async (projectId, newName = '') => {
    if (!user) throw new Error('Usuario no autenticado')
    
    setLoading(true)
    try {
      const duplicatedProject = await projectService.duplicateProject(projectId, user.uid, newName)
      setProjects(prev => [duplicatedProject, ...prev])
      return duplicatedProject
    } catch (err) {
      setError('Error al duplicar proyecto: ' + err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * ✏️ Actualizar proyecto existente
   */
  const updateProject = async (projectId, updates) => {
    if (!user) throw new Error('Usuario no autenticado')
    
    setLoading(true)
    try {
      const updatedProject = await projectService.updateProject(projectId, updates, user.uid)
      // Actualizar en la lista local
      setProjects(prev => prev.map(project => 
        project.id === projectId ? { ...project, ...updates, updatedAt: new Date() } : project
      ))
      return updatedProject
    } catch (err) {
      setError('Error al actualizar proyecto: ' + err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * 📄 Obtener proyecto específico
   */
  const getProject = async (projectId) => {
    if (!user) throw new Error('Usuario no autenticado')
    
    setLoading(true)
    try {
      const project = await projectService.getProject(projectId, user.uid)
      return project
    } catch (err) {
      setError('Error al cargar proyecto: ' + err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * 🔍 Buscar proyectos
   */
  const searchProjects = async (searchTerm) => {
    if (!user) throw new Error('Usuario no autenticado')
    
    setLoading(true)
    try {
      const results = await projectService.searchProjects(user.uid, searchTerm)
      return results
    } catch (err) {
      setError('Error al buscar proyectos: ' + err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Cargar proyectos cuando el usuario cambie
  useEffect(() => {
    loadProjects()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return {
    // Estado
    projects,
    loading,
    error,
    
    // Operaciones CRUD
    createProject,
    deleteProject,
    duplicateProject,
    updateProject,
    getProject,
    searchProjects,
    
    // Utilidades
    refreshProjects: loadProjects,
    clearError: () => setError(null)
  }
}