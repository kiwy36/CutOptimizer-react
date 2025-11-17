/**
 * 📦 PIECE MANAGER - Componente para gestión avanzada de piezas
 * 
 * 📍 FUNCIÓN:
 * - Gestión más detallada de piezas individuales
 * - Operaciones en lote y validaciones
 * - Previsualización de piezas antes de optimizar
 * - Complemento a InputPanel con funcionalidad avanzada
 * 
 * 🎯 CARACTERÍSTICAS:
 * - Vista de grid de piezas con miniaturas
 * - Validaciones de tamaño y cantidad
 * - Operaciones en lote (duplicar, eliminar múltiples)
 * - Filtrado y búsqueda de piezas
 */

import React, { useState } from 'react'
import useOptimizer from '../../hooks/useOptimizer'
import './PieceManager.css'

const PieceManager = () => {
  const {
    pieces,
    addPiece,
    removePiece
  } = useOptimizer()

  const [selectedPieces, setSelectedPieces] = useState(new Set())
  const [filter, setFilter] = useState('')

  /**
   * 🔄 Maneja la selección/deselección de piezas
   */
  const togglePieceSelection = (pieceId) => {
    setSelectedPieces(prev => {
      const newSelection = new Set(prev)
      if (newSelection.has(pieceId)) {
        newSelection.delete(pieceId)
      } else {
        newSelection.add(pieceId)
      }
      return newSelection
    })
  }

  /**
   * ➕ Duplica piezas seleccionadas
   */
  const duplicateSelected = () => {
    pieces.forEach(piece => {
      if (selectedPieces.has(piece.id)) {
        addPiece({
          width: piece.width,
          height: piece.height,
          quantity: piece.quantity,
          color: piece.color
        })
      }
    })
    setSelectedPieces(new Set())
  }

  /**
   * 🗑️ Elimina piezas seleccionadas
   */
  const deleteSelected = () => {
    selectedPieces.forEach(pieceId => {
      removePiece(pieceId)
    })
    setSelectedPieces(new Set())
  }

  /**
   * 📊 Calcula estadísticas de las piezas
   */
  const calculatePieceStats = () => {
    const totalPieces = pieces.reduce((sum, piece) => sum + piece.quantity, 0)
    const totalArea = pieces.reduce((sum, piece) => sum + (piece.width * piece.height * piece.quantity), 0)
    const uniqueSizes = new Set(pieces.map(p => `${p.width}x${p.height}`)).size

    return { totalPieces, totalArea, uniqueSizes }
  }

  const stats = calculatePieceStats()
  const filteredPieces = pieces.filter(piece => 
    `${piece.width}x${piece.height}`.includes(filter) ||
    piece.color.includes(filter)
  )

  return (
    <div className="piece-manager">
      {/* Header con estadísticas y controles */}
      <div className="piece-manager-header">
        <h3>Gestión de Piezas</h3>
        <div className="piece-stats">
          <span>{stats.totalPieces} piezas total</span>
          <span>{stats.uniqueSizes} tamaños únicos</span>
          <span>{Math.round(stats.totalArea / 1000000 * 100) / 100} m² área total</span>
        </div>
      </div>

      {/* Controles de lote */}
      {selectedPieces.size > 0 && (
        <div className="batch-controls">
          <span>{selectedPieces.size} piezas seleccionadas</span>
          <button 
            className="batch-btn duplicate-btn"
            onClick={duplicateSelected}
          >
            📋 Duplicar Seleccionadas
          </button>
          <button 
            className="batch-btn delete-btn"
            onClick={deleteSelected}
          >
            🗑️ Eliminar Seleccionadas
          </button>
          <button 
            className="batch-btn clear-btn"
            onClick={() => setSelectedPieces(new Set())}
          >
            ❌ Limpiar Selección
          </button>
        </div>
      )}

      {/* Filtro de búsqueda */}
      <div className="filter-controls">
        <input
          type="text"
          placeholder="Filtrar por tamaño (ej: 300x200) o color..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-input"
        />
        {filter && (
          <button 
            className="clear-filter"
            onClick={() => setFilter('')}
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Grid de piezas */}
      <div className="pieces-grid">
        {filteredPieces.length === 0 ? (
          <div className="no-pieces">
            {pieces.length === 0 ? (
              <>
                <div className="no-pieces-icon">📦</div>
                <p>No hay piezas agregadas </p>
              </>
            ) : (
              <>
                <div className="no-pieces-icon">🔍</div>
                <p>No se encontraron piezas que coincidan con "{filter}"</p>
              </>
            )}
          </div>
        ) : (
          filteredPieces.map((piece) => (
            <div 
              key={piece.id}
              className={`piece-card ${selectedPieces.has(piece.id) ? 'selected' : ''}`}
              onClick={() => togglePieceSelection(piece.id)}
            >
              <div className="piece-card-header">
                <div 
                  className="piece-preview"
                  style={{
                    backgroundColor: piece.color,
                    aspectRatio: `${piece.width}/${piece.height}`
                  }}
                ></div>
                <input
                  type="checkbox"
                  checked={selectedPieces.has(piece.id)}
                  onChange={() => togglePieceSelection(piece.id)}
                  className="piece-checkbox"
                />
              </div>
              
              <div className="piece-card-info">
                <div className="piece-dimensions">
                  {piece.width} × {piece.height} mm
                </div>
                <div className="piece-quantity">
                  {piece.quantity} unidad{piece.quantity !== 1 ? 'es' : ''}
                </div>
                <div className="piece-area">
                  Área: {(piece.width * piece.height).toLocaleString()} mm²
                </div>
              </div>

              <div className="piece-card-actions">
                <button
                  className="action-btn delete-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    removePiece(piece.id)
                  }}
                  title="Eliminar pieza"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default PieceManager