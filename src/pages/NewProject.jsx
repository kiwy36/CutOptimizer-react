/**
 * ➕ NEW PROJECT - Versión actualizada con comunicación mejorada entre componentes
 * 
 * 📍 FUNCIÓN:
 * - Permite crear, optimizar y guardar nuevos proyectos de corte
 * - Usa el hook global useOptimizer para compartir estado entre componentes
 * - Integra comunicación directa con InputPanel y ResultsPanel
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { projectService } from '../services/firebase'
import useAuth from '../hooks/useAuth'
import useOptimizer from '../hooks/useOptimizer'
import InputPanel from '../components/optimizer/InputPanel'
import ResultsPanel from '../components/optimizer/ResultsPanel'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import ErrorMessage from '../components/shared/ErrorMessage'
import './NewProject.css'

const NewProject = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  // 🧩 Hook del optimizador - ESTADO COMPARTIDO GLOBAL
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

  // 🧠 Estado local del componente
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
      // Validar que haya piezas cargadas
      if (pieces.length === 0) {
        setError('Agrega al menos una pieza para optimizar')
        return
      }

      // Validar configuración de placa
      if (sheetConfig.width <= 0 || sheetConfig.height <= 0) {
        setError('El tamaño de la placa debe ser mayor a 0')
        return
      }

      console.log('🔄 Optimizando con:', { 
        pieces: pieces.length, 
        sheetConfig,
        piecesDetails: pieces 
      })

      // Ejecutar optimización
      await optimize(sheetConfig.width, sheetConfig.height)
      
      console.log('✅ Optimización completada. Sheets:', sheets)
      
    } catch (error) {
      setError(error.message)
      console.error('Error en optimización:', error)
    }
  }

  /**
   * 💾 Maneja el guardado del proyecto
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
      console.log('💾 Guardando proyecto en Firebase...');
      
      // ✅ NUEVO: Guardar en Firebase usando projectService
      const projectData = {
        name: projectName.trim(),
        sheetConfig: {
          width: sheetConfig.width,
          height: sheetConfig.height
        },
        pieces: pieces,
        sheets: sheets,
        stats: calculateStats(),
        userId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const savedProject = await projectService.createProject(projectData, user.uid);
      
      console.log('✅ Proyecto guardado exitosamente:', savedProject.id);
      
      // Mostrar mensaje de éxito
      setError(''); // Limpiar errores
      
      // Redirigir a la lista de proyectos después de 1 segundo
      setTimeout(() => {
        navigate('/projects');
      }, 1000);
      
    } catch (error) {
      console.error('❌ Error al guardar proyecto:', error);
      setError('Error al guardar el proyecto: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  }

  /**
   * 🔄 Reinicia el proyecto actual
   */
  const handleReset = () => {
    reset()
    setProjectName('')
    setSheetConfig({ width: 2440, height: 1220 })
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
      {/* 🧭 Header principal */}
      <div className="project-header">
        <div className="header-content">
          <h1>Nuevo Proyecto</h1>
          <p>Crea y optimiza un nuevo proyecto de cortes</p>
        </div>
        
        {/* ✏️ Nombre del proyecto */}
        <div className="project-name-section">
          <input
            type="text"
            placeholder="Nombre del proyecto..."
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="project-name-input"
            disabled={isSaving}
          />
        </div>
      </div>

      {/* ⚠️ Mensajes de error */}
      {error && (
        <ErrorMessage 
          message={error} 
          type="error"
          onClose={() => setError('')}
        />
      )}

      {/* 🧩 Layout principal: InputPanel ↔ ResultsPanel */}
      <div className="optimizer-layout">
        {/* Columna izquierda: Entrada de datos */}
        <div className="input-column">
          <InputPanel 
            // Estado compartido
            sheetConfig={sheetConfig}
            onSheetConfigChange={handleSheetConfigChange}
            onOptimize={handleOptimize}
            onSaveProject={handleSaveProject} // ✅ NUEVO
            onReset={handleReset} // ✅ NUEVO
            // Funciones del optimizador
            addPiece={addPiece}
            removePiece={removePiece}
            pieces={pieces}
            config={config}
            updateConfig={updateConfig}
            isOptimizing={isOptimizing}
            isSaving={isSaving} // ✅ NUEVO
            projectName={projectName} // ✅ NUEVO
          />
        </div>

        {/* Columna derecha: Resultados */}
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

      {/* 🔄 Estado de carga global */}
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
