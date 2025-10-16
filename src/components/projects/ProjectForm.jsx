import React from 'react'

/**
 * 📝 PROJECT FORM COMPONENT
 * 📍 Formulario para crear/editar información básica del proyecto
 */
export default function ProjectForm({ projectData, onChange }) {
  /**
   * 🔄 Manejar cambios en los campos
   */
  const handleChange = (field, value) => {
    onChange({
      ...projectData,
      [field]: value
    })
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Información del Proyecto
      </h2>
      
      <div className="space-y-4">
        {/* Nombre del proyecto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Proyecto *
          </label>
          <input
            type="text"
            value={projectData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Ej: Mueble de cocina - Melamina"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            value={projectData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Ej: Cortes para mueble de cocina de melamina blanca..."
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Configuración de placa */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ancho de placa (mm) *
            </label>
            <input
              type="number"
              value={projectData.sheetWidth || 2440}
              onChange={(e) => handleChange('sheetWidth', parseInt(e.target.value) || 2440)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="100"
              max="10000"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alto de placa (mm) *
            </label>
            <input
              type="number"
              value={projectData.sheetHeight || 1220}
              onChange={(e) => handleChange('sheetHeight', parseInt(e.target.value) || 1220)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="100"
              max="10000"
              required
            />
          </div>
        </div>
        
        {/* Información adicional */}
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <p className="text-sm text-blue-700">
            💡 <strong>Tip:</strong> Usa 2440×1220mm para placas estándar de melamina (8×4 pies)
          </p>
        </div>
      </div>
    </div>
  )
}