import React from 'react'
import SheetVisualization from './SheetVisualization'
import { optimizer } from '../../utils/optimizer'

/**
 * 📊 RESULTS PANEL COMPONENT
 * 📍 Muestra los resultados de la optimización
 */
export default function ResultsPanel({ sheets, problematicPieces, isOptimizing }) {
  const stats = optimizer.calculateStats(sheets)

  /**
   * 🎨 Obtener clase de eficiencia
   */
  const getEfficiencyClass = (efficiency) => {
    if (efficiency >= 85) return 'text-green-600'
    if (efficiency >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Resultados</h2>
      
      {isOptimizing ? (
        // Estado de carga
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Optimizando cortes...</p>
          </div>
        </div>
      ) : sheets.length === 0 ? (
        // Estado inicial
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-6xl mb-4">📐</div>
            <p>Configura las piezas y haz clic en "Optimizar Cortes"</p>
          </div>
        </div>
      ) : (
        // Resultados
        <div className="flex-1 overflow-auto">
          {/* Estadísticas */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-blue-800 mb-3">Resumen de Optimización</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-600">Placas utilizadas:</span>
                <span className="font-semibold ml-2">{stats.totalSheets}</span>
              </div>
              <div>
                <span className="text-blue-600">Área total:</span>
                <span className="font-semibold ml-2">{stats.totalArea.toLocaleString()} mm²</span>
              </div>
              <div>
                <span className="text-blue-600">Área utilizada:</span>
                <span className="font-semibold ml-2">{stats.usedArea.toLocaleString()} mm²</span>
              </div>
              <div>
                <span className="text-blue-600">Desperdicio:</span>
                <span className="font-semibold ml-2">{stats.wasteArea.toLocaleString()} mm²</span>
              </div>
              <div className="col-span-2">
                <span className="text-blue-600">Eficiencia:</span>
                <span className={`font-semibold ml-2 ${getEfficiencyClass(stats.efficiency)}`}>
                  {stats.efficiency.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Piezas problemáticas */}
          {problematicPieces.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-2">
                <span className="text-yellow-600 font-semibold mr-2">⚠️ Advertencia</span>
                <span className="text-yellow-700">{problematicPieces.length} pieza(s) no pudieron colocarse</span>
              </div>
              <div className="text-sm text-yellow-600">
                <ul className="list-disc list-inside space-y-1">
                  {problematicPieces.map((piece, index) => (
                    <li key={index}>
                      Pieza {piece.width}x{piece.height}mm - {piece.reason}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Visualización de placas */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Disposición en Placas</h3>
            <div className="space-y-6">
              {sheets.map((sheet, index) => (
                <SheetVisualization 
                  key={index}
                  sheet={sheet}
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* Información adicional */}
          {sheets.length > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
              <p>💡 <strong>Consejo:</strong> Las piezas en color más claro están rotadas 90°</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}