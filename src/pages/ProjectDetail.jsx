/**
 * 📄 PROJECT DETAIL - VERSIÓN COMPLETAMENTE FUNCIONAL
 * 
 * 📍 FUNCIÓN:
 * - Carga proyectos existentes desde Firestore (users/{userId}/projects/{projectId})
 * - Permite editar y re-optimizar proyectos guardados
 * - Guarda cambios automáticamente en Firestore
 * - Interfaz idéntica a NewProject pero con datos precargados
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
  const { id } = useParams()
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
   * 📥 CARGA EL PROYECTO DESDE FIRESTORE - COMPLETAMENTE REESCRITO
   */
  useEffect(() => {
    const loadProject = async () => {
      // ✅ VALIDACIONES TEMPRANAS
      if (!user) {
        setError('❌ Usuario no autenticado')
        setIsLoading(false)
        return
      }

      if (!id) {
        setError('❌ ID de proyecto no proporcionado')
        setIsLoading(false)
        return
      }

      console.log('🔄 Cargando proyecto:', id, 'para usuario:', user.uid)

      try {
        setIsLoading(true)
        setError('')

        // ✅ CARGAR PROYECTO DESDE FIRESTORE
        const projectData = await projectService.getProject(id, user.uid)
        
        console.log('✅ Proyecto cargado exitosamente:', projectData)
        
        // ✅ ESTABLECER DATOS EN EL ESTADO
        setProject(projectData)
        setProjectName(projectData.name || 'Sin nombre')
        setSheetConfig(projectData.sheetConfig || { width: 2440, height: 1220 })
        
        // ✅ RESETEAR Y CARGAR DATOS EN EL OPTIMIZADOR
        reset() // Limpiar estado anterior
        
        // Cargar piezas en el optimizador
        if (projectData.pieces && projectData.pieces.length > 0) {
          projectData.pieces.forEach(piece => {
            addPiece(piece)
          })
          console.log(`✅ ${projectData.pieces.length} piezas cargadas en optimizador`)
        }

        // Las sheets se cargan automáticamente desde projectData
        console.log('📊 Sheets disponibles:', projectData.sheets?.length || 0)
        
      } catch (error) {
        console.error('❌ Error crítico al cargar proyecto:', error)
        
        // ✅ MANEJO DETALLADO DE ERRORES
        let errorMessage = 'Error al cargar el proyecto'
        
        if (error.message.includes('no existe')) {
          errorMessage = '❌ El proyecto no existe o ha sido eliminado'
        } else if (error.message.includes('permisos')) {
          errorMessage = '❌ No tienes permisos para acceder a este proyecto'
        } else if (error.message.includes('configuración')) {
          errorMessage = '❌ Error de configuración de la base de datos'
        } else {
          errorMessage = `❌ ${error.message}`
        }
        
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    loadProject()
  }, [id, user, reset, addPiece])

  /**
   * 🚀 RE-OPTIMIZAR PROYECTO
   */
  const handleReoptimize = async () => {
    setError('')
    
    try {
      if (pieces.length === 0) {
        setError('❌ No hay piezas para optimizar')
        return
      }

      if (sheetConfig.width <= 0 || sheetConfig.height <= 0) {
        setError('❌ El tamaño de la placa debe ser mayor a 0')
        return
      }

      console.log('🔄 Re-optimizando proyecto...')
      await optimize(sheetConfig.width, sheetConfig.height)
      setHasChanges(true)
      
    } catch (error) {
      setError(`❌ Error en optimización: ${error.message}`)
      console.error('Error en re-optimización:', error)
    }
  }

  /**
   * 💾 GUARDAR CAMBIOS EN FIRESTORE
   */
  const handleSaveChanges = async () => {
    if (!user || !project) {
      setError('❌ Usuario no autenticado o proyecto no cargado')
      return
    }

    if (!projectName.trim()) {
      setError('❌ Ingresa un nombre para el proyecto')
      return
    }

    setIsSaving(true)
    setError('')

    try {
      console.log('💾 Guardando cambios del proyecto...')
      
      // Preparar datos actualizados
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
      await projectService.updateProject(project.id, updates, user.uid)
      
      console.log('✅ Proyecto actualizado exitosamente')
      setHasChanges(false)
      
      // Mostrar mensaje de éxito
      setError('✅ Cambios guardados correctamente')
      
      // Limpiar mensaje después de 2 segundos
      setTimeout(() => setError(''), 2000)
      
    } catch (error) {
      console.error('❌ Error al guardar cambios:', error)
      setError(`❌ Error al guardar: ${error.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * 📏 MANEJAR CAMBIOS EN CONFIGURACIÓN
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
   * ➕ MANEJAR AGREGAR PIEZA
   */
  const handleAddPiece = (piece) => {
    addPiece(piece)
    setHasChanges(true)
  }

  /**
   * 🗑️ MANEJAR ELIMINAR PIEZA
   */
  const handleRemovePiece = (pieceId) => {
    removePiece(pieceId)
    setHasChanges(true)
  }

  /**
   * 🏠 VOLVER A LA LISTA
   */
  const handleBackToList = () => {
    if (hasChanges && !window.confirm('Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?')) {
      return
    }
    navigate('/projects')
  }

  // ===========================================================================
  // RENDERIZADO
  // ===========================================================================

  // Estado de carga
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

  // Proyecto cargado correctamente
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
            <h1>Editando: {projectName}</h1>
            <p>ID: {id}</p>
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

      {/* Mensajes de estado */}
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
          <h3>📋 Información del Proyecto</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Proyecto ID:</span>
              <span className="info-value">{id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Piezas cargadas:</span>
              <span className="info-value">{pieces.length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Optimizaciones:</span>
              <span className="info-value">{sheets.length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Tamaño placa:</span>
              <span className="info-value">{sheetConfig.width} × {sheetConfig.height} mm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Layout principal - IDÉNTICO A NEWPROJECT */}
      <div className="optimizer-layout">
        {/* Columna izquierda: InputPanel */}
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

        {/* Columna derecha: ResultsPanel */}
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