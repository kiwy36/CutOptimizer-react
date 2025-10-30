/**
 * 📊 RESULTS PANEL - Panel de visualización de resultados de optimización
 * 
 * 📍 FUNCIÓN:
 * - Muestra estadísticas y resultados de la optimización
 * - Visualización de placas con piezas organizadas
 * - Información sobre piezas problemáticas
 * - Migrado de renderer.js con mejoras React
 * 
 * 🎯 CARACTERÍSTICAS:
 * - Estadísticas de eficiencia y utilización
 * - Grid de visualización de placas optimizadas
 * - Manejo de piezas que no pudieron colocarse
 * - Integración con SheetVisualization
 */

import React from 'react'
import useOptimizer from '../../hooks/useOptimizer'
import SheetVisualization from './SheetVisualization'
import './ResultsPanel.css'

const ResultsPanel = () => {
  const {
    sheets,
    problematicPieces,
    isOptimizing,
    calculateStats
  } = useOptimizer()

  const stats = calculateStats()

  /**
   * 🎨 Obtiene la clase CSS para el indicador de eficiencia
   */
  const getEfficiencyClass = (efficiency) => {
    if (efficiency >= 85) return 'efficiency-high'
    if (efficiency >= 70) return 'efficiency-medium'
    return 'efficiency-low'
  }

  return (
    <div className="results-panel">
      {/* Estado de carga */}
      {isOptimizing && (
        <div className="optimization-loading">
          <div className="loading-spinner"></div>
          <p>Optimizando cortes...</p>
        </div>
      )}

      {/* Panel de estadísticas */}
      <div className="stats-panel">
        <h3>Resultados de Optimización</h3>
        
        {sheets.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">📊</div>
            <h4>No hay resultados para mostrar</h4>
            <p>Configura las piezas y ejecuta la optimización para ver los resultados.</p>
          </div>
        ) : (
          <>
            {/* Grid de estadísticas */}
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Placas utilizadas:</span>
                <span className="stat-value">{stats.totalSheets}</span>
              </div>
              
              <div className="stat-item">
                <span className="stat-label">Total piezas colocadas:</span>
                <span className="stat-value">{stats.totalPieces}</span>
              </div>
              
              <div className="stat-item">
                <span className="stat-label">Área total:</span>
                <span className="stat-value">{stats.totalArea.toLocaleString()} mm²</span>
              </div>
              
              <div className="stat-item">
                <span className="stat-label">Área utilizada:</span>
                <span className="stat-value">{stats.usedArea.toLocaleString()} mm²</span>
              </div>
              
              <div className="stat-item">
                <span className="stat-label">Desperdicio:</span>
                <span className="stat-value">{stats.wasteArea.toLocaleString()} mm²</span>
              </div>
              
              <div className="stat-item">
                <span className="stat-label">Eficiencia:</span>
                <span className={`stat-value ${getEfficiencyClass(stats.efficiency)}`}>
                  {stats.efficiency.toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Piezas problemáticas */}
            {problematicPieces.length > 0 && (
              <div className="problematic-pieces-warning">
                <div className="warning-header">
                  <span className="warning-icon">⚠️</span>
                  <h4>Piezas no colocadas: {problematicPieces.length}</h4>
                </div>
                <div className="problematic-list">
                  {problematicPieces.slice(0, 5).map((piece, index) => (
                    <div key={index} className="problematic-item">
                      <span className="piece-dimensions">
                        {piece.width} × {piece.height} mm
                      </span>
                      <span className="problem-reason">{piece.reason}</span>
                    </div>
                  ))}
                  {problematicPieces.length > 5 && (
                    <div className="more-problems">
                      ... y {problematicPieces.length - 5} piezas más
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Visualización de placas */}
      {sheets.length > 0 && (
        <div className="sheets-visualization">
          <h3>Visualización de Placas</h3>
          <div className="sheets-grid">
            {sheets.map((sheet, index) => (
              <div key={sheet.id} className="sheet-card">
                <div className="sheet-header">
                  <h4>Placa {index + 1}</h4>
                  <span className="sheet-efficiency">
                    Eficiencia: {sheet.efficiency.toFixed(1)}%
                  </span>
                </div>
                <SheetVisualization 
                  sheet={sheet}
                  scale={400 / sheet.width}
                />
                <div className="sheet-info">
                  <span>Piezas: {sheet.pieces.length}</span>
                  <span>Utilización: {((sheet.usedArea / (sheet.width * sheet.height)) * 100).toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ResultsPanel