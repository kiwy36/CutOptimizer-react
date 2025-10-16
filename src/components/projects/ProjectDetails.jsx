import React from 'react'
import { optimizer } from '../../utils/optimizer'

/**
 * 🔍 PROJECT DETAILS COMPONENT
 * 📍 Muestra detalles y estadísticas de un proyecto
 */
export default function ProjectDetails({ project }) {
  /**
   * 📊 Calcular estadísticas detalladas
   */
  const getDetailedStats = () => {
    if (!project.sheets || project.sheets.length === 0) {
      return null
    }

    const stats = optimizer.calculateStats(project.sheets)
    const totalPieces = project.pieces?.length || 0
    const rotatedPieces = project.sheets?.flatMap(sheet => 
      sheet.pieces?.filter(piece => piece.rotated) || []
    ).length || 0

    return {
      ...stats,
      totalPieces,
      rotatedPieces,
      rotationRate: totalPieces > 0 ? (rotatedPieces / totalPieces * 100) : 0
    }
  }

  const stats = getDetailedStats()

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Sin datos de optimización
        </h3>
        <p className="text-gray-600">
          Este proyecto no tiene datos de optimización guardados.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Estadísticas del Proyecto
      </h2>
      
      {/* Grid de estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.totalSheets}</div>
          <div className="text-sm text-blue-700">Placas usadas</div>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{stats.totalPieces}</div>
          <div className="text-sm text-green-700">Total piezas</div>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{stats.rotatedPieces}</div>
          <div className="text-sm text-purple-700">Piezas rotadas</div>
        </div>
        
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{stats.efficiency.toFixed(1)}%</div>
          <div className="text-sm text-yellow-700">Eficiencia</div>
        </div>
      </div>

      {/* Detalles de área */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Uso de Material</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Área total:</span>
              <span className="font-semibold">{(stats.totalArea / 1000000).toFixed(2)} m²</span>
            </div>
            <div className="flex justify-between">
              <span>Área utilizada:</span>
              <span className="font-semibold text-green-600">{(stats.usedArea / 1000000).toFixed(2)} m²</span>
            </div>
            <div className="flex justify-between">
              <span>Desperdicio:</span>
              <span className="font-semibold text-red-600">{(stats.wasteArea / 1000000).toFixed(2)} m²</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Configuración</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Tamaño de placa:</span>
              <span className="font-semibold">
                {project.sheetWidth}×{project.sheetHeight}mm
              </span>
            </div>
            <div className="flex justify-between">
              <span>Piezas rotadas:</span>
              <span className="font-semibold">{stats.rotationRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Fecha de creación:</span>
              <span className="font-semibold">
                {project.createdAt?.toDate?.().toLocaleDateString('es-ES') || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de eficiencia */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Eficiencia del material</span>
          <span>{stats.efficiency.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              stats.efficiency >= 85 ? 'bg-green-500' :
              stats.efficiency >= 70 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(stats.efficiency, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  )
}