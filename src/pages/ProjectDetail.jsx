/**
 * 📄 PROJECT DETAIL - Página para editar proyecto existente
 * 
 * 📍 FUNCIÓN:
 * - Carga y edita proyectos existentes del usuario
 * - Permite re-optimizar y modificar proyectos
 * - Actualiza cambios en la base de datos (preparado para Firestore)
 * - Integra los mismos componentes que NewProject pero con datos cargados
 * 
 * 🎯 CARACTERÍSTICAS:
 * - Carga de proyecto específico por ID
 * - Formulario pre-llenado con datos existentes
 * - Funcionalidad de re-optimización
 * - Guardado de cambios
 */

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useAuth  from '../hooks/useAuth'
import useOptimizer from '../hooks/useOptimizer'
import InputPanel from '../components/optimizer/InputPanel'
import ResultsPanel from '../components/optimizer/ResultsPanel'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorMessage from '../components/ui/ErrorMessage'
import './ProjectDetail.css'

const ProjectDetail = () => {
  const { projectId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  // Hook del optimizador
  const {
    pieces,
    sheets,
    isOptimizing,
    optimize,
    reset,
    addPiece,
    calculateStats
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
   * 📥 Carga el proyecto desde Firestore (simulado por ahora)
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
        setError('')

        // TODO: Implementar carga desde Firestore (Fase 6)
        // Simular carga de proyecto
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Datos de ejemplo (remover en Fase 6)
        const mockProject = {
          id: projectId,
          name: `Proyecto ${projectId}`,
          sheetConfig: { width: 2440, height: 1220 },
          pieces: [
            { id: '1', width: 300, height: 200, quantity: 2, color: '#3b82f6' },
            { id: '2', width: 450, height: 300, quantity: 1, color: '#ef4444' },
            { id: '3', width: 200, height: 150, quantity: 3, color: '#10b981' }
          ],
          sheets: [],
          userId: user.uid,
          createdAt: new Date(),
          updatedAt: new Date()
        }

        setProject(mockProject)
        setProjectName(mockProject.name)
        setSheetConfig(mockProject.sheetConfig)
        
        // Cargar piezas en el optimizador
        reset()
        mockProject.pieces.forEach(piece => addPiece(piece))
        
      } catch (error) {
        setError('Error al cargar el proyecto: ' + error.message)
        console.error('Error loading project:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProject()
  }, [projectId, user, reset, addPiece])

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

      // Ejecutar optimización
      await optimize(sheetConfig.width, sheetConfig.height)
      setHasChanges(true)
      
    } catch (error) {
      setError(error.message)
      console.error('Error en re-optimización:', error)
    }
  }

  /**
   * 💾 Guarda los cambios del proyecto
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
      // TODO: Implementar actualización en Firestore (Fase 6)
      console.log('Actualizando proyecto:', {
        id: project.id,
        name: projectName,
        sheetConfig,
        pieces,
        sheets,
        stats: calculateStats(),
        userId: user.uid,
        updatedAt: new Date()
      })

      // Simular guardado (remover en Fase 6)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setHasChanges(false)
      
      // Mostrar mensaje de éxito
      setError('')
      // En una implementación real, podrías mostrar un toast de éxito
      console.log('Proyecto actualizado exitosamente')
      
    } catch (error) {
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
  if (error && !project) {
    return (
      <div className="project-detail-page">
        <div className="error-container">
          <ErrorMessage message={error} type="error" />
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
          >
            ←
          </button>
          <div className="header-text">
            <h1>Editando Proyecto</h1>
            <p>ID: {projectId}</p>
          </div>
        </div>
        
        {/* Controles principales */}
        <div className="project-controls">
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
          
          <div className="control-buttons">
            <button
              onClick={handleReoptimize}
              disabled={isOptimizing || pieces.length === 0}
              className="optimize-btn"
            >
              {isOptimizing ? '🔄 Re-optimizando...' : '🔄 Re-optimizar'}
            </button>
            
            <button
              onClick={handleSaveChanges}
              disabled={isSaving || !hasChanges}
              className="save-btn"
            >
              {isSaving ? '💾 Guardando...' : '💾 Guardar Cambios'}
            </button>

            {hasChanges && (
              <span className="changes-indicator">* Cambios sin guardar</span>
            )}
          </div>
        </div>
      </div>

      {/* Mensajes de error */}
      {error && (
        <ErrorMessage 
          message={error} 
          type="error"
          onClose={() => setError('')}
        />
      )}

      {/* Información del proyecto */}
      <div className="project-info">
        <div className="info-card">
          <h3>Información del Proyecto</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Creado:</span>
              <span className="info-value">
                {project?.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Actualizado:</span>
              <span className="info-value">
                {project?.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Piezas:</span>
              <span className="info-value">{pieces.length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Optimizaciones:</span>
              <span className="info-value">{sheets.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Configuración de placa */}
      <div className="quick-sheet-config">
        <h3>Configuración de Placa</h3>
        <div className="config-fields">
          <div className="config-field">
            <label>Ancho de placa (mm)</label>
            <input
              type="number"
              value={sheetConfig.width}
              onChange={(e) => handleSheetConfigChange('width', e.target.value)}
              min="100"
              max="10000"
              disabled={isOptimizing}
            />
          </div>
          <div className="config-field">
            <label>Alto de placa (mm)</label>
            <input
              type="number"
              value={sheetConfig.height}
              onChange={(e) => handleSheetConfigChange('height', e.target.value)}
              min="100"
              max="10000"
              disabled={isOptimizing}
            />
          </div>
        </div>
      </div>

      {/* Layout principal de dos columnas */}
      <div className="optimizer-layout">
        {/* Columna izquierda - Entrada de datos */}
        <div className="input-column">
          <InputPanel />
        </div>

        {/* Columna derecha - Resultados */}
        <div className="results-column">
          <ResultsPanel />
        </div>
      </div>

      {/* Estado de carga global */}
      {(isOptimizing || isSaving) && (
        <div className="global-loading">
          <LoadingSpinner size="large" />
          <p>
            {isOptimizing && 'Re-optimizando cortes...'}
            {isSaving && 'Guardando cambios...'}
          </p>
        </div>
      )}
    </div>
  )
}

export default ProjectDetail