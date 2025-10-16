import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { projectService } from '../services/projectService'
import { useAuth } from '../contexts/AuthContext'
import OptimizerWorkspace from '../components/optimizer/OptimizerWorkspace'
import ProjectForm from '../components/projects/ProjectForm'
import ProjectDetails from '../components/projects/ProjectDetails'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorMessage from '../components/ui/ErrorMessage'

/**
 * ✏️ EDIT PROJECT PAGE
 * 📍 Página para editar un proyecto existente
 */
export default function EditProject() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('optimizer')

  /**
   * 📥 Cargar proyecto
   */
  useEffect(() => {
    const loadProject = async () => {
      if (!projectId || !user) return
      
      setLoading(true)
      setError(null)
      
      try {
        const projectData = await projectService.getProject(projectId)
        
        // Verificar que el proyecto pertenece al usuario
        if (projectData.userId !== user.uid) {
          setError('No tienes permisos para editar este proyecto')
          return
        }
        
        setProject(projectData)
      } catch (err) {
        setError('Error al cargar el proyecto: ' + err.message)
        console.error('Error loading project:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [projectId, user])

  /**
   * 💾 Guardar proyecto
   */
  const handleSaveProject = async () => {
    if (!project) return
    
    setSaving(true)
    setError(null)
    
    try {
      await projectService.updateProject(projectId, project)
      alert('Proyecto actualizado exitosamente!')
      navigate('/projects')
    } catch (err) {
      setError('Error al guardar el proyecto: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  /**
   * 🔄 Actualizar datos del proyecto
   */
  const handleProjectUpdate = (projectData) => {
    setProject(prev => ({ ...prev, ...projectData }))
  }

  /**
   * 🔄 Actualizar datos del optimizador
   */
  const handleOptimizerUpdate = (optimizerData) => {
    setProject(prev => ({
      ...prev,
      ...optimizerData
    }))
  }

  if (loading) {
    return <LoadingSpinner message="Cargando proyecto..." />
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage 
          message={error}
          onRetry={() => navigate('/projects')}
          retryText="Volver a proyectos"
        />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage 
          message="Proyecto no encontrado"
          onRetry={() => navigate('/projects')}
          retryText="Volver a proyectos"
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Editar Proyecto</h1>
        <p className="text-gray-600 mt-2">
          Actualiza la información y optimización de "{project.name}"
        </p>
      </div>

      {/* Pestañas */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('optimizer')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'optimizer'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🛠️ Optimizador
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'info'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            📝 Información
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'stats'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            📊 Estadísticas
          </button>
        </nav>
      </div>

      {/* Contenido de pestañas */}
      {activeTab === 'optimizer' && (
        <OptimizerWorkspace onDataUpdate={handleOptimizerUpdate} />
      )}

      {activeTab === 'info' && (
        <ProjectForm 
          projectData={project}
          onChange={handleProjectUpdate}
        />
      )}

      {activeTab === 'stats' && (
        <ProjectDetails project={project} />
      )}

      {/* Botones de acción */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={() => navigate('/projects')}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/projects')}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Ver Lista
          </button>
          
          <button
            onClick={handleSaveProject}
            disabled={saving || !project.name}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Guardando...' : '💾 Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}