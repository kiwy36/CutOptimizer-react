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
 * - Shelf Algorithm (Mejorado con rotación)
 * - Guillotine Algorithm (Básico)
 * - Cálculo de estadísticas y eficiencia
 * 
 * 🔄 USO:
 * const { pieces, sheets, optimize, addPiece, removePiece, reset } = useOptimizer()
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

  /**
   * ➕ Agrega una nueva pieza a la lista
   * @param {Object} piece - Pieza a agregar (width, height, quantity, color)
   */
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

  /**
   * 🗑️ Elimina una pieza de la lista
   * @param {string} pieceId - ID de la pieza a eliminar
   */
  const removePiece = useCallback((pieceId) => {
    setPieces(prev => prev.filter(piece => piece.id !== pieceId))
  }, [])

  /**
   * ✏️ Actualiza una pieza existente
   * @param {string} pieceId - ID de la pieza a actualizar
   * @param {Object} updates - Campos a actualizar
   */
  const updatePiece = useCallback((pieceId, updates) => {
    setPieces(prev => prev.map(piece => 
      piece.id === pieceId ? { ...piece, ...updates } : piece
    ))
  }, [])

  // =============================================================================
  // ALGORITMOS DE OPTIMIZACIÓN (MIGRADOS DE optimizer.js)
  // =============================================================================

  /**
   * 🔄 Ordena piezas según el método configurado
   * @param {Array} pieces - Array de piezas a ordenar
   * @returns {Array} Piezas ordenadas
   */
  const sortPieces = useCallback((pieces) => {
    const method = config.sortingMethod
    
    switch (method) {
      case 'max-side-desc':
        return [...pieces].sort((a, b) => 
          Math.max(b.width, b.height) - Math.max(a.width, a.height))
      
      case 'area-desc':
        return [...pieces].sort((a, b) => (b.width * b.height) - (a.width * a.height))
      
      case 'width-desc':
        return [...pieces].sort((a, b) => b.width - a.width)
      
      case 'height-desc':
        return [...pieces].sort((a, b) => b.height - a.height)
      
      default:
        return [...pieces].sort((a, b) => Math.max(b.width, b.height) - Math.max(a.width, a.height))
    }
  }, [config.sortingMethod])

  /**
   * ✅ Verifica si una pieza puede colocarse en una posición
   */
  const canPlacePiece = useCallback((piece, x, y, rowHeight, sheetWidth, sheetHeight, rotated = false) => {
    const pieceWidth = rotated ? piece.height : piece.width
    const pieceHeight = rotated ? piece.height : piece.width
    
    if (x + pieceWidth > sheetWidth) return false
    if (y + pieceHeight > sheetHeight) return false
    
    return true
  }, [])

  /**
   * 🏗️ Crea una nueva placa vacía
   */
  const createNewSheet = useCallback((width, height) => ({
    id: Date.now() + Math.random(),
    pieces: [],
    usedArea: 0,
    width,
    height,
    efficiency: 0
  }), [])

  /**
   * 📍 Coloca una pieza en una placa
   */
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

  /**
   * 🎯 Shelf Algorithm Mejorado (con rotación)
   */
  const shelfAlgorithm = useCallback((pieces, sheetWidth, sheetHeight) => {
    let piecesToPlace = pieces.map(piece => ({ 
      ...piece, 
      rotated: false 
    }))
    
    piecesToPlace = sortPieces(piecesToPlace)
    
    const sheets = []
    let unplacedPieces = []
    
    while (piecesToPlace.length > 0) {
      let currentSheet = createNewSheet(sheetWidth, sheetHeight)
      let currentY = 0
      let currentX = 0
      let currentRowHeight = 0
      
      for (let i = 0; i < piecesToPlace.length; i++) {
        const piece = piecesToPlace[i]
        let placed = false
        
        // Intentar orientación normal
        if (canPlacePiece(piece, currentX, currentY, currentRowHeight, sheetWidth, sheetHeight, false)) {
          placePiece(currentSheet, piece, currentX, currentY, false)
          currentX += piece.width
          currentRowHeight = Math.max(currentRowHeight, piece.height)
          piecesToPlace.splice(i, 1)
          i--
          placed = true
        } 
        // Intentar rotación si está permitida
        else if (config.allowRotation && canPlacePiece(piece, currentX, currentY, currentRowHeight, sheetWidth, sheetHeight, true)) {
          placePiece(currentSheet, piece, currentX, currentY, true)
          currentX += piece.height
          currentRowHeight = Math.max(currentRowHeight, piece.width)
          piecesToPlace.splice(i, 1)
          i--
          placed = true
        }
        
        // Si no cabe, intentar nueva fila
        if (!placed && currentX > 0) {
          currentY += currentRowHeight
          currentX = 0
          currentRowHeight = 0
          i--
        }
      }
      
      // Evaluar eficiencia de la placa
      if (currentSheet.pieces.length > 0) {
        const efficiency = currentSheet.usedArea / (sheetWidth * sheetHeight)
        
        if (efficiency >= config.efficiencyThreshold || sheets.length === 0) {
          sheets.push(currentSheet)
        } else {
          // Devolver piezas a la cola si la eficiencia es baja
          piecesToPlace = [...piecesToPlace, ...currentSheet.pieces.map(p => ({
            ...p,
            rotated: false
          }))]
        }
      } else {
        break
      }
    }
    
     // Reportar piezas no colocadas
    if (piecesToPlace.length > 0) {
      unplacedPieces = piecesToPlace.map(piece => ({
        ...piece,
        reason: getUnplacedReason(piece, sheetWidth, sheetHeight) // ✅ Ahora está definida
      }))
    }
      return { sheets, unplacedPieces }
  }, [
    sortPieces, 
    canPlacePiece, 
    createNewSheet, 
    placePiece, 
    config.allowRotation, 
    config.efficiencyThreshold,
    getUnplacedReason // ✅ AGREGADA LA DEPENDENCIA FALTANTE
  ])

  /**
   * 📋 Algoritmo Guillotine (versión básica)
   */
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
      
      if (sheet.pieces.length > 0) {
        sheets.push(sheet)
      }
    }
    
    return { sheets, unplacedPieces: [] }
  }, [sortPieces, createNewSheet, placePiece])

  /**
   * 📝 Obtiene la razón por la que una pieza no pudo colocarse
   */
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
  // FUNCIÓN PRINCIPAL DE OPTIMIZACIÓN
  // =============================================================================

  /**
   * 🚀 Ejecuta el proceso de optimización
   * @param {number} sheetWidth - Ancho de la placa
   * @param {number} sheetHeight - Alto de la placa
   */
  const optimize = useCallback(async (sheetWidth, sheetHeight) => {
    if (isOptimizing) {
      console.warn('⚠️ Optimización ya en progreso')
      return
    }

    if (pieces.length === 0) {
      throw new Error('❌ Agrega al menos una pieza para optimizar')
    }

    setIsOptimizing(true)
    setProblematicPieces([])

    try {
      // Validar entradas
      if (isNaN(sheetWidth) || sheetWidth <= 0 || isNaN(sheetHeight) || sheetHeight <= 0) {
        throw new Error('❌ El tamaño de la placa debe ser un número positivo')
      }

      // Filtrar piezas que no caben ni rotadas
      const validPieces = []
      const removedPieces = []
      
      for (const piece of pieces) {
        const fitsNormal = piece.width <= sheetWidth && piece.height <= sheetHeight
        const fitsRotated = config.allowRotation && piece.height <= sheetWidth && piece.width <= sheetHeight
        
        if (fitsNormal || fitsRotated) {
          // Expandir piezas según cantidad
          for (let i = 0; i < piece.quantity; i++) {
            validPieces.push({
              ...piece,
              id: `${piece.id}_${i}`,
              quantity: 1
            })
          }
        } else {
          removedPieces.push({
            ...piece,
            reason: `No cabe en la placa ni rotada (${piece.width}x${piece.height}mm vs placa ${sheetWidth}x${sheetHeight}mm)`
          })
        }
      }

      if (removedPieces.length > 0) {
        setProblematicPieces(removedPieces)
        console.warn(`⚠️ Se removieron ${removedPieces.length} piezas que no caben`)
      }

      if (validPieces.length === 0) {
        throw new Error('❌ Ninguna pieza cabe en la placa especificada')
      }

      // Ejecutar algoritmo seleccionado
      let result
      if (config.algorithm === 'guillotine') {
        result = guillotineAlgorithm(validPieces, sheetWidth, sheetHeight)
      } else {
        result = shelfAlgorithm(validPieces, sheetWidth, sheetHeight)
      }

      // Agregar piezas no colocadas a las problemáticas
      if (result.unplacedPieces && result.unplacedPieces.length > 0) {
        setProblematicPieces(prev => [...prev, ...result.unplacedPieces])
      }

      setSheets(result.sheets)
      
      console.log(`✅ Optimización completada: ${result.sheets.length} placas utilizadas`)
      return result

    } catch (error) {
      console.error('❌ Error durante la optimización:', error)
      throw error
    } finally {
      setIsOptimizing(false)
    }
  }, [pieces, isOptimizing, config.algorithm, config.allowRotation, shelfAlgorithm, guillotineAlgorithm])

  // =============================================================================
  // CÁLCULO DE ESTADÍSTICAS
  // =============================================================================

  /**
   * 📊 Calcula estadísticas de la optimización
   */
  const calculateStats = useCallback(() => {
    if (sheets.length === 0) {
      return {
        totalSheets: 0,
        totalArea: 0,
        usedArea: 0,
        wasteArea: 0,
        efficiency: 0,
        totalPieces: 0
      }
    }
    
    const totalSheets = sheets.length
    const totalArea = sheets.reduce((sum, sheet) => sum + (sheet.width * sheet.height), 0)
    const usedArea = sheets.reduce((sum, sheet) => sum + sheet.usedArea, 0)
    const wasteArea = totalArea - usedArea
    const efficiency = (usedArea / totalArea) * 100
    const totalPieces = sheets.reduce((sum, sheet) => sum + sheet.pieces.length, 0)
    
    return {
      totalSheets,
      totalArea,
      usedArea,
      wasteArea,
      efficiency,
      totalPieces
    }
  }, [sheets])

  // =============================================================================
  // RESET Y UTILIDADES
  // =============================================================================

  /**
   * 🔄 Reinicia el optimizador al estado inicial
   */
  const reset = useCallback(() => {
    setPieces([])
    setSheets([])
    setProblematicPieces([])
    setIsOptimizing(false)
  }, [])

  /**
   * ⚙️ Actualiza la configuración del algoritmo
   */
  const updateConfig = useCallback((newConfig) => {
    setConfig(prev => ({ ...prev, ...newConfig }))
  }, [])

  // =============================================================================
  // VALORES DE RETORNO DEL HOOK
  // =============================================================================

  return {
    // Estado
    pieces,
    sheets,
    isOptimizing,
    problematicPieces,
    config,
    
    // Gestión de piezas
    addPiece,
    removePiece,
    updatePiece,
    
    // Optimización
    optimize,
    calculateStats,
    
    // Configuración
    updateConfig,
    
    // Utilidades
    reset
  }
}

export default useOptimizer