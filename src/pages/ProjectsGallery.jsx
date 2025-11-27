/**
 * 📁 PROJECTS GALLERY - VERSIÓN OPTIMIZADA CON PERFORMANCE Y UI MEJORADA
 * 
 * 🚀 OPTIMIZACIONES IMPLEMENTADAS:
 * - Memoización de componentes y cálculos costosos
 * - Debounce en búsqueda para reducir re-renders
 * - Lazy loading condicional para visualizaciones
 * - Virtualización manual con paginación
 * - UI simplificada sin información técnica
 * 
 * 🎯 MEJORAS DE UX:
 * - Información relevante para el usuario (piezas, placas, eficiencia)
 * - Eliminación de datos técnicos (ID, fechas internas)
 * - Diseño más limpio y enfocado
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProjects } from '../hooks/useProjects'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import ErrorMessage from '../components/shared/ErrorMessage'
import Card from '../components/shared/Card'
import './ProjectsGallery.css'
// Ejemplo de implementación
// =============================================================================
// 🎯 COMPONENTE DE TARJETA DE PROYECTO MEMOIZADO
// =============================================================================

/**
 * 🃏 ProjectCard - Componente memoizado para evitar re-renders innecesarios
 * 📍 Solo se re-renderiza cuando cambian sus props específicas
 */
const ProjectCard = React.memo(({ 
  project, 
  onDuplicate, 
  onDelete, 
  actionLoading 
}) => {
  const efficiency = useMemo(() => {
    if (!project.sheets || project.sheets.length === 0) return 0
    const totalEfficiency = project.sheets.reduce((sum, sheet) => 
      sum + (sheet.efficiency || 0), 0)
    return totalEfficiency / project.sheets.length
  }, [project.sheets])

  const getEfficiencyClass = useCallback((eff) => {
    if (eff >= 85) return 'efficiency-high'
    if (eff >= 70) return 'efficiency-medium'
    return 'efficiency-low'
  }, [])

  const isDeleting = actionLoading === project.id
  const isDuplicating = actionLoading === `duplicate-${project.id}`

  console.log(`🔄 Renderizando proyecto: ${project.name}`)

  return (
    <Card className="project-card">
      {/* Header con nombre y eficiencia */}
      <div className="project-card-header">
        <h3 className="project-name" title={project.name}>
          {project.name || 'Proyecto sin nombre'}
        </h3>
        <span className={`efficiency-badge ${getEfficiencyClass(efficiency)}`}>
          {efficiency > 0 ? `${efficiency.toFixed(1)}%` : 'Sin optimizar'}
        </span>
      </div>
      
      {/* Información relevante para el usuario */}
      <div className="project-info">
        <div className="info-grid">
          <div className="info-item">
            <span className="info-icon">✂️ Numerdo de cortes </span>
            <div className="info-content">
              <span className="info-value">{project.pieces?.length || 0}</span>
              <span className="info-label">Piezas</span>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">📋 Numero de Placas</span>
            <div className="info-content">
              <span className="info-value">{project.sheets?.length || 0}</span>
              <span className="info-label">Placas</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Acciones del proyecto */}
      <div className="project-actions">
        <Link 
          to={`/projects/${project.id}`}
          className="action-btn edit-btn"
          title="Editar proyecto"
        >
          ✏️ Editar
        </Link>
        
        <button
          onClick={() => onDuplicate(project.id)}
          disabled={isDuplicating}
          className="action-btn duplicate-btn"
          title="Duplicar proyecto"
        >
          {isDuplicating ? '📋...' : '📋 Duplicar'}
        </button>
        
        <button
          onClick={() => onDelete(project.id, project.name)}
          disabled={isDeleting}
          className="action-btn delete-btn"
          title="Eliminar proyecto"
        >
          {isDeleting ? '🗑️...' : '🗑️ Eliminar'}
        </button>
      </div>
    </Card>
  )
})

ProjectCard.displayName = 'ProjectCard'

// =============================================================================
// 🎯 COMPONENTE PRINCIPAL PROJECTS GALLERY
// =============================================================================

