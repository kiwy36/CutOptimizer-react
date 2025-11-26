/**
 * 📄 PROJECT DETAIL - VERSIÓN MEJORADA CON MANEJO DE EDGE CASES
 * 
 * 📍 MEJORAS IMPLEMENTADAS:
 * - Validación de datos corruptos
 * - Manejo de pérdida de conexión con reintentos
 * - Manejo detallado de permisos de Firestore
 * - Sanitización de piezas mal formadas
 * - Timeouts y recuperación elegante de errores
 * - Corrección automática de colores HEX inválidos
 */

import React, { useState, useEffect, useCallback } from 'react'
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

  // ===========================================================================
  // 🛡️ FUNCIONES DE VALIDACIÓN Y SANITIZACIÓN (NUEVAS)
  // ===========================================================================

  /**
   * 🎨 VALIDAR FORMATO DE COLOR HEX - MEJORADO
   * Maneja colores con 3, 6 caracteres hex válidos
   */
  const isValidColor = (color) => {
    if (typeof color !== 'string') return false
    
    if (color.startsWith('#')) {
      const hexValue = color.slice(1)
      return /^[A-Fa-f0-9]{3}$/.test(hexValue) || /^[A-Fa-f0-9]{6}$/.test(hexValue)
    }
    
    return false
  }

  /**
   * 🎨 CORREGIR COLOR HEX AUTOMÁTICAMENTE
   * Convierte colores mal formados a formato válido
   */
  const correctHexColor = (color) => {
    if (typeof color !== 'string') return '#3b82f6'
    
    if (color.startsWith('#')) {
      const hexValue = color.slice(1)
      
      // Caso: #40457 (5 caracteres) → #404570
      if (hexValue.length === 5) {
        return `#${hexValue}0`
      }
      
      // Caso: #404 (3 caracteres) → #440044
      if (hexValue.length === 3) {
        return `#${hexValue[0]}${hexValue[0]}${hexValue[1]}${hexValue[1]}${hexValue[2]}${hexValue[2]}`
      }
      
      // Caso: sin # pero tiene 6 caracteres válidos
      if (/^[A-Fa-f0-9]{6}$/.test(hexValue)) {
        return `#${hexValue}`
      }
    }
    
    return '#3b82f6'
  }

  /**
   * 🧹 SANITIZAR Y VALIDAR PIEZAS - CON useCallback
   * Filtra piezas corruptas y asegura datos válidos
   */
  const sanitizePieces = useCallback((pieces) => {
    if (!Array.isArray(pieces)) {
      console.warn('⚠️ Piezas no es un array, retornando array vacío')
      return []
    }
    
    return pieces.filter(piece => {
      // Validar estructura básica
      if (!piece || typeof piece !== 'object') {
        console.warn('⚠️ Pieza inválida encontrada, omitiendo:', piece)
        return false
      }
      
      // Validar dimensiones
      const width = parseInt(piece.width)
      const height = parseInt(piece.height)
      const quantity = parseInt(piece.quantity) || 1
      
      if (isNaN(width) || width <= 0 || isNaN(height) || height <= 0) {
        console.warn('⚠️ Pieza con dimensiones inválidas:', piece)
        return false
      }
      
      if (quantity <= 0 || quantity > 1000) {
        console.warn('⚠️ Pieza con cantidad inválida:', piece)
        return false
      }
      
      // ✅ MEJORADO: Validar y corregir color automáticamente
      if (piece.color) {
        if (!isValidColor(piece.color)) {
          const correctedColor = correctHexColor(piece.color)
          console.warn(`🎨 Color "${piece.color}" corregido a: ${correctedColor}`)
          piece.color = correctedColor
        }
      } else {
        // Si no tiene color, asignar uno por defecto
        piece.color = '#3b82f6'
      }
      
      // Asegurar valores numéricos
      piece.width = width
      piece.height = height
      piece.quantity = quantity
      
      return true
    })
  }, []) // ✅ No dependencies needed

  /**
   * 📋 VALIDAR ESTRUCTURA DE DATOS DEL PROYECTO
   * Previene crashes por datos corruptos o mal formados
   */
  const validateProjectData = (projectData) => {
    const errors = []
    
    // Validar estructura básica
    if (!projectData || typeof projectData !== 'object') {
      throw new Error('❌ Estructura de proyecto inválida')
    }
    
    // Validar campos requeridos
    const requiredFields = ['name', 'sheetConfig', 'pieces', 'sheets']
    requiredFields.forEach(field => {
      if (!projectData[field]) {
        errors.push(`Campo requerido faltante: ${field}`)
      }
    })
    
    // Validar sheetConfig
    if (projectData.sheetConfig) {
      const { width, height } = projectData.sheetConfig
      if (typeof width !== 'number' || width <= 0) {
        errors.push('Ancho de placa inválido')
      }
      if (typeof height !== 'number' || height <= 0) {
        errors.push('Alto de placa inválido')
      }
    }
    
    // Validar pieces array
    if (projectData.pieces && !Array.isArray(projectData.pieces)) {
      errors.push('Piezas debe ser un array')
    }
    
    // Validar sheets array
    if (projectData.sheets && !Array.isArray(projectData.sheets)) {
      errors.push('Sheets debe ser un array')
    }
    
    if (errors.length > 0) {
      console.warn('⚠️ Advertencias de validación:', errors)
      // No lanzar error, solo log warnings para no bloquear la carga
    }
    
    return true
  }

  /**
   * 🔄 EJECUTAR OPERACIÓN CON MANEJO DE CONEXIÓN
   * Reintentos automáticos y timeouts para operaciones de red
   */
  const executeWithConnectionHandling = async (operation, operationName) => {
    const MAX_RETRIES = 2
    const TIMEOUT_MS = 10000
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        // Crear timeout promise
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error(`Timeout en ${operationName}`)), TIMEOUT_MS)
        })
        
        // Ejecutar operación con timeout
        const result = await Promise.race([operation(), timeoutPromise])
        return result
        
      } catch (error) {
        console.error(`❌ Intento ${attempt} fallido para ${operationName}:`, error)
        
        // Verificar si es error de conexión
        const isConnectionError = 
          error.code === 'unavailable' || 
          error.message.includes('network') ||
          error.message.includes('offline') ||
          error.message.includes('timeout')
        
        if (isConnectionError && attempt < MAX_RETRIES) {
          console.log(`🔄 Reintentando ${operationName}... (${attempt}/${MAX_RETRIES})`)
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt)) // Backoff exponencial
          continue
        }
        
        // Si no es error de conexión o se agotaron los intentos
        throw error
      }
    }
  }

  // ===========================================================================
  // 🔄 EFECTOS Y MANEJADORES PRINCIPALES (MEJORADOS)
  // ===========================================================================

  /**
   * 📥 CARGA EL PROYECTO DESDE FIRESTORE - CON VALIDACIONES MEJORADAS
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

        // ✅ CARGAR PROYECTO CON MANEJO DE CONEXIÓN
        const projectData = await executeWithConnectionHandling(
          () => projectService.getProject(id, user.uid),
          'carga de proyecto'
        )
        
        console.log('✅ Proyecto cargado exitosamente:', projectData)
        
        // ✅ VALIDAR DATOS ANTES DE USARLOS
        try {
          validateProjectData(projectData)
        } catch (validationError) {
          console.error('❌ Datos de proyecto corruptos:', validationError)
          setError('Los datos del proyecto están corruptos. Se cargará una versión limpia.')
          // Cargar proyecto limpio
          setProject({ 
            id: id,
            name: 'Proyecto Recuperado',
            sheetConfig: { width: 2440, height: 1220 },
            pieces: [],
            sheets: []
          })
          setProjectName('Proyecto Recuperado')
          reset()
          setIsLoading(false)
          return
        }
        
        // ✅ ESTABLECER DATOS EN EL ESTADO
        setProject(projectData)
        setProjectName(projectData.name || 'Sin nombre')
        setSheetConfig(projectData.sheetConfig || { width: 2440, height: 1220 })
        
        // ✅ RESETEAR Y CARGAR DATOS EN EL OPTIMIZADOR
        reset() // Limpiar estado anterior
        
        // ✅ SANITIZAR Y CARGAR PIEZAS
        if (projectData.pieces && projectData.pieces.length > 0) {
          const sanitizedPieces = sanitizePieces(projectData.pieces)
          console.log(`✅ ${sanitizedPieces.length} piezas válidas de ${projectData.pieces.length} totales`)
          
          // Cargar solo piezas sanitizadas
          sanitizedPieces.forEach(piece => {
            addPiece(piece)
          })
        } else {
          console.log('ℹ️ No hay piezas para cargar')
        }

        // Las sheets se cargan automáticamente desde projectData
        console.log('📊 Sheets disponibles:', projectData.sheets?.length || 0)
        
      } catch (error) {
        console.error('❌ Error crítico al cargar proyecto:', error)
        
        // ✅ MANEJO DETALLADO DE ERRORES DE PERMISOS Y CONEXIÓN
        let errorMessage = 'Error al cargar el proyecto'
        
        if (error.message.includes('permisos') || error.message.includes('permission') || error.code === 'permission-denied') {
          errorMessage = '❌ No tienes permisos para acceder a este proyecto. Puede que haya sido eliminado o no te pertenezca.'
        } else if (error.message.includes('no existe')) {
          errorMessage = '❌ El proyecto no existe o ha sido eliminado'
        } else if (error.message.includes('configuración')) {
          errorMessage = '❌ Error de configuración de la base de datos'
        } else if (error.code === 'unauthenticated') {
          errorMessage = '❌ Sesión expirada. Por favor, vuelve a iniciar sesión.'
          // Redirigir al login después de 2 segundos
          setTimeout(() => navigate('/'), 2000)
        } else if (error.message.includes('Timeout')) {
          errorMessage = '❌ Tiempo de espera agotado. Verifica tu conexión a internet.'
        } else if (error.message.includes('network') || error.code === 'unavailable') {
          errorMessage = '❌ Error de conexión. Verifica tu internet e intenta nuevamente.'
        } else {
          errorMessage = `❌ ${error.message}`
        }
        
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    loadProject()
  }, [id, user, reset, addPiece, navigate, sanitizePieces])

  /**
   * 🚀 RE-OPTIMIZAR PROYECTO - CON MANEJO DE CONEXIÓN
   */
  const handleReoptimize = async () => {
    setError('')
    
    try {
      await executeWithConnectionHandling(
        async () => {
          if (pieces.length === 0) {
            throw new Error('❌ No hay piezas para optimizar')
          }
          if (sheetConfig.width <= 0 || sheetConfig.height <= 0) {
            throw new Error('❌ El tamaño de la placa debe ser mayor a 0')
          }
          
          console.log('🔄 Re-optimizando proyecto...')
          await optimize(sheetConfig.width, sheetConfig.height)
          setHasChanges(true)
        },
        're-optimización'
      )
    } catch (error) {
      const errorMessage = error.message.includes('Timeout') 
        ? 'La operación está tomando demasiado tiempo. Verifica tu conexión.'
        : `❌ Error en optimización: ${error.message}`
      
      setError(errorMessage)
      console.error('Error en re-optimización:', error)
    }
  }

  /**
   * 💾 GUARDAR CAMBIOS EN FIRESTORE - CON MANEJO DE CONEXIÓN
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
      await executeWithConnectionHandling(
        async () => {
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
        },
        'guardado de cambios'
      )
    } catch (error) {
      console.error('❌ Error al guardar cambios:', error)
      
      let userFriendlyError = `❌ Error al guardar: ${error.message}`
      if (error.message.includes('Timeout') || error.message.includes('network')) {
        userFriendlyError = '❌ Error de conexión. Verifica tu internet e intenta nuevamente.'
      } else if (error.code === 'permission-denied') {
        userFriendlyError = '❌ No tienes permisos para modificar este proyecto.'
      }
      
      setError(userFriendlyError)
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
  // 🎨 RENDERIZADO (SIN CAMBIOS - MANTIENE FUNCIONALIDAD EXISTENTE)
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