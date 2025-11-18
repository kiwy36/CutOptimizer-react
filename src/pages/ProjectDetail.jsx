/**
 * 📄 PROJECT DETAIL - COMPLETADO con integración Firestore
 * 
 * 📍 FUNCIÓN:
 * - Carga y edita proyectos existentes del usuario
 * - Permite re-optimizar y modificar proyectos
 * - Actualiza cambios en Firestore
 * - Integración completa con useOptimizer
 */

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { useProjects } from '../hooks/useProjects'
import useOptimizer from '../hooks/useOptimizer'
import InputPanel from '../components/optimizer/InputPanel'
import ResultsPanel from '../components/optimizer/ResultsPanel'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import ErrorMessage from '../components/shared/ErrorMessage'
import './ProjectDetail.css'

const ProjectDetail = () => {
  const { projectId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  // Hooks
  const { getProject, updateProject, loading: projectsLoading, error: projectsError, clearError } = useProjects()
  const {
    pieces,
    sheets,
    isOptimizing,
    problematicPieces,
    optimize,
    reset,
    addPiece,
    removePiece,
    updatePiece,
    calculateStats,
    config,
    updateConfig
  } = useOptimizer()

  // Estado local del componente
  const [project, setProject] = useState(null)
  const [projectName, setProjectName] = useState('')
  const [sheetConfig, setSheetConfig] = useState({
    width: 2440,
    height: 1220
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  /**
   * 📥 Carga el proyecto desde Firestore - IMPLEMENTADO
   */
  useEffect(() => {
    const loadProject = async () => {
      if (!user || !projectId) {
        setError('Usuario no autenticado o ID de proyecto inválido')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        clearError()
        setError('')

        console.log('🔄 Cargando proyecto desde Firestore:', projectId)
        
        // Cargar proyecto real desde Firestore
        const projectData = await getProject(projectId)
        
        if (!projectData) {
          throw new Error('Proyecto no encontrado')
        }

        setProject(projectData)
        setProjectName(projectData.name || '')
        setSheetConfig(projectData.sheetConfig || { width: 2440, height: 1220 })
        
        // Cargar piezas en el optimizador
        reset() // Limpiar estado anterior
        if (projectData.pieces && projectData.pieces.length > 0) {
          projectData.pieces.forEach(piece => addPiece(piece))
        }
        
        // Cargar resultados de optimización si existen
        if (projectData.sheets && projectData.sheets.length > 0) {
          // Note: Las sheets se manejan automáticamente al optimizar
          console.log('📊 Proyecto cargado con', projectData.sheets.length, 'placas optimizadas')
        }

        console.log('✅ Proyecto cargado exitosamente:', projectData.name)
        
      } catch (error) {
        console.error('❌ Error al cargar proyecto:', error)
        setError('Error al cargar el proyecto: ' + error.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadProject()
  }, [projectId, user, getProject, reset, addPiece, clearError])

  /**
   * 🚀 Ejecuta el proceso de re-optimización
   */
  const handleReoptimize = async () => {
    setError('')
    
    try {
      // Validar que hay piezas para optimizar
      if (pieces.length === 0) {
        setError('No hay piezas para optimizar')
        return
      }

      // Validar configuración de placa
      if (sheetConfig.width <= 0 || sheetConfig.height <= 0) {
        setError('El tamaño de la placa debe ser mayor a 0')
        return
      }

      console.log('🔄 Re-optimizando proyecto...')
      
      // Ejecutar optimización
      await optimize(sheetConfig.width, sheetConfig.height)
      setHasChanges(true)
      
      console.log('✅ Re-optimización completada')
      
    } catch (error) {
      setError(error.message)
      console.error('❌ Error en re-optimización:', error)
    }
  }

  /**
   * 💾 Guarda los cambios del proyecto - IMPLEMENTADO CON FIRESTORE
   */
  const handleSaveChanges = async () => {
    if (!user || !project) {
      setError('Usuario no autenticado o proyecto no cargado')
      return
    }

    if (!projectName.trim()) {
      setError('Ingresa un nombre para el proyecto')
      return
    }

    setIsSaving(true)
    setError('')

    try {
      console.log('💾 Guardando cambios en Firestore...')
      
      // Preparar datos de actualización
      const updates = {
        name: projectName.trim(),
        sheetConfig: {
          width: sheetConfig.width,
          height: sheetConfig.height
        },
        pieces: pieces,
        sheets: sheets
      }

      // Actualizar en Firestore
      await updateProject(projectId, updates)
      
      setHasChanges(false)
      setProject(prev => ({ ...prev, ...updates, updatedAt: new Date() }))
      
      console.log('✅ Cambios guardados exitosamente')
      
    } catch (error) {
      console.error('❌ Error al guardar cambios:', error)
      setError('Error al guardar los cambios: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * 📏 Maneja cambios en la configuración de la placa
   */
  const handleSheetConfigChange = (field, value) => {
    const numericValue = parseInt(value) || 0
    setSheetConfig(prev => ({
      ...prev,
      [field]: numericValue
    }))
    setHasChanges(true)
  }

  /**
   * 🏠 Regresa a la lista de proyectos
   */
  const handleBackToList = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm(
        'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?'
      )
      if (!confirmLeave) return
    }
    navigate('/projects')
  }

  /**
   * 🔄 Maneja el reinicio del proyecto
   */
  const handleResetProject = () => {
    if (hasChanges && !window.confirm('¿Estás seguro de que quieres reiniciar? Se perderán los cambios no guardados.')) {
      return
    }
    
    // Recargar proyecto original
    if (project) {
      reset()
      project.pieces.forEach(piece => addPiece(piece))
      setProjectName(project.name || '')
      setSheetConfig(project.sheetConfig || { width: 2440, height: 1220 })
      setHasChanges(false)
      setError('')
    }
  }

  // Mostrar loading mientras carga
  if (isLoading) {
    return (
      <div className="project-detail-page">
        <div className="loading-container">
          <LoadingSpinner size="large" text="Cargando proyecto..." />
        </div>
      </div>
    )
  }

  // Mostrar error si no se pudo cargar el proyecto
  if ((error || projectsError) && !project) {
    return (
      <div className="project-detail-page">
        <div className="error-container">
          <ErrorMessage 
            message={error || projectsError} 
            type="error" 
            onClose={() => {
              setError('')
              clearError()
            }}
          />
          <button 
            onClick={() => navigate('/projects')}
            className="back-btn"
          >
            ← Volver a Proyectos
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="project-detail-page">
      {/* Header de la página */}
      <div className="project-header">
        <div className="header-content">
          <button 
            onClick={handleBackToList}
            className="back-button"
            title="Volver a proyectos"
            disabled={isSaving}
          >
            ←
          </button>
          <div className="header-text">
            <h1>Editando Proyecto</h1>
            <p className="project-id">ID: {projectId}</p>
          </div>
        </div>
        
        {/* Controles principales */}
        <div className="project-controls">
          <div className="name-control">
            <input
              type="text"
              placeholder="Nombre del proyecto..."
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value)
                setHasChanges(true)
              }}
              className="project-name-input"
              disabled={isSaving}
            />
            {!projectName.trim() && (
              <span className="name-required">* Requerido</span>
            )}
          </div>
          
          <div className="control-buttons">
            <button
              onClick={handleReoptimize}
              disabled={isOptimizing || pieces.length === 0 || isSaving}
              className="optimize-btn"
            >
              {isOptimizing ? '🔄 Re-optimizando...' : '🔄 Re-optimizar'}
            </button>
            
            <button
              onClick={handleResetProject}
              disabled={isOptimizing || isSaving || !hasChanges}
              className="reset-btn"
            >
              🔄 Reiniciar
            </button>
            
            <button
              onClick={handleSaveChanges}
              disabled={isSaving || !hasChanges || !projectName.trim()}
              className="save-btn"
            >
              {isSaving ? '💾 Guardando...' : '💾 Guardar Cambios'}
            </button>

            {hasChanges && (
              <span className="changes-indicator" title="Tienes cambios sin guardar">
                *
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mensajes de error */}
      {(error || projectsError) && (
        <ErrorMessage 
          message={error || projectsError} 
          type="error"
          onClose={() => {
            setError('')
            clearError()
          }}
        />
      )}

      {/* Información del proyecto */}
      <div className="project-info">
        <div className="info-card">
          <h3>📋 Información del Proyecto</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Estado:</span>
              <span className="info-value">
                {hasChanges ? (
                  <span className="status-modified">Modificado</span>
                ) : (
                  <span className="status-saved">Guardado</span>
                )}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Creado:</span>
              <span className="info-value">
                {project?.createdAt ? new Date(project.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'N/A'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Actualizado:</span>
              <span className="info-value">
                {project?.updatedAt ? new Date(project.updatedAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'N/A'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Piezas actuales:</span>
              <span className="info-value">{pieces.length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Optimizaciones:</span>
              <span className="info-value">{sheets.length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Eficiencia:</span>
              <span className="info-value">
                {sheets.length > 0 ? `${calculateStats().efficiency.toFixed(1)}%` : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Layout principal de dos columnas */}
      <div className="optimizer-layout">
        {/* Columna izquierda - Entrada de datos */}
        <div className="input-column">
          <InputPanel 
            // Estado compartido
            sheetConfig={sheetConfig}
            onSheetConfigChange={handleSheetConfigChange}
            onOptimize={handleReoptimize}
            onSaveProject={handleSaveChanges}
            onReset={handleResetProject}
            // Funciones del optimizador
            addPiece={addPiece}
            removePiece={removePiece}
            updatePiece={updatePiece}
            pieces={pieces}
            config={config}
            updateConfig={updateConfig}
            isOptimizing={isOptimizing}
            isSaving={isSaving}
            projectName={projectName}
            onProjectNameChange={setProjectName}
            sheets={sheets}
          />
        </div>

        {/* Columna derecha - Resultados */}
        <div className="results-column">
          <ResultsPanel 
            sheetConfig={sheetConfig}
            currentPieces={pieces}
            sheets={sheets}
            problematicPieces={problematicPieces}
            isOptimizing={isOptimizing}
            calculateStats={calculateStats}
          />
        </div>
      </div>

      {/* Estado de carga global */}
      {(isOptimizing || isSaving || projectsLoading) && (
        <div className="global-loading">
          <LoadingSpinner size="large" />
          <p>
            {isOptimizing && 'Re-optimizando cortes...'}
            {isSaving && 'Guardando cambios en Firestore...'}
            {projectsLoading && 'Cargando proyecto...'}
          </p>
        </div>
      )}
    </div>
  )
}

export default ProjectDetail