import React, { useState } from 'react'
import PieceManager from './PieceManager'

/**
 * 📥 INPUT PANEL COMPONENT
 * 📍 Panel de entrada para configurar placa y piezas
 */
export default function InputPanel({ onOptimize, isOptimizing }) {
  const [sheetConfig, setSheetConfig] = useState({
    width: 2440,
    height: 1220
  })

  const [pieces, setPieces] = useState([])

  /**
   * 🔧 Actualizar configuración de placa
   */
  const handleSheetConfigChange = (field, value) => {
    const numValue = parseInt(value) || 0
    setSheetConfig(prev => ({
      ...prev,
      [field]: numValue
    }))
  }

  /**
   * 📋 Actualizar lista de piezas
   */
  const handlePiecesUpdate = (newPieces) => {
    setPieces(newPieces)
  }

  /**
   * 🚀 Ejecutar optimización
   */
  const handleOptimizeClick = () => {
    if (pieces.length === 0) {
      alert('Agrega al menos una pieza para optimizar')
      return
    }

    // Validar que ninguna pieza sea más grande que la placa
    const oversizedPieces = pieces.filter(piece => 
      piece.width > sheetConfig.width || piece.height > sheetConfig.height
    )

    if (oversizedPieces.length > 0) {
      alert(`Algunas piezas son más grandes que la placa. Verifica las dimensiones.`)
      return
    }

    onOptimize(sheetConfig, pieces)
  }

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Configuración</h2>
      
      {/* Configuración de placa */}
      <div className="mb-6">
        <label className="block text-gray-700 mb-2 font-medium">
          Tamaño de la placa (mm)
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="number"
              value={sheetConfig.width}
              onChange={(e) => handleSheetConfigChange('width', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="100"
              max="10000"
              placeholder="Ancho"
            />
            <span className="text-sm text-gray-500 mt-1 block">Ancho</span>
          </div>
          <div>
            <input
              type="number"
              value={sheetConfig.height}
              onChange={(e) => handleSheetConfigChange('height', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="100"
              max="10000"
              placeholder="Alto"
            />
            <span className="text-sm text-gray-500 mt-1 block">Alto</span>
          </div>
        </div>
        
        {/* Información de placa estándar */}
        <div className="mt-2 text-xs text-gray-500">
          💡 Estándar: 2440x1220mm (8x4 pies)
        </div>
      </div>

      {/* Gestor de piezas */}
      <div className="flex-1">
        <PieceManager onPiecesUpdate={handlePiecesUpdate} />
      </div>

      {/* Botón de optimización */}
      <div className="mt-6 pt-4 border-t">
        <button
          onClick={handleOptimizeClick}
          disabled={isOptimizing || pieces.length === 0}
          className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isOptimizing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Optimizando...
            </>
          ) : (
            '🚀 Optimizar Cortes'
          )}
        </button>
        
        {/* Información del estado */}
        <div className="mt-2 text-center text-sm text-gray-500">
          {pieces.length > 0 ? (
            `✅ Listo para optimizar ${pieces.length} piezas`
          ) : (
            '📝 Agrega piezas para comenzar'
          )}
        </div>
      </div>
    </div>
  )
}