import { useState, useEffect, useCallback } from 'react'
import { projectService } from '../services/firebase'
import useAuth from './useAuth'

/**
 * 📁 HOOK PERSONALIZADO PARA PROYECTOS - COMPLETO Y CORREGIDO
 * 📍 Maneja el estado y operaciones CRUD de proyectos
 */
export function useProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  /**
   * 📥 Cargar proyectos del usuario - USANDO useCallback
   */
  const loadProjects = useCallback(async () => {
    if (!user) {
      setProjects([])
      return
    }
    
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
  }, [user]) // ✅ user como dependencia

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
      // Filtrar proyecto eliminado del estado local
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
  const duplicateProject = async (projectId) => {
    if (!user) throw new Error('Usuario no autenticado')
    
    setLoading(true)
    try {
      const duplicatedProject = await projectService.duplicateProject(projectId, user.uid)
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
   * ✏️ Obtener proyecto específico
   */
  const getProject = async (projectId) => {
    if (!user) throw new Error('Usuario no autenticado')
    
    try {
      const project = await projectService.getProject(projectId, user.uid)
      return project
    } catch (err) {
      setError('Error al cargar proyecto: ' + err.message)
      throw err
    }
  }

  /**
   * 💾 Actualizar proyecto existente
   */
  const updateProject = async (projectId, updates) => {
    if (!user) throw new Error('Usuario no autenticado')
    
    setLoading(true)
    try {
      const updatedProject = await projectService.updateProject(projectId, updates, user.uid)
      // Actualizar proyecto en la lista
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

  // Cargar proyectos cuando el usuario cambie - CORREGIDO
  useEffect(() => {
    loadProjects()
  }, [loadProjects]) // ✅ loadProjects como dependencia (gracias a useCallback)

  return {
    projects,
    loading,
    error,
    createProject,
    deleteProject,
    duplicateProject,
    getProject,
    updateProject,
    refreshProjects: loadProjects
  }
}