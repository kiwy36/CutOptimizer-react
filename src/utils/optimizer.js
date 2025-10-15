/**
 * 🧠 ALGORITMO DE OPTIMIZACIÓN (Versión Simplificada para React)
 * 📍 Contiene la lógica de optimización adaptada de la versión original
 */

export const optimizer = {
  config: {
    allowRotation: true,
    efficiencyThreshold: 0.85
  },

  /**
   * 📐 Algoritmo Shelf mejorado con rotación
   */
  shelfAlgorithm: function(pieces, sheetWidth, sheetHeight, allowRotation = true) {
    console.log('🔧 Ejecutando algoritmo de optimización...')
    
    // Ordenar piezas por área (mayor a menor)
    const sortedPieces = [...pieces].sort((a, b) => 
      (b.width * b.height) - (a.width * a.height)
    )

    const sheets = []
    let unplacedPieces = []
    let piecesToPlace = [...sortedPieces]

    while (piecesToPlace.length > 0) {
      const sheet = this.createNewSheet(sheetWidth, sheetHeight)
      let currentY = 0
      let currentX = 0
      let currentRowHeight = 0

      for (let i = 0; i < piecesToPlace.length; i++) {
        const piece = piecesToPlace[i]
        let placed = false

        // Intentar colocar en orientación normal
        if (this.canPlacePiece(piece, currentX, currentY, sheetWidth, sheetHeight, false)) {
          this.placePiece(sheet, piece, currentX, currentY, false)
          currentX += piece.width
          currentRowHeight = Math.max(currentRowHeight, piece.height)
          piecesToPlace.splice(i, 1)
          i--
          placed = true
        }
        // Intentar colocar rotado
        else if (allowRotation && this.canPlacePiece(piece, currentX, currentY, sheetWidth, sheetHeight, true)) {
          this.placePiece(sheet, piece, currentX, currentY, true)
          currentX += piece.height
          currentRowHeight = Math.max(currentRowHeight, piece.width)
          piecesToPlace.splice(i, 1)
          i--
          placed = true
        }

        // Si no cabe, nueva fila
        if (!placed && currentX > 0) {
          currentY += currentRowHeight
          currentX = 0
          currentRowHeight = 0
          i-- // Reintentar esta pieza
        }
      }

      if (sheet.pieces.length > 0) {
        sheets.push(sheet)
      } else {
        break
      }
    }

    // Las piezas restantes no cupieron
    unplacedPieces = piecesToPlace.map(piece => ({
      ...piece,
      reason: `No se pudo colocar en ninguna placa`
    }))

    console.log(`✅ Optimización completada: ${sheets.length} placas`)
    return { sheets, unplacedPieces }
  },

  /**
   * ✅ Verificar si una pieza cabe
   */
  canPlacePiece: function(piece, x, y, sheetWidth, sheetHeight, rotated) {
    const width = rotated ? piece.height : piece.width
    const height = rotated ? piece.width : piece.height
    
    return (x + width <= sheetWidth) && (y + height <= sheetHeight)
  },

  /**
   * 📌 Colocar pieza en placa
   */
  placePiece: function(sheet, piece, x, y, rotated) {
    const placedPiece = {
      ...piece,
      x,
      y,
      rotated,
      placedWidth: rotated ? piece.height : piece.width,
      placedHeight: rotated ? piece.width : piece.height
    }

    sheet.pieces.push(placedPiece)
    sheet.usedArea += placedPiece.placedWidth * placedPiece.placedHeight
    sheet.efficiency = (sheet.usedArea / (sheet.width * sheet.height)) * 100
  },

  /**
   * 🆕 Crear placa vacía
   */
  createNewSheet: function(width, height) {
    return {
      pieces: [],
      usedArea: 0,
      width,
      height,
      efficiency: 0
    }
  },

  /**
   * 📊 Calcular estadísticas
   */
  calculateStats: function(sheets) {
    if (sheets.length === 0) {
      return {
        totalSheets: 0,
        totalArea: 0,
        usedArea: 0,
        wasteArea: 0,
        efficiency: 0
      }
    }

    const totalSheets = sheets.length
    const totalArea = sheets.reduce((sum, sheet) => sum + (sheet.width * sheet.height), 0)
    const usedArea = sheets.reduce((sum, sheet) => sum + sheet.usedArea, 0)
    const wasteArea = totalArea - usedArea
    const efficiency = (usedArea / totalArea) * 100

    return {
      totalSheets,
      totalArea,
      usedArea,
      wasteArea,
      efficiency
    }
  }
}