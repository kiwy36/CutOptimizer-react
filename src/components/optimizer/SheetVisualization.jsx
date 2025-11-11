/**
 * 🎨 SHEET VISUALIZATION - MEJORADO para visualización inmediata de planchas
 * 
 * 📍 FUNCIÓN MEJORADA:
 * - Renderiza planchas tanto optimizadas como no optimizadas
 * - Muestra plancha vacía cuando no hay piezas colocadas
 * - Visualización inmediata al configurar plancha
 * - Estados diferentes para planchas optimizadas vs configuradas
 * 
 * 🎯 NUEVAS CARACTERÍSTICAS:
 * - Modo "configuración": Plancha vacía esperando piezas
 * - Modo "optimizado": Plancha con piezas organizadas
 * - Indicadores visuales del estado
 * - Tooltips informativos mejorados
 */

import React from 'react'
import './SheetVisualization.css'

const SheetVisualization = ({ 
  sheet, 
  scale = 0.2,
  mode = 'optimized' // 'configuring' | 'optimized'
}) => {
  /**
   * 🎨 Calcula el color de contraste para texto
   */
  const getContrastColor = (hexColor) => {
    if (!hexColor) return 'black'
    
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

  /**
   * 🎯 Obtiene la clase CSS según el modo y eficiencia
   */
  const getSheetContainerClass = () => {
    let className = 'sheet-container'
    
    if (mode === 'configuring') {
      className += ' configuring-mode'
    } else if (sheet.efficiency !== undefined) {
      if (sheet.efficiency >= 85) className += ' high-efficiency'
      else if (sheet.efficiency >= 70) className += ' medium-efficiency'
      else className += ' low-efficiency'
    }
    
    return className
  }

  /**
   * 📊 Obtiene el texto del tooltip según el modo
   */
  const getSheetTooltip = () => {
    if (mode === 'configuring') {
      return `Plancha configurada: ${sheet.width} × ${sheet.height} mm - Esperando piezas`
    } else {
      return `Plancha optimizada: ${sheet.width} × ${sheet.height} mm - Eficiencia: ${sheet.efficiency?.toFixed(1) || 0}%`
    }
  }

  const scaledWidth = sheet.width * scale
  const scaledHeight = sheet.height * scale

  return (
    <div className="sheet-visualization">
      <div 
        className={getSheetContainerClass()}
        style={{
          width: `${scaledWidth}px`,
          height: `${scaledHeight}px`
        }}
        title={getSheetTooltip()}
      >
        {/* Fondo de la placa con patrón de grid */}
        <div className="sheet-background"></div>
        
        {/* Estado de configuración - Plancha vacía */}
        {mode === 'configuring' && (
          <div className="configuring-state">
            <div className="configuring-icon">📋</div>
            <div className="configuring-text">
              <div>Plancha Configurada</div>
              <div className="configuring-dimensions">
                {sheet.width} × {sheet.height} mm
              </div>
            </div>
          </div>
        )}
        
        {/* Piezas colocadas en la placa (solo en modo optimizado) */}
        {mode === 'optimized' && sheet.pieces && sheet.pieces.map((piece, index) => {
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
          {mode === 'configuring' && ' (Configurada)'}
          {mode === 'optimized' && sheet.efficiency && ` - ${sheet.efficiency.toFixed(1)}%`}
        </div>

        {/* Indicador de modo */}
        <div className="sheet-mode-indicator">
          {mode === 'configuring' && '⚙️ Configurando'}
          {mode === 'optimized' && '🎯 Optimizada'}
        </div>
      </div>
    </div>
  )
}

export default SheetVisualization