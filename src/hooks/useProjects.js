import { useState, useEffect } from 'react'
import { projectService } from '../services/projectService'
import { useAuth } from './useAuth'

/**
 * 📁 HOOK PERSONALIZADO PARA PROYECTOS
 * 📍 Maneja el estado y operaciones de proyectos
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

  // Cargar proyectos cuando el usuario cambie
  useEffect(() => {
    loadProjects()
  }, [user])

  return {
    projects,
    loading,
    error,
    createProject,
    refreshProjects: loadProjects
  }
}