const ProjectsGallery = () => {
  const { 
    projects, 
    loading, 
    error, 
    deleteProject, 
    duplicateProject,
    refreshProjects 
  } = useProjects()
  
  // 🎯 ESTADOS OPTIMIZADOS
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('updatedAt')
  const [actionLoading, setActionLoading] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const projectsPerPage = 12 // 🎯 PAGINACIÓN PARA VIRTUALIZACIÓN MANUAL

  // ===========================================================================
  // ⚡ OPTIMIZACIONES DE PERFORMANCE
  // ===========================================================================

  /**
   * ⏰ DEBOUNCE PARA BÚSQUEDA - Reduce re-renders
   * Espera 300ms después de que el usuario deja de escribir
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setCurrentPage(1) // Resetear a primera página al buscar
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  /**
   * 📊 CÁLCULO DE ESTADÍSTICAS MEMOIZADO
   * Solo se recalcula cuando cambian los proyectos
   */
  const projectStats = useMemo(() => {
    console.log('📊 Recalculando estadísticas...')
    
    const totalProjects = projects.length
    const totalSheets = projects.reduce((sum, project) => 
      sum + (project.sheets?.length || 0), 0)
    const totalPieces = projects.reduce((sum, project) => 
      sum + (project.pieces?.length || 0), 0)
    
    return { totalProjects, totalSheets, totalPieces }
  }, [projects])

  /**
   * 🔍 FILTRADO Y ORDENAMIENTO MEMOIZADO
   * Solo se recalcula cuando cambian proyectos, búsqueda u orden
   */
  const filteredAndSortedProjects = useMemo(() => {
    console.log('🔍 Recalculando proyectos filtrados...')
    
    let filtered = projects
    
    // Aplicar filtro de búsqueda
    if (debouncedSearchTerm) {
      filtered = projects.filter(project =>
        project.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
    }
    
    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      const getDateValue = (project, field) => {
        const dateValue = project[field]
        if (!dateValue) return 0
        
        try {
          if (dateValue instanceof Date) {
            return dateValue.getTime()
          } else if (dateValue.toDate) {
            return dateValue.toDate().getTime()
          } else if (typeof dateValue === 'string') {
            return new Date(dateValue).getTime()
          } else {
            return new Date(dateValue).getTime()
          }
        } catch (error) {
          console.error(`Error procesando fecha ${field}:`, error)
          return 0
        }
      }

      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '')
        case 'createdAt':
          return getDateValue(b, 'createdAt') - getDateValue(a, 'createdAt')
        case 'updatedAt':
        default:
          return getDateValue(b, 'updatedAt') - getDateValue(a, 'updatedAt')
      }
    })
    
    return filtered
  }, [projects, debouncedSearchTerm, sortBy])

  /**
   * 📄 PAGINACIÓN MEMOIZADA - Virtualización manual
   * Renderiza solo los proyectos de la página actual
   */
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * projectsPerPage
    const endIndex = startIndex + projectsPerPage
    return filteredAndSortedProjects.slice(startIndex, endIndex)
  }, [filteredAndSortedProjects, currentPage, projectsPerPage])

  /**
   * 🔢 CÁLCULO DE PÁGINAS
   */
  const totalPages = Math.ceil(filteredAndSortedProjects.length / projectsPerPage)

  // ===========================================================================
  // 🎯 MANEJADORES DE EVENTOS OPTIMIZADOS
  // ===========================================================================

  /**
   * 🗑️ MANEJAR ELIMINACIÓN - useCallback para estabilidad
   */
  const handleDeleteProject = useCallback(async (projectId, projectName) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar el proyecto "${projectName}"?`)) {
      return
    }

    setActionLoading(projectId)
    try {
      await deleteProject(projectId)
    } catch (error) {
      console.error('Error al eliminar proyecto:', error)
    } finally {
      setActionLoading(null)
    }
  }, [deleteProject])

  /**
   * 📋 MANEJAR DUPLICACIÓN - useCallback para estabilidad
   */
  const handleDuplicateProject = useCallback(async (projectId) => {
    setActionLoading(`duplicate-${projectId}`)
    try {
      await duplicateProject(projectId)
    } catch (error) {
      console.error('Error al duplicar proyecto:', error)
    } finally {
      setActionLoading(null)
    }
  }, [duplicateProject])

  /**
   * 🔄 MANEJAR CAMBIO DE PÁGINA
   */
  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage)
    // Scroll suave al top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  /**
   * 🧹 LIMPIAR BÚSQUEDA
   */
  const handleClearSearch = useCallback(() => {
    setSearchTerm('')
    setDebouncedSearchTerm('')
    setCurrentPage(1)
  }, [])

  // ===========================================================================
  // 🎨 RENDERIZADO OPTIMIZADO
  // ===========================================================================

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

      {/* Controles de búsqueda y ordenamiento */}
      <div className="projects-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar proyectos por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search"
              onClick={handleClearSearch}
              title="Limpiar búsqueda"
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

      {/* Estado de carga */}
      {loading && (
        <div className="loading-container">
          <LoadingSpinner size="large" text="Cargando proyectos..." />
        </div>
      )}

      {/* Contenido principal */}
      {!loading && (
        <div className="projects-content">
          {filteredAndSortedProjects.length === 0 ? (
            <Card className="empty-state">
              <div className="empty-content">
                <div className="empty-icon">📁</div>
                <h3>
                  {debouncedSearchTerm ? 'No se encontraron proyectos' : 'No hay proyectos'}
                </h3>
                <p>
                  {debouncedSearchTerm 
                    ? `No hay proyectos que coincidan con "${debouncedSearchTerm}"`
                    : 'Comienza creando tu primer proyecto de optimización'
                  }
                </p>
                {!debouncedSearchTerm && (
                  <Link to="/projects/new" className="create-first-btn">
                    Crear primer proyecto
                  </Link>
                )}
                {debouncedSearchTerm && (
                  <button 
                    onClick={handleClearSearch}
                    className="clear-search-btn"
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            </Card>
          ) : (
            <>
              {/* Información de resultados */}
              <div className="results-info">
                <p>
                  Mostrando {paginatedProjects.length} de {filteredAndSortedProjects.length} proyectos
                  {debouncedSearchTerm && ` para "${debouncedSearchTerm}"`}
                </p>
              </div>

              {/* Grid de proyectos - SOLO RENDERIZA PÁGINA ACTUAL */}
              <div className="projects-grid">
                {paginatedProjects.map((project) => (
                  <ProjectCard 
                    key={project.id}
                    project={project}
                    onDuplicate={handleDuplicateProject}
                    onDelete={handleDeleteProject}
                    actionLoading={actionLoading}
                  />
                ))}
              </div>

              {/* Paginación - VIRTUALIZACIÓN MANUAL */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    ← Anterior
                  </button>
                  
                  <span className="pagination-info">
                    Página {currentPage} de {totalPages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

// 🎯 EXPORTAR COMPONENTE MEMOIZADO
export default React.memo(ProjectsGallery)