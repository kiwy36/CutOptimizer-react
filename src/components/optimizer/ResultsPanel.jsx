/**
 * 📊 RESULTS PANEL - OPTIMIZADO CON LAZY LOADING
 * 
 * 🚀 MEJORAS IMPLEMENTADAS:
 * - Lazy loading para SheetVisualization (carga bajo demanda)
 * - Suspense con fallback elegante
 * - Memoización de cálculos costosos
 * - Mejor manejo de estados de carga
 */

import React, { Suspense, useMemo } from 'react'
import './ResultsPanel.css'

// 🚀 LAZY LOADING - SheetVisualization se carga solo cuando es necesario
// ❌ NO importamos SheetVisualization directamente
const LazySheetVisualization = React.lazy(() => 
  import('./SheetVisualization').then(module => ({
    default: module.default
  }))
)

// 🎯 COMPONENTE DE CARGA PARA SUSPENSE
const SheetVisualizationFallback = ({ dimensions }) => (
  <div className="sheet-visualization-fallback">
    <div className="fallback-spinner"></div>
    <div className="fallback-text">
      Cargando visualización...
      {dimensions && <span>{dimensions.width} × {dimensions.height} mm</span>}
    </div>
  </div>
)

const ResultsPanel = ({ 
  sheetConfig = {},
  currentPieces = [],
  sheets = [],
  problematicPieces = [],
  isOptimizing = false,
  calculateStats = () => ({})
}) => {

  // 🧠 MEMOIZACIÓN DE CÁLCULOS COSTOSOS
  const stats = useMemo(() => calculateStats(), [calculateStats])

  const getEfficiencyClass = (efficiency) => {
    if (efficiency >= 85) return 'efficiency-high'
    if (efficiency >= 70) return 'efficiency-medium'
    return 'efficiency-low'
  }

  // 🎯 MEMOIZAR PLANCHA CONFIGURADA
  const configuredSheet = useMemo(() => ({
    id: 'configured-sheet',
    width: sheetConfig.width || 2440,
    height: sheetConfig.height || 1220,
    pieces: [],
    usedArea: 0,
    efficiency: 0
  }), [sheetConfig.width, sheetConfig.height])

  const shouldShowConfiguredSheets = useMemo(() => {
    return sheetConfig.width > 0 && 
           sheetConfig.height > 0 && 
           sheets.length === 0
  }, [sheetConfig.width, sheetConfig.height, sheets.length])

  // 🎯 MEMOIZAR ESCALAS PARA EVITAR CÁLCULOS REDUNDANTES
  const getSheetScale = (sheetWidth) => {
    return Math.min(0.3, 400 / sheetWidth)
  }

  return (
    <div className="results-panel">
      {/* Estado de carga de optimización */}
      {isOptimizing && (
        <div className="optimization-loading">
          <div className="loading-spinner"></div>
          <p>Optimizando cortes...</p>
        </div>
      )}

      {/* Visualización de Planchas - CON LAZY LOADING */}
      <div className="sheets-visualization-section">
        <h3>📊 Visualización de Planchas</h3>
        
        {/* Estado: Planchas optimizadas */}
        {sheets.length > 0 && (
          <div className="optimized-sheets">
            <div className="section-header">
              <h4>🎯 Planchas Optimizadas</h4>
              <span className="section-badge">{sheets.length} placas utilizadas</span>
            </div>
            <div className="sheets-grid">
              {sheets.map((sheet, index) => (
                <div key={sheet.id || index} className="sheet-card optimized">
                  <div className="sheet-header">
                    <h4>Placa {index + 1}</h4>
                    <span className={`sheet-efficiency ${getEfficiencyClass(sheet.efficiency)}`}>
                      {sheet.efficiency?.toFixed(1) || 0}%
                    </span>
                  </div>
                  
                  {/* 🚀 LAZY LOADING CON SUSPENSE */}
                  <Suspense fallback={<SheetVisualizationFallback dimensions={sheet} />}>
                    <LazySheetVisualization 
                      sheet={sheet}
                      scale={getSheetScale(sheet.width)}
                      mode="optimized"
                    />
                  </Suspense>
                  
                  <div className="sheet-info">
                    <span>Piezas: {sheet.pieces?.length || 0}</span>
                    <span>Utilización: {((sheet.usedArea / (sheet.width * sheet.height)) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estado: Plancha configurada (antes de optimizar) */}
        {shouldShowConfiguredSheets && (
          <div className="configured-sheets">
            <div className="section-header">
              <h4>⚙️ Plancha Configurada</h4>
              <span className="section-badge">
                {currentPieces.length > 0 
                  ? `${currentPieces.length} piezas listas` 
                  : 'Esperando piezas'
                }
              </span>
            </div>
            <div className="sheets-grid">
              <div className="sheet-card configured">
                <div className="sheet-header">
                  <h4>Placa Principal</h4>
                  <span className="sheet-status">
                    {currentPieces.length > 0 ? 'Lista para optimizar' : 'Configurada'}
                  </span>
                </div>
                
                {/* 🚀 LAZY LOADING TAMBIÉN PARA MODO CONFIGURACIÓN */}
                <Suspense fallback={<SheetVisualizationFallback dimensions={configuredSheet} />}>
                  <LazySheetVisualization 
                    sheet={configuredSheet}
                    scale={getSheetScale(sheetConfig.width)}
                    mode="configuring"
                  />
                </Suspense>
                
                <div className="sheet-info">
                  <span>Tamaño: {sheetConfig.width} × {sheetConfig.height} mm</span>
                  <span>Área disponible: {(sheetConfig.width * sheetConfig.height).toLocaleString()} mm²</span>
                  {currentPieces.length > 0 && (
                    <span>Piezas listas: {currentPieces.length}</span>
                  )}
                </div>
                <div className="optimization-prompt">
                  {currentPieces.length > 0 ? (
                    <>
                      <p>✅ {currentPieces.length} piezas listas para optimizar</p>
                      <small>Haz clic en "Optimizar Cortes" para organizar las piezas</small>
                    </>
                  ) : (
                    <>
                      <p>📋 Plancha lista para usar</p>
                      <small>Agrega piezas usando el panel izquierdo</small>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Estado: Sin planchas configuradas */}
        {!sheetConfig.width && !sheetConfig.height && sheets.length === 0 && (
          <div className="no-sheets">
            <div className="no-sheets-content">
              <div className="no-sheets-icon">📐</div>
              <h4>No hay planchas configuradas</h4>
              <p>Configura el tamaño de la plancha en el panel izquierdo para comenzar</p>
            </div>
          </div>
        )}
      </div>

      {/* Panel de estadísticas (solo cuando hay resultados) */}
      {sheets.length > 0 && (
        <div className="stats-panel">
          <h3>📈 Resultados de Optimización</h3>
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
              <span className="stat-value">{stats.totalArea?.toLocaleString() || 0} mm²</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">Área utilizada:</span>
              <span className="stat-value">{stats.usedArea?.toLocaleString() || 0} mm²</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">Desperdicio:</span>
              <span className="stat-value">{stats.wasteArea?.toLocaleString() || 0} mm²</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">Eficiencia:</span>
              <span className={`stat-value ${getEfficiencyClass(stats.efficiency || 0)}`}>
                {(stats.efficiency || 0).toFixed(2)}%
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
        </div>
      )}
    </div>
  )
}

export default ResultsPanel