/**
 * 📋 INPUT PANEL - VERSIÓN ACTUALIZADA Y CONECTADA
 * 
 * 🔧 FUNCIONES:
 * - Configura las dimensiones de la placa
 * - Define parámetros del algoritmo
 * - Permite agregar y eliminar piezas
 * - Ejecuta, guarda y reinicia proyectos
 * 
 * 🤝 Integrado con: NewProject.jsx y useOptimizer()
 */

import React from 'react'
import './InputPanel.css'

const InputPanel = ({ 
  sheetConfig,
  onSheetConfigChange,
  onOptimize,
  onSaveProject, // ✅ NUEVO
  onReset, // ✅ NUEVO
  addPiece,
  removePiece,
  pieces,
  config,
  updateConfig,
  isOptimizing,
  isSaving, // ✅ NUEVO
  projectName // ✅ NUEVO
}) => {
  const [newPiece, setNewPiece] = React.useState({
    width: 300,
    height: 200,
    quantity: 1,
    color: '#3b82f6'
  })

  /**
   * ➕ Maneja la adición de una nueva pieza
   */
  const handleAddPiece = () => {
    if (newPiece.width > 0 && newPiece.height > 0 && newPiece.quantity > 0) {
      addPiece(newPiece)
      // Resetear formulario con nuevo color aleatorio
      setNewPiece({
        width: 300,
        height: 200,
        quantity: 1,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
      })
    }
  }

  /**
   * 🔄 Maneja cambios en la configuración de la placa
   */
  const handleSheetConfigChange = (field, value) => {
    const numericValue = parseInt(value) || 0
    onSheetConfigChange(field, numericValue)
  }

  /**
   * 🔄 Maneja cambios en la nueva pieza
   */
  const handleNewPieceChange = (field, value) => {
    setNewPiece(prev => ({
      ...prev,
      [field]: field === 'color' ? value : parseInt(value) || 0
    }))
  }

  return (
    <div className="input-panel">
      {/* Configuración de la Placa */}
      <div className="sheet-config-section">
        <h3>📐 Configuración de la Placa</h3>
        <div className="sheet-config">
          <div className="config-group">
            <label>Ancho (mm)</label>
            <input
              type="number"
              value={sheetConfig.width}
              onChange={(e) => handleSheetConfigChange('width', e.target.value)}
              min="100"
              max="10000"
              disabled={isOptimizing || isSaving}
            />
          </div>
          <div className="config-group">
            <label>Alto (mm)</label>
            <input
              type="number"
              value={sheetConfig.height}
              onChange={(e) => handleSheetConfigChange('height', e.target.value)}
              min="100"
              max="10000"
              disabled={isOptimizing || isSaving}
            />
          </div>
        </div>
        
        {/* Presets rápidos de placa */}
        <div className="sheet-presets">
          <span>Presets:</span>
          <button 
            onClick={() => {
              onSheetConfigChange('width', 2440)
              onSheetConfigChange('height', 1220)
            }}
            disabled={isOptimizing || isSaving}
          >
            Standard (2440×1220)
          </button>
          <button 
            onClick={() => {
              onSheetConfigChange('width', 1220)
              onSheetConfigChange('height', 2440)
            }}
            disabled={isOptimizing || isSaving}
          >
            Vertical (1220×2440)
          </button>
        </div>
      </div>

      {/* Configuración del Algoritmo */}
      <div className="algorithm-config-section">
        <h3>⚙️ Configuración del Algoritmo</h3>
        <div className="algorithm-config">
          <div className="config-group">
            <label>
              <input
                type="checkbox"
                checked={config.allowRotation}
                onChange={(e) => updateConfig({ allowRotation: e.target.checked })}
                disabled={isOptimizing || isSaving}
              />
              Permitir rotación de piezas
            </label>
          </div>
          <div className="config-group">
            <label>Método de ordenamiento</label>
            <select
              value={config.sortingMethod}
              onChange={(e) => updateConfig({ sortingMethod: e.target.value })}
              disabled={isOptimizing || isSaving}
            >
              <option value="max-side-desc">Lado más largo (desc)</option>
              <option value="area-desc">Área (desc)</option>
              <option value="width-desc">Ancho (desc)</option>
              <option value="height-desc">Alto (desc)</option>
            </select>
          </div>
          <div className="config-group">
            <label>Algoritmo</label>
            <select
              value={config.algorithm}
              onChange={(e) => updateConfig({ algorithm: e.target.value })}
              disabled={isOptimizing || isSaving}
            >
              <option value="shelf">Shelf Algorithm</option>
              <option value="guillotine">Guillotine Algorithm</option>
            </select>
          </div>
        </div>
      </div>

      {/* Agregar Nueva Pieza */}
      <div className="add-piece-section">
        <h3>✂️ Agregar Nueva Pieza</h3>
        <div className="add-piece-form">
          <div className="form-group">
            <label>Ancho (mm)</label>
            <input
              type="number"
              value={newPiece.width}
              onChange={(e) => handleNewPieceChange('width', e.target.value)}
              min="1"
              disabled={isOptimizing || isSaving}
            />
          </div>
          <div className="form-group">
            <label>Alto (mm)</label>
            <input
              type="number"
              value={newPiece.height}
              onChange={(e) => handleNewPieceChange('height', e.target.value)}
              min="1"
              disabled={isOptimizing || isSaving}
            />
          </div>
          <div className="form-group">
            <label>Cantidad</label>
            <input
              type="number"
              value={newPiece.quantity}
              onChange={(e) => handleNewPieceChange('quantity', e.target.value)}
              min="1"
              max="100"
              disabled={isOptimizing || isSaving}
            />
          </div>
          <div className="form-group">
            <label>Color</label>
            <input
              type="color"
              value={newPiece.color}
              onChange={(e) => handleNewPieceChange('color', e.target.value)}
              disabled={isOptimizing || isSaving}
            />
          </div>
          <button 
            className="add-piece-btn"
            onClick={handleAddPiece}
            disabled={isOptimizing || isSaving}
          >
            + Agregar Pieza
          </button>
        </div>
      </div>

      {/* Lista de Piezas Actuales */}
      <div className="pieces-list-section">
        <h3>📦 Piezas a Optimizar ({pieces.length})</h3>
        {pieces.length === 0 ? (
          <div className="empty-state">
            <p>No hay piezas agregadas</p>
            <small>Agrega piezas usando el formulario de arriba</small>
          </div>
        ) : (
          <div className="pieces-list">
            {pieces.map((piece) => (
              <div key={piece.id} className="piece-item">
                <div 
                  className="piece-color"
                  style={{ backgroundColor: piece.color }}
                ></div>
                <div className="piece-info">
                  <span className="piece-dimensions">
                    {piece.width} × {piece.height} mm
                  </span>
                  <span className="piece-quantity">
                    {piece.quantity} unidad{piece.quantity !== 1 ? 'es' : ''}
                  </span>
                </div>
                <button
                  className="remove-piece-btn"
                  onClick={() => removePiece(piece.id)}
                  title="Eliminar pieza"
                  disabled={isOptimizing || isSaving}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BOTONES DE ACCIÓN PRINCIPALES */}
      <div className="action-buttons-section">
        <h3>Acciones del Proyecto</h3>
        <div className="action-buttons">
          <button
            onClick={onOptimize}
            disabled={isOptimizing || pieces.length === 0}
            className="botones-acciones"
          >
            {isOptimizing ? '🔄 Optimizando...' : '🚀 Optimizar Cortes'}
          </button>
          
          <div className="secondary-buttons">
            <button
              onClick={onSaveProject}
              disabled={isSaving || pieces.length === 0 || !projectName.trim()}
              className="botones-acciones"
            >
              {isSaving ? '💾 Guardando...' : '💾 Guardar Proyecto'}
            </button>
            
            <button
              onClick={onReset}
              disabled={isOptimizing || isSaving}
              className="botones-acciones"
            >
              🔄 Reiniciar Todo
            </button>
          </div>
        </div>
        
        {/* Información de estado */}
        <div className="action-status">
          {pieces.length > 0 && (
            <p>✅ {pieces.length} piezas listas para optimizar</p>
          )}
          {sheetConfig.width > 0 && sheetConfig.height > 0 && (
            <p>📐 Placa configurada: {sheetConfig.width} × {sheetConfig.height} mm</p>
          )}
          {projectName.trim() && (
            <p>📝 Proyecto: {projectName}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default InputPanel
