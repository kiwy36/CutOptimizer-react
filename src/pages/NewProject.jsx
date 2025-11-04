/**
 * ➕ NEW PROJECT - Página para crear nuevo proyecto de optimización
 * 
 * 📍 FUNCIÓN:
 * - Página principal para crear proyectos de optimización
 * - Integra InputPanel y ResultsPanel en un layout de dos columnas
 * - Maneja el proceso completo de optimización
 * - Permite guardar proyectos en Firestore (preparado para Fase 6)
 * 
 * 🎯 CARACTERÍSTICAS:
 * - Layout de dos columnas (entrada + resultados)
 * - Botón de optimización con validaciones
 * - Estados de carga y errores
 * - Integración completa con useOptimizer hook
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import  useAuth  from '../hooks/useAuth'
import useOptimizer from '../hooks/useOptimizer'
import InputPanel from '../components/optimizer/InputPanel'
import ResultsPanel from '../components/optimizer/ResultsPanel'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorMessage from '../components/ui/ErrorMessage'
import './NewProject.css'

const NewProject = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  // Hook del optimizador
  const {
    pieces,
    sheets,
    isOptimizing,
    optimize,
    reset,
    calculateStats
  } = useOptimizer()

  // Estado local del componente
  const [projectName, setProjectName] = useState('')
  const [sheetConfig, setSheetConfig] = useState({
    width: 2440,
    height: 1220
  })
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  /**
   * 🚀 Ejecuta el proceso de optimización
   */
  const handleOptimize = async () => {
    setError('')
    
    try {
      // Validar que hay piezas para optimizar
      if (pieces.length === 0) {
        setError('Agrega al menos una pieza para optimizar')
        return
      }

      // Validar configuración de placa
      if (sheetConfig.width <= 0 || sheetConfig.height <= 0) {
        setError('El tamaño de la placa debe ser mayor a 0')
        return
      }

      // Ejecutar optimización
      await optimize(sheetConfig.width, sheetConfig.height)
      
    } catch (error) {
      setError(error.message)
      console.error('Error en optimización:', error)
    }
  }

  /**
   * 💾 Maneja el guardado del proyecto (preparado para Firestore)
   */
  const handleSaveProject = async () => {
    if (!user) {
      setError('Debes estar autenticado para guardar proyectos')
      return
    }

    if (sheets.length === 0) {
      setError('Primero ejecuta la optimización para guardar el proyecto')
      return
    }

    if (!projectName.trim()) {
      setError('Ingresa un nombre para el proyecto')
      return
    }

    setIsSaving(true)
    setError('')

    try {
      // TODO: Implementar guardado en Firestore (Fase 6)
      console.log('Guardando proyecto:', {
        name: projectName,
        sheetConfig,
        pieces,
        sheets,
        stats: calculateStats(),
        userId: user.uid
      })

      // Simular guardado (remover en Fase 6)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirigir a la lista de proyectos
      navigate('/projects')
      
    } catch (error) {
      setError('Error al guardar el proyecto: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * 🔄 Reinicia el proyecto actual
   */
  const handleReset = () => {
    reset()
    setProjectName('')
    setError('')
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
  }

  return (
    <div className="new-project-page">
      {/* Header de la página */}
      <div className="project-header">
        <div className="header-content">
          <h1>Nuevo Proyecto</h1>
          <p>Crea y optimiza un nuevo proyecto de cortes</p>
        </div>
        
        {/* Controles principales */}
        <div className="project-controls">
          <input
            type="text"
            placeholder="Nombre del proyecto..."
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="project-name-input"
            disabled={isSaving}
          />
          
          <div className="control-buttons">
            <button
              onClick={handleOptimize}
              disabled={isOptimizing || pieces.length === 0}
              className="optimize-btn"
            >
              {isOptimizing ? '🔄 Optimizando...' : '🚀 Optimizar'}
            </button>
            
            <button
              onClick={handleSaveProject}
              disabled={isSaving || sheets.length === 0 || !projectName.trim()}
              className="save-btn"
            >
              {isSaving ? '💾 Guardando...' : '💾 Guardar Proyecto'}
            </button>
            
            <button
              onClick={handleReset}
              disabled={isOptimizing || isSaving}
              className="reset-btn"
            >
              🔄 Reiniciar
            </button>
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

      {/* Configuración rápida de placa */}
      <div className="quick-sheet-config">
        <h3>Configuración Rápida de Placa</h3>
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
          <div className="config-presets">
            <span>Presets:</span>
            <button 
              onClick={() => setSheetConfig({ width: 2440, height: 1220 })}
              disabled={isOptimizing}
            >
              Standard (2440×1220)
            </button>
            <button 
              onClick={() => setSheetConfig({ width: 1220, height: 2440 })}
              disabled={isOptimizing}
            >
              Vertical (1220×2440)
            </button>
            <button 
              onClick={() => setSheetConfig({ width: 2000, height: 1000 })}
              disabled={isOptimizing}
            >
              Mediano (2000×1000)
            </button>
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
            {isOptimizing && 'Optimizando cortes...'}
            {isSaving && 'Guardando proyecto...'}
          </p>
        </div>
      )}
    </div>
  )
}

export default NewProject