import React, { useState } from 'react'
import PieceManager from './PieceManager'

export default function InputPanel({ onOptimize, isOptimizing }) {
  const [sheetConfig, setSheetConfig] = useState({
    width: 2440,
    height: 1220
  })

  const [pieces, setPieces] = useState([])

  const handleSheetConfigChange = (field, value) => {
    setSheetConfig(prev => ({
      ...prev,
      [field]: parseInt(value) || 0
    }))
  }

  const handlePiecesUpdate = (newPieces) => {
    setPieces(newPieces)
  }

  const handleOptimizeClick = () => {
    if (pieces.length === 0) {
      alert('Agrega al menos una pieza para optimizar')
      return
    }
    
    onOptimize(sheetConfig, pieces)
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Configuración de la Placa</h2>
      
      {/* Configuración de placa */}
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Tamaño de la placa (mm)</label>
        <div className="flex space-x-4">
          <div className="flex-1">
            <input
              type="number"
              value={sheetConfig.width}
              onChange={(e) => handleSheetConfigChange('width', e.target.value)}
              className="w-full p-2 border rounded"
              min="1"
            />
            <span className="text-sm text-gray-500">Ancho</span>
          </div>
          <div className="flex-1">
            <input
              type="number"
              value={sheetConfig.height}
              onChange={(e) => handleSheetConfigChange('height', e.target.value)}
              className="w-full p-2 border rounded"
              min="1"
            />
            <span className="text-sm text-gray-500">Alto</span>
          </div>
        </div>
      </div>

      {/* Gestor de piezas */}
      <PieceManager onPiecesUpdate={handlePiecesUpdate} />

      {/* Botón de optimización */}
      <div className="mt-6">
        <button
          onClick={handleOptimizeClick}
          disabled={isOptimizing || pieces.length === 0}
          className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isOptimizing ? 'Optimizando...' : 'Optimizar Cortes'}
        </button>
      </div>
    </div>
  )
}