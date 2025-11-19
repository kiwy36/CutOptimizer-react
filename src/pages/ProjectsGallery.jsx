/**
 * 📁 PROJECTS GALLERY - COMPLETO CON INTEGRACIÓN FIRESTORE
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
    refreshProjects 
  } = useProjects()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('updatedAt')
  const [actionLoading, setActionLoading] = useState(null) // Para tracking de acciones

  /**
   * 🔍 Filtra y ordena los proyectos
   */
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects
    
    if (searchTerm) {
      filtered = projects.filter(project =>
        project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.id?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
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
   * 🗑️ Maneja la eliminación de un proyecto
   */
  const handleDeleteProject = async (projectId, projectName) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar el proyecto "${projectName}"?`)) {
      return
    }

    setActionLoading(projectId)
    try {
      await deleteProject(projectId)
      // Éxito - el hook ya actualiza el estado
    } catch (error) {
      console.error('Error al eliminar proyecto:', error)
      // El error se maneja en el hook
    } finally {
      setActionLoading(null)
    }
  }

  /**
   * 📋 Maneja la duplicación de un proyecto
   */
  const handleDuplicateProject = async (projectId) => {
    setActionLoading(`duplicate-${projectId}`)
    try {
      await duplicateProject(projectId)
      // Éxito - el hook ya actualiza el estado
    } catch (error) {
      console.error('Error al duplicar proyecto:', error)
    } finally {
      setActionLoading(null)
    }
  }

  /**
   * 📊 Calcula estadísticas
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
   * 🎯 Obtiene la eficiencia promedio
   */
  const getProjectEfficiency = (project) => {
    if (!project.sheets || project.sheets.length === 0) return 0
    const totalEfficiency = project.sheets.reduce((sum, sheet) => 
      sum + (sheet.efficiency || 0), 0)
    return totalEfficiency / project.sheets.length
  }

  /**
   * 🎨 Clase CSS para eficiencia
   */
  const getEfficiencyClass = (efficiency) => {
    if (efficiency >= 85) return 'efficiency-high'
    if (efficiency >= 70) return 'efficiency-medium'
    return 'efficiency-low'
  }

  return (
    <div className="projects-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>Mis Proyectos</h1>
          <p>Gestiona y revisa todos tus proyectos de optimización guardados</p>
        </div>
        
        <Link to="/projects/new" className="new-project-btn">
          ➕ Nuevo Proyecto
        </Link>
      </div>

      {/* Estadísticas */}
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

      {/* Controles */}
      <div className="projects-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar proyectos por nombre o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search"
              onClick={() => setSearchTerm('')}
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
          onClose={refreshProjects}
        />
      )}

      {/* Loading */}
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
                const isDeleting = actionLoading === project.id
                const isDuplicating = actionLoading === `duplicate-${project.id}`
                
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
                        <span className="info-value">{project.id}</span>
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
                      >
                        ✏️ Editar
                      </Link>
                      
                      <button
                        onClick={() => handleDuplicateProject(project.id)}
                        disabled={isDuplicating}
                        className="action-btn duplicate-btn"
                        title="Duplicar proyecto"
                      >
                        {isDuplicating ? '📋...' : '📋 Duplicar'}
                      </button>
                      
                      <button
                        onClick={() => handleDeleteProject(project.id, project.name)}
                        disabled={isDeleting}
                        className="action-btn delete-btn"
                        title="Eliminar proyecto"
                      >
                        {isDeleting ? '🗑️...' : '🗑️ Eliminar'}
                      </button>
                    </div>
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