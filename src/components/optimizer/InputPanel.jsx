/**
 * 📋 INPUT PANEL - MEJORADO con botones de acción rápida
 */

import React from 'react'
import useOptimizer from '../../hooks/useOptimizer'
import './InputPanel.css'

const InputPanel = ({ onAddSheet, onAddCut }) => {
  const {
    pieces,
    addPiece,
    removePiece,
    config,
    updateConfig
  } = useOptimizer()

  const [sheetConfig, setSheetConfig] = React.useState({
    width: 2440,
    height: 1220
  })

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
      // Resetear formulario
      setNewPiece({
        width: 300,
        height: 200,
        quantity: 1,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`
      })
      
      // Notificar que se agregó un corte
      if (onAddCut) {
        onAddCut()
      }
    }
  }

  /**
   * 🔄 Maneja cambios en la configuración de la placa
   */
  const handleSheetConfigChange = (field, value) => {
    const numericValue = parseInt(value) || 0
    setSheetConfig(prev => ({
      ...prev,
      [field]: numericValue
    }))
    
    // Notificar cambio de configuración de plancha
    if (onAddSheet && (field === 'width' || field === 'height')) {
      onAddSheet()
    }
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

  /**
   * 📦 Agregar cortes predefinidos rápidos
   */
  const handleQuickCuts = (type) => {
    const quickCuts = {
      furniture: [
        { width: 600, height: 400, quantity: 2, color: '#3b82f6' },
        { width: 300, height: 200, quantity: 4, color: '#ef4444' },
        { width: 450, height: 300, quantity: 3, color: '#10b981' }
      ],
      cabinet: [
        { width: 500, height: 350, quantity: 6, color: '#8b5cf6' },
        { width: 200, height: 150, quantity: 8, color: '#f59e0b' }
      ]
    }
    
    const cuts = quickCuts[type] || []
    cuts.forEach(cut => addPiece(cut))
    
    // Notificar múltiples cortes agregados
    if (onAddCut && cuts.length > 0) {
      cuts.forEach(() => onAddCut())
    }
  }

  return (
    <div className="input-panel">
      {/* Botones de Acción Rápida */}
      <div className="quick-actions-section">
        <h3>Acciones Rápidas</h3>
        <div className="quick-actions">
          <button 
            className="quick-btn add-sheet-btn"
            onClick={onAddSheet}
          >
            📋 Agregar Plancha
          </button>
          <button 
            className="quick-btn add-cut-btn"
            onClick={onAddCut}
          >
            ✂️ Agregar Cortes
          </button>
          <div className="quick-presets">
            <span>Cortes rápidos:</span>
            <button onClick={() => handleQuickCuts('furniture')}>
              🛋️ Muebles
            </button>
            <button onClick={() => handleQuickCuts('cabinet')}>
              🗄️ Gabinetes
            </button>
          </div>
        </div>
      </div>

      {/* Configuración de la Placa (existente) */}
      <div className="sheet-config-section">
        <h3>Configuración de la Placa</h3>
        <div className="sheet-config">
          <div className="config-group">
            <label>Ancho (mm)</label>
            <input
              type="number"
              value={sheetConfig.width}
              onChange={(e) => handleSheetConfigChange('width', e.target.value)}
              min="100"
              max="10000"
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
            />
          </div>
        </div>
      </div>

      {/* Resto del componente permanece igual */}
      <div className="algorithm-config-section">
        <h3>Configuración del Algoritmo</h3>
        <div className="algorithm-config">
          <div className="config-group">
            <label>
              <input
                type="checkbox"
                checked={config.allowRotation}
                onChange={(e) => updateConfig({ allowRotation: e.target.checked })}
              />
              Permitir rotación de piezas
            </label>
          </div>
          <div className="config-group">
            <label>Método de ordenamiento</label>
            <select
              value={config.sortingMethod}
              onChange={(e) => updateConfig({ sortingMethod: e.target.value })}
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
            >
              <option value="shelf">Shelf Algorithm</option>
              <option value="guillotine">Guillotine Algorithm</option>
            </select>
          </div>
        </div>
      </div>

      {/* Agregar Nueva Pieza (existente) */}
      <div className="add-piece-section">
        <h3>Agregar Nueva Pieza</h3>
        <div className="add-piece-form">
          <div className="form-group">
            <label>Ancho (mm)</label>
            <input
              type="number"
              value={newPiece.width}
              onChange={(e) => handleNewPieceChange('width', e.target.value)}
              min="1"
            />
          </div>
          <div className="form-group">
            <label>Alto (mm)</label>
            <input
              type="number"
              value={newPiece.height}
              onChange={(e) => handleNewPieceChange('height', e.target.value)}
              min="1"
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
            />
          </div>
          <div className="form-group">
            <label>Color</label>
            <input
              type="color"
              value={newPiece.color}
              onChange={(e) => handleNewPieceChange('color', e.target.value)}
            />
          </div>
          <button 
            className="add-piece-btn"
            onClick={handleAddPiece}
          >
            + Agregar Pieza
          </button>
        </div>
      </div>

      {/* Lista de Piezas Actuales (existente) */}
      <div className="pieces-list-section">
        <h3>Piezas a Optimizar ({pieces.length})</h3>
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
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default InputPanel