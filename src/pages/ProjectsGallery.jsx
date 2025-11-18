/**
 * 📁 PROJECTS GALLERY - COMPLETADO con integración Firestore
 * 
 * 📍 FUNCIÓN:
 * - Muestra todos los proyectos guardados del usuario actual
 * - Grid de tarjetas de proyectos con información básica
 * - Funcionalidad de búsqueda, eliminación y duplicación
 * - Integración completa con Firestore
 */

import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useProjects } from '../hooks/useProjects'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import ErrorMessage from '../components/shared/ErrorMessage'
import Card from '../components/shared/Card'
import './ProjectsGallery.css'

const ProjectsGallery = () => {
  const { 
    projects, 
    loading, 
    error, 
    deleteProject, 
    duplicateProject, 
    refreshProjects,
    clearError 
  } = useProjects()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('updatedAt')
  const [processingAction, setProcessingAction] = useState(null) // Para tracking de acciones

  /**
   * 🔍 Filtra y ordena los proyectos
   */
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects
    
    // Aplicar filtro de búsqueda
    if (searchTerm) {
      filtered = projects.filter(project =>
        project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.id?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name?.localeCompare(b.name)
        case 'createdAt':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'updatedAt':
        default:
          return new Date(b.updatedAt) - new Date(a.createdAt)
      }
    })
    
    return filtered
  }, [projects, searchTerm, sortBy])

  /**
   * 📊 Calcula estadísticas de los proyectos
   */
  const projectStats = useMemo(() => {
    const totalProjects = projects.length
    const totalSheets = projects.reduce((sum, project) => 
      sum + (project.sheets?.length || 0), 0)
    const totalPieces = projects.reduce((sum, project) => 
      sum + (project.pieces?.length || 0), 0)
    
    return { totalProjects, totalSheets, totalPieces }
  }, [projects])

  /**
   * 🗑️ Maneja la eliminación de un proyecto - IMPLEMENTADO CON FIRESTORE
   */
  const handleDeleteProject = async (projectId, projectName) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar el proyecto "${projectName}"?\nEsta acción no se puede deshacer.`)) {
      return
    }

    setProcessingAction(`deleting-${projectId}`)
    clearError()

    try {
      await deleteProject(projectId)
      // La lista se actualiza automáticamente a través del hook
      console.log('✅ Proyecto eliminado exitosamente')
    } catch (error) {
      console.error('❌ Error al eliminar proyecto:', error)
      // El error se maneja en el hook useProjects
    } finally {
      setProcessingAction(null)
    }
  }

  /**
   * 📋 Maneja la duplicación de un proyecto - IMPLEMENTADO CON FIRESTORE
   */
  const handleDuplicateProject = async (projectId, projectName) => {
    const newName = prompt(
      'Ingresa un nombre para la copia del proyecto:',
      `${projectName} (Copia)`
    )

    if (!newName || newName.trim() === '') return

    setProcessingAction(`duplicating-${projectId}`)
    clearError()

    try {
      await duplicateProject(projectId, newName.trim())
      console.log('✅ Proyecto duplicado exitosamente')
    } catch (error) {
      console.error('❌ Error al duplicar proyecto:', error)
    } finally {
      setProcessingAction(null)
    }
  }

  /**
   * 📅 Formatea la fecha para mostrar
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Ayer'
    if (diffDays < 7) return `Hace ${diffDays} días`
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  /**
   * 🎯 Obtiene la eficiencia promedio de un proyecto
   */
  const getProjectEfficiency = (project) => {
    if (!project.sheets || project.sheets.length === 0) return 0
    
    const totalEfficiency = project.sheets.reduce((sum, sheet) => 
      sum + (sheet.efficiency || 0), 0)
    return totalEfficiency / project.sheets.length
  }

  /**
   * 🎨 Obtiene la clase CSS para el indicador de eficiencia
   */
  const getEfficiencyClass = (efficiency) => {
    if (efficiency >= 85) return 'efficiency-high'
    if (efficiency >= 70) return 'efficiency-medium'
    return 'efficiency-low'
  }

  /**
   * 🔄 Maneja la recarga manual de proyectos
   */
  const handleRefresh = async () => {
    clearError()
    await refreshProjects()
  }

  return (
    <div className="projects-page">
      {/* Header de la página */}
      <div className="page-header">
        <div className="header-content">
          <h1>Mis Proyectos</h1>
          <p>Gestiona y revisa todos tus proyectos de optimización guardados</p>
        </div>
        
        <div className="header-actions">
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="refresh-btn"
            title="Actualizar lista"
          >
            🔄
          </button>
          <Link to="/projects/new" className="new-project-btn">
            ➕ Nuevo Proyecto
          </Link>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="projects-stats">
        <Card className="stat-card">
          <div className="stat-item">
            <span className="stat-number">{projectStats.totalProjects}</span>
            <span className="stat-label">Proyectos Totales</span>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-item">
            <span className="stat-number">{projectStats.totalSheets}</span>
            <span className="stat-label">Placas Optimizadas</span>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-item">
            <span className="stat-number">{projectStats.totalPieces}</span>
            <span className="stat-label">Piezas Totales</span>
          </div>
        </Card>
      </div>

      {/* Controles de filtrado y búsqueda */}
      <div className="projects-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar proyectos por nombre o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            disabled={loading}
          />
          {searchTerm && (
            <button 
              className="clear-search"
              onClick={() => setSearchTerm('')}
              disabled={loading}
            >
              ✕
            </button>
          )}
        </div>
        
        <div className="sort-container">
          <label>Ordenar por:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
            disabled={loading}
          >
            <option value="updatedAt">Más recientes</option>
            <option value="createdAt">Fecha de creación</option>
            <option value="name">Nombre (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Mensajes de error */}
      {error && (
        <ErrorMessage 
          message={error}
          type="error"
          onClose={clearError}
        />
      )}

      {/* Estado de carga */}
      {loading && (
        <div className="loading-container">
          <LoadingSpinner size="large" text="Cargando proyectos..." />
        </div>
      )}

      {/* Grid de proyectos */}
      {!loading && (
        <div className="projects-content">
          {filteredAndSortedProjects.length === 0 ? (
            <Card className="empty-state">
              <div className="empty-content">
                <div className="empty-icon">📁</div>
                <h3>
                  {searchTerm ? 'No se encontraron proyectos' : 'No hay proyectos'}
                </h3>
                <p>
                  {searchTerm 
                    ? `No hay proyectos que coincidan con "${searchTerm}"`
                    : 'Comienza creando tu primer proyecto de optimización'
                  }
                </p>
                {!searchTerm && (
                  <Link to="/projects/new" className="create-first-btn">
                    Crear primer proyecto
                  </Link>
                )}
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="clear-search-btn"
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            </Card>
          ) : (
            <div className="projects-grid">
              {filteredAndSortedProjects.map((project) => {
                const efficiency = getProjectEfficiency(project)
                const isProcessing = processingAction?.includes(project.id)
                
                return (
                  <Card key={project.id} className="project-card">
                    <div className="project-card-header">
                      <h3 className="project-name">{project.name || 'Proyecto sin nombre'}</h3>
                      <span className={`efficiency-badge ${getEfficiencyClass(efficiency)}`}>
                        {efficiency > 0 ? `${efficiency.toFixed(1)}%` : 'Sin optimizar'}
                      </span>
                    </div>
                    
                    <div className="project-info">
                      <div className="info-row">
                        <span className="info-label">ID:</span>
                        <span className="info-value monospace">{project.id.substring(0, 8)}...</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Piezas:</span>
                        <span className="info-value">{project.pieces?.length || 0}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Placas:</span>
                        <span className="info-value">{project.sheets?.length || 0}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Tamaño placa:</span>
                        <span className="info-value">
                          {project.sheetConfig?.width || 0}×{project.sheetConfig?.height || 0}mm
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Creado:</span>
                        <span className="info-value">{formatDate(project.createdAt)}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Actualizado:</span>
                        <span className="info-value">{formatDate(project.updatedAt)}</span>
                      </div>
                    </div>
                    
                    <div className="project-actions">
                      <Link 
                        to={`/projects/${project.id}`}
                        className="action-btn edit-btn"
                        title="Editar proyecto"
                      >
                        {isProcessing && processingAction === `duplicating-${project.id}` ? (
                          '🔄'
                        ) : (
                          '✏️ Editar'
                        )}
                      </Link>
                      
                      <button
                        onClick={() => handleDuplicateProject(project.id, project.name)}
                        disabled={isProcessing}
                        className="action-btn duplicate-btn"
                        title="Duplicar proyecto"
                      >
                        {isProcessing && processingAction === `duplicating-${project.id}` ? (
                          '🔄'
                        ) : (
                          '📋 Duplicar'
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleDeleteProject(project.id, project.name)}
                        disabled={isProcessing}
                        className="action-btn delete-btn"
                        title="Eliminar proyecto"
                      >
                        {isProcessing && processingAction === `deleting-${project.id}` ? (
                          '🔄'
                        ) : (
                          '🗑️ Eliminar'
                        )}
                      </button>
                    </div>

                    {/* Indicador de procesamiento */}
                    {isProcessing && (
                      <div className="processing-overlay">
                        <div className="processing-spinner"></div>
                        <span>
                          {processingAction === `deleting-${project.id}` && 'Eliminando...'}
                          {processingAction === `duplicating-${project.id}` && 'Duplicando...'}
                        </span>
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ProjectsGallery