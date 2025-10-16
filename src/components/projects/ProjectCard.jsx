import React from 'react'
import { Link } from 'react-router-dom'

/**
 * 🗂️ PROJECT CARD COMPONENT
 * 📍 Tarjeta para mostrar resumen de un proyecto
 */
export default function ProjectCard({ project }) {
  /**
   * 📊 Calcular estadísticas del proyecto
   */
  const getProjectStats = () => {
    const totalPieces = project.pieces?.length || 0
    const totalSheets = project.sheets?.length || 0
    const totalArea = project.sheets?.reduce((sum, sheet) => sum + (sheet.usedArea || 0), 0) || 0
    
    return { totalPieces, totalSheets, totalArea }
  }

  /**
   * 📅 Formatear fecha
   */
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Sin fecha'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('es-ES')
  }

  const stats = getProjectStats()

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {project.name}
          </h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {project.sheets?.length || 0} placas
          </span>
        </div>

        {/* Descripción */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {project.description || 'Sin descripción'}
        </p>

        {/* Estadísticas */}
        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{stats.totalPieces}</div>
            <div className="text-xs text-gray-500">Piezas</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{stats.totalSheets}</div>
            <div className="text-xs text-gray-500">Placas</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600">
              {stats.totalArea ? (stats.totalArea / 1000000).toFixed(1) : 0}m²
            </div>
            <div className="text-xs text-gray-500">Área</div>
          </div>
        </div>

        {/* Configuración de placa */}
        <div className="bg-gray-50 rounded p-3 mb-4">
          <div className="text-sm text-gray-600">
            <strong>Placa:</strong> {project.sheetWidth || 2440}×{project.sheetHeight || 1220}mm
          </div>
        </div>

        {/* Fecha y acciones */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {formatDate(project.updatedAt || project.createdAt)}
          </span>
          
          <div className="flex space-x-2">
            <Link
              to={`/projects/edit/${project.id}`}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Editar
            </Link>
            <button className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors">
              Ver
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}