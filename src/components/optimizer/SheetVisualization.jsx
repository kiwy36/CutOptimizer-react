/**
 * 🎨 SHEET VISUALIZATION - Componente para visualizar una placa con piezas
 * 
 * 📍 FUNCIÓN:
 * - Renderiza una placa con las piezas organizadas visualmente
 * - Muestra dimensiones y información de cada pieza
 * - Soporta diferentes escalas para visualización
 * - Colores y etiquetas para mejor legibilidad
 * 
 * 🎯 CARACTERÍSTICAS:
 * - Representación escalada de la placa y piezas
 * - Tooltips con información detallada
 * - Colores diferenciados para cada pieza
 * - Texto adaptable al tamaño de la pieza
 */

import React from 'react'
import './SheetVisualization.css'

const SheetVisualization = ({ sheet, scale = 0.2 }) => {
  /**
   * 🎨 Calcula el color de contraste para texto
   */
  const getContrastColor = (hexColor) => {
    const r = parseInt(hexColor.substr(1, 2), 16)
    const g = parseInt(hexColor.substr(3, 2), 16)
    const b = parseInt(hexColor.substr(5, 2), 16)
    
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? 'black' : 'white'
  }

  /**
   * 📏 Calcula el tamaño de fuente apropiado para la pieza
   */
  const getFontSize = (scaledWidth, scaledHeight) => {
    const minDimension = Math.min(scaledWidth, scaledHeight)
    return Math.max(8, minDimension * 0.15)
  }

  const scaledWidth = sheet.width * scale
  const scaledHeight = sheet.height * scale

  return (
    <div className="sheet-visualization">
      <div 
        className="sheet-container"
        style={{
          width: `${scaledWidth}px`,
          height: `${scaledHeight}px`
        }}
      >
        {/* Fondo de la placa con patrón de grid */}
        <div className="sheet-background"></div>
        
        {/* Piezas colocadas en la placa */}
        {sheet.pieces.map((piece, index) => {
          const scaledPieceWidth = piece.placedWidth * scale
          const scaledPieceHeight = piece.placedHeight * scale
          const scaledX = piece.x * scale
          const scaledY = piece.y * scale
          const fontSize = getFontSize(scaledPieceWidth, scaledPieceHeight)
          const textColor = getContrastColor(piece.color)

          return (
            <div
              key={index}
              className="piece"
              style={{
                width: `${scaledPieceWidth}px`,
                height: `${scaledPieceHeight}px`,
                left: `${scaledX}px`,
                top: `${scaledY}px`,
                backgroundColor: piece.color,
                borderColor: textColor
              }}
              title={`${piece.width} × ${piece.height} mm${piece.rotated ? ' (Rotada)' : ''}`}
            >
              {/* Texto solo si la pieza es lo suficientemente grande */}
              {scaledPieceWidth > 30 && scaledPieceHeight > 20 && (
                <div 
                  className="piece-label"
                  style={{
                    fontSize: `${fontSize}px`,
                    color: textColor
                  }}
                >
                  {piece.width}×{piece.height}
                  {piece.rotated && ' ↻'}
                </div>
              )}
              
              {/* Indicador de rotación */}
              {piece.rotated && scaledPieceWidth > 40 && (
                <div className="rotation-indicator" title="Pieza rotada">
                  ↻
                </div>
              )}
            </div>
          )
        })}

        {/* Información de dimensiones de la placa */}
        <div className="sheet-dimensions">
          {sheet.width} × {sheet.height} mm
        </div>
      </div>
    </div>
  )
}

export default SheetVisualization