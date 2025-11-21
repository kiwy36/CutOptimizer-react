/**
 * 📄 PROJECT DETAIL - COMPLETO CON MEJOR MANEJO DE ERRORES Y FIRESTORE
 */
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { projectService } from '../services/firebase'
import useAuth from '../hooks/useAuth'
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
  
  // Hook del optimizador - ESTADO COMPARTIDO
  const {
    pieces,
    sheets,
    isOptimizing,
    problematicPieces,
    optimize,
    reset,
    calculateStats,
    addPiece,
    removePiece,
    config,
    updateConfig
  } = useOptimizer()

  // Estado local
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
   * 📥 Carga el proyecto desde Firestore - CORREGIDO
   */
  useEffect(() => {
    const loadProject = async () => {
      // ✅ VALIDACIÓN TEMPRANA DE PARÁMETROS
      if (!user) {
        setError('Usuario no autenticado')
        setIsLoading(false)
        return
      }

      if (!projectId || projectId === 'undefined' || projectId === 'null') {
        setError('ID de proyecto inválido')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError('')

        console.log('🔄 Cargando proyecto:', projectId)
        
        // ✅ CARGAR PROYECTO CON MEJOR MANEJO DE ERRORES
        const projectData = await projectService.getProject(projectId, user.uid)
        
        console.log('✅ Proyecto cargado:', projectData)
        
        setProject(projectData)
        setProjectName(projectData.name || '')
        setSheetConfig(projectData.sheetConfig || { width: 2440, height: 1220 })
        
        // CARGAR DATOS EN EL OPTIMIZADOR
        reset()
        
        // Cargar piezas
        if (projectData.pieces && projectData.pieces.length > 0) {
          projectData.pieces.forEach(piece => {
            addPiece(piece)
          })
          console.log(`✅ ${projectData.pieces.length} piezas cargadas en optimizador`)
        }
        
        // Cargar resultados de optimización previos
        if (projectData.sheets && projectData.sheets.length > 0) {
          // El hook useOptimizer maneja sheets automáticamente
          console.log('📊 Sheets cargadas:', projectData.sheets.length)
        }
        
      } catch (error) {
        console.error('❌ Error al cargar proyecto:', error)
        
        // ✅ MEJOR MANEJO DE ERRORES ESPECÍFICOS
        if (error.message.includes('no existe') || error.message.includes('no encontrado')) {
          setError('El proyecto no existe o ha sido eliminado')
        } else if (error.message.includes('permisos')) {
          setError('No tienes permisos para acceder a este proyecto')
        } else {
          setError('Error al cargar el proyecto: ' + error.message)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadProject()
  }, [projectId, user, reset, addPiece])

  /**
   * 🚀 Ejecuta re-optimización - CORREGIDO
   */
  const handleReoptimize = async () => {
    setError('')
    
    try {
      if (pieces.length === 0) {
        setError('No hay piezas para optimizar')
        return
      }

      if (sheetConfig.width <= 0 || sheetConfig.height <= 0) {
        setError('El tamaño de la placa debe ser mayor a 0')
        return
      }

      console.log('🔄 Re-optimizando proyecto...')
      await optimize(sheetConfig.width, sheetConfig.height)
      setHasChanges(true)
      
    } catch (error) {
      setError(error.message)
      console.error('Error en re-optimización:', error)
    }
  }

  /**
   * 💾 Guarda cambios en Firestore - CORREGIDO
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
      console.log('💾 Guardando cambios del proyecto...')
      
      // PREPARAR DATOS ACTUALIZADOS
      const updates = {
        name: projectName.trim(),
        sheetConfig: {
          width: sheetConfig.width,
          height: sheetConfig.height
        },
        pieces: pieces,
        sheets: sheets
      }

      // ACTUALIZAR EN FIRESTORE
      await projectService.updateProject(project.id, updates, user.uid)
      
      console.log('✅ Proyecto actualizado exitosamente')
      setHasChanges(false)
      
      // Mostrar mensaje de éxito
      setError('✅ Cambios guardados correctamente')
      
      // Limpiar mensaje después de 2 segundos
      setTimeout(() => setError(''), 2000)
      
    } catch (error) {
      console.error('❌ Error al guardar cambios:', error)
      setError('Error al guardar los cambios: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * 📏 Maneja cambios en configuración de placa
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
   * ➕ Maneja agregar pieza (para pasar a InputPanel)
   */
  const handleAddPiece = (piece) => {
    addPiece(piece)
    setHasChanges(true)
  }

  /**
   * 🗑️ Maneja eliminar pieza (para pasar a InputPanel)
   */
  const handleRemovePiece = (pieceId) => {
    removePiece(pieceId)
    setHasChanges(true)
  }

  /**
   * 🏠 Regresa a la lista
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

  // Loading
  if (isLoading) {
    return (
      <div className="project-detail-page">
        <div className="loading-container">
          <LoadingSpinner size="large" text="Cargando proyecto..." />
        </div>
      </div>
    )
  }

  // Error de carga
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
      {/* Header */}
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

      {/* Mensajes de error/éxito */}
      {error && (
        <ErrorMessage 
          message={error} 
          type={error.includes('✅') ? 'info' : 'error'}
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

      {/* Layout principal IDÉNTICO A NEWPROJECT */}
      <div className="optimizer-layout">
        {/* Columna izquierda: InputPanel con TODAS las props */}
        <div className="input-column">
          <InputPanel 
            // Estado compartido
            sheetConfig={sheetConfig}
            onSheetConfigChange={handleSheetConfigChange}
            onOptimize={handleReoptimize}
            onSaveProject={handleSaveChanges}
            onReset={() => {
              reset()
              setHasChanges(true)
            }}
            // Funciones del optimizador
            addPiece={handleAddPiece}
            removePiece={handleRemovePiece}
            pieces={pieces}
            config={config}
            updateConfig={(newConfig) => {
              updateConfig(newConfig)
              setHasChanges(true)
            }}
            isOptimizing={isOptimizing}
            isSaving={isSaving}
            projectName={projectName}
            onProjectNameChange={(name) => {
              setProjectName(name)
              setHasChanges(true)
            }}
            sheets={sheets}
          />
        </div>

        {/* Columna derecha: ResultsPanel con TODAS las props */}
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