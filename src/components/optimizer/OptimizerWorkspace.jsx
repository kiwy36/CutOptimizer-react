import React, { useState } from 'react'
import InputPanel from './InputPanel'
import ResultsPanel from './ResultsPanel'
import { optimizer } from '../../utils/optimizer'

export default function OptimizerWorkspace({ onDataUpdate }) {
  const [sheets, setSheets] = useState([])
  const [problematicPieces, setProblematicPieces] = useState([])
  const [isOptimizing, setIsOptimizing] = useState(false)

  const handleOptimize = async (sheetConfig, pieces) => {
    setIsOptimizing(true)
    
    try {
      const result = optimizer.shelfAlgorithm(
        pieces,
        sheetConfig.width,
        sheetConfig.height,
        true // allowRotation
      )
      
      setSheets(result.sheets)
      setProblematicPieces(result.unplacedPieces || [])
      
      // Notificar al componente padre
      onDataUpdate({
        sheetWidth: sheetConfig.width,
        sheetHeight: sheetConfig.height,
        pieces: pieces,
        sheets: result.sheets
      })
    } catch (error) {
      console.error('Error en optimización:', error)
      alert('Error al optimizar los cortes')
    } finally {
      setIsOptimizing(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Panel de entrada */}
      <div className="bg-white rounded-lg shadow p-6">
        <InputPanel 
          onOptimize={handleOptimize}
          isOptimizing={isOptimizing}
        />
      </div>

      {/* Panel de resultados */}
      <div className="bg-white rounded-lg shadow p-6">
        <ResultsPanel 
          sheets={sheets}
          problematicPieces={problematicPieces}
          isOptimizing={isOptimizing}
        />
      </div>
    </div>
  )
}