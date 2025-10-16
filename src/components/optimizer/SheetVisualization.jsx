import React from 'react'

/**
 * 📐 SHEET VISUALIZATION COMPONENT
 * 📍 Visualiza una placa con las piezas colocadas
 */
export default function SheetVisualization({ sheet, index }) {
  const scale = 400 / sheet.width // Escala para visualización
  const displayHeight = sheet.height * scale

  /**
   * 🎨 Obtener estilo para una pieza
   */
  const getPieceStyle = (piece) => {
    const scaledWidth = piece.placedWidth * scale
    const scaledHeight = piece.placedHeight * scale
    const scaledX = piece.x * scale
    const scaledY = piece.y * scale

    return {
      width: `${scaledWidth}px`,
      height: `${scaledHeight}px`,
      left: `${scaledX}px`,
      top: `${scaledY}px`,
      backgroundColor: piece.color,
      border: '1px solid #000',
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: `${Math.max(8, scaledWidth * 0.08)}px`,
      fontWeight: 'bold',
      color: getContrastColor(piece.color),
      opacity: piece.rotated ? 0.9 : 1,
      transform: piece.rotated ? 'rotate(90deg)' : 'none'
    }
  }

  /**
   * ⚫⚪ Obtener color de contraste para texto
   */
  const getContrastColor = (hexColor) => {
    // Convertir hex a RGB
    const r = parseInt(hexColor.substr(1, 2), 16)
    const g = parseInt(hexColor.substr(3, 2), 16)
    const b = parseInt(hexColor.substr(5, 2), 16)
    
    // Calcular luminosidad
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? 'black' : 'white'
  }

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4">
      {/* Header de la placa */}
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold text-gray-800">
          Placa {index + 1}
        </h4>
        <div className="text-sm text-gray-600">
          Eficiencia: <span className="font-semibold">{sheet.efficiency.toFixed(1)}%</span>
        </div>
      </div>

      {/* Visualización de la placa */}
      <div 
        className="relative mx-auto border-2 border-gray-400 bg-gradient-to-br from-gray-50 to-gray-100"
        style={{ 
          width: `${400}px`, 
          height: `${displayHeight}px`,
          maxWidth: '100%'
        }}
      >
        {/* Piezas */}
        {sheet.pieces.map((piece, pieceIndex) => (
          <div
            key={pieceIndex}
            style={getPieceStyle(piece)}
            title={`${piece.width}x${piece.height}mm ${piece.rotated ? '(Rotada)' : ''}`}
            className="transition-all duration-200 hover:z-10 hover:shadow-lg"
          >
            {piece.placedWidth * scale > 40 && piece.placedHeight * scale > 20 && (
              <div className="transform -rotate-90">
                {piece.width}×{piece.height}
              </div>
            )}
          </div>
        ))}

        {/* Información de dimensiones */}
        <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-white bg-opacity-80 px-2 py-1 rounded">
          {sheet.width}×{sheet.height}mm
        </div>

        {/* Contador de piezas */}
        <div className="absolute top-2 right-2 text-xs text-gray-500 bg-white bg-opacity-80 px-2 py-1 rounded">
          {sheet.pieces.length} piezas
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
        <div>
          <strong>Área usada:</strong> {(sheet.usedArea / 1000000).toFixed(2)} m²
        </div>
        <div>
          <strong>Piezas rotadas:</strong> {sheet.pieces.filter(p => p.rotated).length}
        </div>
      </div>
    </div>
  )
}