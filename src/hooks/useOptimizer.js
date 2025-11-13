/**
 * 🎯 USE OPTIMIZER - Hook personalizado para la lógica de optimización
 * 
 * 📍 FUNCIÓN:
 * - Contiene toda la lógica de los algoritmos de optimización
 * - Maneja el estado de piezas, placas y resultados
 * - Proporciona funciones para optimizar, resetear y gestionar piezas
 * - Migra la funcionalidad de optimizer.js a React hooks
 * 
 * 🎯 ALGORITMOS IMPLEMENTADOS:
 * - Shelf Algorithm (Mejorado con rotación y manejo de múltiples placas)
 * - Guillotine Algorithm (Básico)
 * - Cálculo de estadísticas y eficiencia
 */

import { useState, useCallback } from 'react'

const useOptimizer = () => {
  // =============================================================================
  // ESTADO DEL OPTIMIZADOR
  // =============================================================================

  const [pieces, setPieces] = useState([])
  const [sheets, setSheets] = useState([])
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [problematicPieces, setProblematicPieces] = useState([])

  // =============================================================================
  // CONFIGURACIÓN DEL ALGORITMO
  // =============================================================================

  const defaultConfig = {
    allowRotation: true,
    sortingMethod: 'max-side-desc',
    algorithm: 'shelf',
    efficiencyThreshold: 0.85,
    maxSheetsToDisplay: 10
  }

  const [config, setConfig] = useState(defaultConfig)

  // =============================================================================
  // GESTIÓN DE PIEZAS
  // =============================================================================

  const addPiece = useCallback((piece = { width: 300, height: 200, quantity: 1, color: '#3b82f6' }) => {
    const newPiece = {
      id: Date.now() + Math.random(),
      width: parseInt(piece.width) || 300,
      height: parseInt(piece.height) || 200,
      quantity: parseInt(piece.quantity) || 1,
      color: piece.color || `#${Math.floor(Math.random()*16777215).toString(16)}`,
      ...piece
    }
    setPieces(prev => [...prev, newPiece])
  }, [])

  const removePiece = useCallback((pieceId) => {
    setPieces(prev => prev.filter(piece => piece.id !== pieceId))
  }, [])

  const updatePiece = useCallback((pieceId, updates) => {
    setPieces(prev => prev.map(piece => 
      piece.id === pieceId ? { ...piece, ...updates } : piece
    ))
  }, [])

  // =============================================================================
  // FUNCIONES AUXILIARES
  // =============================================================================

  const sortPieces = useCallback((pieces) => {
    const method = config.sortingMethod
    switch (method) {
      case 'max-side-desc':
        return [...pieces].sort((a, b) => Math.max(b.width, b.height) - Math.max(a.width, a.height))
      case 'area-desc':
        return [...pieces].sort((a, b) => (b.width * b.height) - (a.width * a.height))
      case 'width-desc':
        return [...pieces].sort((a, b) => b.width - a.width)
      case 'height-desc':
        return [...pieces].sort((a, b) => b.height - a.height)
      default:
        return [...pieces]
    }
  }, [config.sortingMethod])

  const canPlacePiece = useCallback((piece, x, y, rowHeight, sheetWidth, sheetHeight, rotated = false) => {
    const pieceWidth = rotated ? piece.height : piece.width
    const pieceHeight = rotated ? piece.width : piece.height
    if (x + pieceWidth > sheetWidth) return false
    if (y + pieceHeight > sheetHeight) return false
    return true
  }, [])

  const createNewSheet = useCallback((width, height) => ({
    id: Date.now() + Math.random(),
    pieces: [],
    usedArea: 0,
    width,
    height,
    efficiency: 0
  }), [])

  const placePiece = useCallback((sheet, piece, x, y, rotated = false) => {
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
    return placedPiece
  }, [])

  const getUnplacedReason = useCallback((piece, sheetWidth, sheetHeight) => {
    const fitsNormal = piece.width <= sheetWidth && piece.height <= sheetHeight
    const fitsRotated = config.allowRotation && piece.height <= sheetWidth && piece.width <= sheetHeight
    if (!fitsNormal && !fitsRotated) {
      return `Pieza demasiado grande (${piece.width}x${piece.height}mm) para la placa (${sheetWidth}x${sheetHeight}mm)`
    } else {
      return `No se encontró espacio disponible en las placas`
    }
  }, [config.allowRotation])

  // =============================================================================
  // 🎯 SHELF ALGORITHM - REPARADO Y MEJORADO
  // =============================================================================

  const shelfAlgorithm = useCallback((pieces, sheetWidth, sheetHeight) => {
    console.log(`🔧 Ejecutando Shelf Algorithm para ${pieces.length} piezas...`)
    
    let piecesToPlace = pieces.map(piece => ({ ...piece, rotated: false }))
    piecesToPlace = sortPieces(piecesToPlace)
    
    const sheets = []
    let unplacedPieces = []
    
    while (piecesToPlace.length > 0) {
      let currentSheet = createNewSheet(sheetWidth, sheetHeight)
      let currentY = 0
      let currentX = 0
      let currentRowHeight = 0
      let placedInThisSheet = false
      
      for (let i = 0; i < piecesToPlace.length; i++) {
        const piece = piecesToPlace[i]
        let placed = false
        
        if (canPlacePiece(piece, currentX, currentY, currentRowHeight, sheetWidth, sheetHeight, false)) {
          placePiece(currentSheet, piece, currentX, currentY, false)
          currentX += piece.width
          currentRowHeight = Math.max(currentRowHeight, piece.height)
          piecesToPlace.splice(i, 1)
          i--
          placed = true
          placedInThisSheet = true
        } 
        else if (config.allowRotation && canPlacePiece(piece, currentX, currentY, currentRowHeight, sheetWidth, sheetHeight, true)) {
          placePiece(currentSheet, piece, currentX, currentY, true)
          currentX += piece.height
          currentRowHeight = Math.max(currentRowHeight, piece.width)
          piecesToPlace.splice(i, 1)
          i--
          placed = true
          placedInThisSheet = true
        }
        
        if (!placed && currentX > 0) {
          currentY += currentRowHeight
          currentX = 0
          currentRowHeight = 0
          i--
        }

        if (currentY >= sheetHeight) break
      }

      if (currentSheet.pieces.length > 0) {
        const totalSheetArea = sheetWidth * sheetHeight
        const efficiency = (currentSheet.usedArea / totalSheetArea) * 100
        currentSheet.efficiency = efficiency
        sheets.push(currentSheet)
        console.log(`✅ Placa ${sheets.length} creada: ${currentSheet.pieces.length} piezas, eficiencia: ${efficiency.toFixed(1)}%`)
      }

      if (!placedInThisSheet && piecesToPlace.length > 0) {
        console.warn(`⚠️ No se pudo colocar más piezas. ${piecesToPlace.length} piezas restantes`)
        break
      }
    }

    if (piecesToPlace.length > 0) {
      unplacedPieces = piecesToPlace.map(piece => ({
        ...piece,
        reason: getUnplacedReason(piece, sheetWidth, sheetHeight)
      }))
      console.warn(`❌ ${unplacedPieces.length} piezas no pudieron colocarse`)
    }

    console.log(`✅ Algoritmo completado: ${sheets.length} placas utilizadas`)
    return { sheets, unplacedPieces }
  }, [sortPieces, canPlacePiece, createNewSheet, placePiece, config.allowRotation, getUnplacedReason])

  // =============================================================================
  // 🪚 ALGORITMO GUILLOTINE (igual)
  // =============================================================================

  const guillotineAlgorithm = useCallback((pieces, sheetWidth, sheetHeight) => {
    const sheets = []
    let piecesToPlace = sortPieces([...pieces])
    
    while (piecesToPlace.length > 0) {
      const sheet = createNewSheet(sheetWidth, sheetHeight)
      const freeRects = [{ x: 0, y: 0, width: sheetWidth, height: sheetHeight }]
      
      for (let i = 0; i < piecesToPlace.length; i++) {
        const piece = piecesToPlace[i]
        let bestRectIndex = -1
        
        for (let j = 0; j < freeRects.length; j++) {
          const rect = freeRects[j]
          if (piece.width <= rect.width && piece.height <= rect.height) {
            bestRectIndex = j
            break
          }
        }
        
        if (bestRectIndex !== -1) {
          const rect = freeRects[bestRectIndex]
          placePiece(sheet, piece, rect.x, rect.y)
          
          freeRects.splice(bestRectIndex, 1)
          
          if (rect.width > piece.width) {
            freeRects.push({
              x: rect.x + piece.width,
              y: rect.y,
              width: rect.width - piece.width,
              height: piece.height
            })
          }
          
          if (rect.height > piece.height) {
            freeRects.push({
              x: rect.x,
              y: rect.y + piece.height,
              width: rect.width,
              height: rect.height - piece.height
            })
          }
          
          piecesToPlace.splice(i, 1)
          i--
        }
      }
      
      if (sheet.pieces.length > 0) sheets.push(sheet)
    }
    
    return { sheets, unplacedPieces: [] }
  }, [sortPieces, createNewSheet, placePiece])

  // =============================================================================
  // 🚀 FUNCIÓN PRINCIPAL DE OPTIMIZACIÓN
  // =============================================================================

  const optimize = useCallback(async (sheetWidth, sheetHeight) => {
    if (isOptimizing) {
      console.warn('⚠️ Optimización ya en progreso')
      return
    }

    if (pieces.length === 0) throw new Error('❌ Agrega al menos una pieza para optimizar')

    setIsOptimizing(true)
    setProblematicPieces([])

    try {
      // 🧩 VALIDACIONES DE TAMAÑO DE PLACA
      if (isNaN(sheetWidth) || sheetWidth <= 0 || isNaN(sheetHeight) || sheetHeight <= 0)
        throw new Error('❌ Tamaño de placa inválido')

      if (sheetWidth < 100 || sheetHeight < 100)
        throw new Error('❌ Tamaño mínimo de placa: 100x100mm')

      if (sheetWidth > 10000 || sheetHeight > 10000)
        throw new Error('❌ Tamaño máximo de placa: 10000x10000mm')

      // 🔍 DEPURACIÓN: INFO DE PIEZAS Y PLACA
      console.log('🔍 DEBUG - Validando piezas vs placa:', {
        sheetSize: `${sheetWidth}x${sheetHeight}`,
        totalPieces: pieces.length,
        pieces: pieces.map(p => `${p.width}x${p.height} (qty: ${p.quantity})`)
      })

      const validPieces = []
      const removedPieces = []

      // 🧠 VALIDACIÓN INDIVIDUAL DE PIEZAS
      for (const piece of pieces) {
        const fitsNormal = piece.width <= sheetWidth && piece.height <= sheetHeight
        const fitsRotated =
          config.allowRotation && piece.height <= sheetWidth && piece.width <= sheetHeight

        console.log(`🔍 DEBUG - Pieza ${piece.width}x${piece.height}:`, {
          fitsNormal,
          fitsRotated,
          allowRotation: config.allowRotation
        })

        if (fitsNormal || fitsRotated) {
          // Expande según cantidad
          for (let i = 0; i < piece.quantity; i++) {
            validPieces.push({
              ...piece,
              id: `${piece.id}_${i}`,
              quantity: 1
            })
          }
          console.log(`✅ Pieza ${piece.width}x${piece.height} - VÁLIDA`)
        } else {
          removedPieces.push({
            ...piece,
            reason: `No cabe en la placa ${sheetWidth}x${sheetHeight}mm (necesita ${piece.width}x${piece.height}mm)`
          })
          console.log(`❌ Pieza ${piece.width}x${piece.height} - NO CABE`)
        }
      }

      // 📋 RESUMEN DE VALIDACIÓN
      console.log('🔍 DEBUG - Resultado validación:', {
        validPieces: validPieces.length,
        removedPieces: removedPieces.length,
        validPiecesDetails: validPieces.map(p => `${p.width}x${p.height}`)
      })

      if (removedPieces.length > 0) {
        setProblematicPieces(removedPieces)
        console.warn(`⚠️ Se removieron ${removedPieces.length} piezas que no caben`)
      }

      if (validPieces.length === 0) {
        throw new Error(
          `❌ Ninguna pieza cabe en la placa ${sheetWidth}x${sheetHeight}mm. ` +
          `Piezas más pequeñas: ${Math.min(...pieces.map(p => p.width))}x${Math.min(...pieces.map(p => p.height))}mm`
        )
      }

      // ⚙️ EJECUCIÓN DEL ALGORITMO
      const result =
        config.algorithm === 'guillotine'
          ? guillotineAlgorithm(validPieces, sheetWidth, sheetHeight)
          : shelfAlgorithm(validPieces, sheetWidth, sheetHeight)

      // 🧩 PIEZAS NO COLOCADAS
      if (result.unplacedPieces?.length > 0)
        setProblematicPieces(prev => [...prev, ...result.unplacedPieces])

      // ✅ GUARDAR RESULTADO FINAL
      setSheets(result.sheets)
      console.log(`✅ Optimización completada: ${result.sheets.length} placas usadas`)

      return result

    } catch (error) {
      console.error('❌ Error durante la optimización:', error)
      throw error
    } finally {
      setIsOptimizing(false)
    }
  }, [pieces, isOptimizing, config.algorithm, config.allowRotation, shelfAlgorithm, guillotineAlgorithm])


  // =============================================================================
  // 📊 ESTADÍSTICAS + RESET + UTILIDADES
  // =============================================================================

  const calculateStats = useCallback(() => {
    if (sheets.length === 0) return { totalSheets: 0, totalArea: 0, usedArea: 0, wasteArea: 0, efficiency: 0, totalPieces: 0 }

    const totalSheets = sheets.length
    const totalArea = sheets.reduce((sum, s) => sum + (s.width * s.height), 0)
    const usedArea = sheets.reduce((sum, s) => sum + s.usedArea, 0)
    const wasteArea = totalArea - usedArea
    const efficiency = (usedArea / totalArea) * 100
    const totalPieces = sheets.reduce((sum, s) => sum + s.pieces.length, 0)

    return { totalSheets, totalArea, usedArea, wasteArea, efficiency, totalPieces }
  }, [sheets])

  const reset = useCallback(() => {
    setPieces([])
    setSheets([])
    setProblematicPieces([])
    setIsOptimizing(false)
  }, [])

  const updateConfig = useCallback((newConfig) => {
    setConfig(prev => ({ ...prev, ...newConfig }))
  }, [])

  const getExpandedPieces = useCallback(() => {
    const expanded = []
    pieces.forEach(piece => {
      for (let i = 0; i < piece.quantity; i++) {
        expanded.push({ ...piece, id: `${piece.id}_${i}`, quantity: 1 })
      }
    })
    return expanded
  }, [pieces])

  const isValidPiece = useCallback((piece) => (
    piece.width > 0 && piece.height > 0 && piece.quantity > 0 && piece.color
  ), [])

  // =============================================================================
  // RETORNO DEL HOOK
  // =============================================================================

  return {
    pieces,
    sheets,
    isOptimizing,
    problematicPieces,
    config,
    addPiece,
    removePiece,
    updatePiece,
    getExpandedPieces,
    isValidPiece,
    optimize,
    calculateStats,
    updateConfig,
    reset
  }
}

export default useOptimizer
