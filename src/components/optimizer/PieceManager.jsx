import React, { useState, useEffect } from 'react'

/**
 * 🧩 PIECE MANAGER COMPONENT
 * 📍 Gestiona la lista de piezas para el optimizador
 */
export default function PieceManager({ onPiecesUpdate }) {
  const [pieces, setPieces] = useState([
    { id: 1, width: 300, height: 200, quantity: 1, color: '#3B82F6' }
  ])

  /**
   * ➕ Agregar nueva pieza
   */
  const addPiece = () => {
    const newPiece = {
      id: Date.now(),
      width: 300,
      height: 200,
      quantity: 1,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    }
    setPieces(prev => [...prev, newPiece])
  }

  /**
   * 🗑️ Eliminar pieza
   */
  const removePiece = (id) => {
    if (pieces.length > 1) {
      setPieces(prev => prev.filter(piece => piece.id !== id))
    } else {
      alert('Debe haber al menos una pieza en la lista')
    }
  }

  /**
   * ✏️ Actualizar pieza
   */
  const updatePiece = (id, field, value) => {
    setPieces(prev => prev.map(piece => 
      piece.id === id ? { ...piece, [field]: value } : piece
    ))
  }

  /**
   * 🔄 Notificar cambios al componente padre
   */
  useEffect(() => {
    // Expandir piezas según cantidad
    const expandedPieces = pieces.flatMap(piece => 
      Array.from({ length: piece.quantity }, (_, index) => ({
        ...piece,
        id: `${piece.id}_${index}`,
        quantity: 1 // Cada pieza individual tiene cantidad 1
      }))
    )
    
    onPiecesUpdate(expandedPieces)
  }, [pieces, onPiecesUpdate])

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Piezas a cortar</h2>
      
      {/* Encabezados de la tabla */}
      <div className="grid grid-cols-12 gap-2 mb-2 text-sm font-medium text-gray-700">
        <div className="col-span-3">Ancho (mm)</div>
        <div className="col-span-3">Alto (mm)</div>
        <div className="col-span-3">Cantidad</div>
        <div className="col-span-2">Color</div>
        <div className="col-span-1">Acción</div>
      </div>
      
      {/* Lista de piezas */}
      <div className="space-y-2 mb-4">
        {pieces.map((piece) => (
          <div key={piece.id} className="grid grid-cols-12 gap-2 items-center">
            {/* Ancho */}
            <div className="col-span-3">
              <input
                type="number"
                value={piece.width}
                onChange={(e) => updatePiece(piece.id, 'width', parseInt(e.target.value) || 0)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>
            
            {/* Alto */}
            <div className="col-span-3">
              <input
                type="number"
                value={piece.height}
                onChange={(e) => updatePiece(piece.id, 'height', parseInt(e.target.value) || 0)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>
            
            {/* Cantidad */}
            <div className="col-span-3">
              <input
                type="number"
                value={piece.quantity}
                onChange={(e) => updatePiece(piece.id, 'quantity', parseInt(e.target.value) || 1)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="100"
              />
            </div>
            
            {/* Color */}
            <div className="col-span-2">
              <input
                type="color"
                value={piece.color}
                onChange={(e) => updatePiece(piece.id, 'color', e.target.value)}
                className="w-full h-10 border border-gray-300 rounded cursor-pointer"
              />
            </div>
            
            {/* Botón eliminar */}
            <div className="col-span-1">
              <button
                onClick={() => removePiece(piece.id)}
                disabled={pieces.length <= 1}
                className="w-10 h-10 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                title="Eliminar pieza"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Botón agregar pieza */}
      <button
        onClick={addPiece}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
      >
        + Agregar Pieza
      </button>

      {/* Resumen */}
      <div className="mt-4 p-3 bg-gray-50 rounded">
        <p className="text-sm text-gray-600">
          Total de piezas: <strong>{pieces.reduce((sum, piece) => sum + piece.quantity, 0)}</strong>
        </p>
      </div>
    </div>
  )
}