import { useState, useCallback } from 'react';
import { optimizer } from '../utils/optimizer';

export const useOptimizer = () => {
  const [sheets, setSheets] = useState([]);
  const [problematicPieces, setProblematicPieces] = useState([]);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const optimize = useCallback((pieces, sheetWidth, sheetHeight, allowRotation = true) => {
    setIsOptimizing(true);
    
    try {
      // Filtrar piezas que no caben
      const filteredResult = optimizer.filterPiecesThatDontFit(
        pieces, 
        sheetWidth, 
        sheetHeight
      );

      const { validPieces, removedPieces } = filteredResult;
      
      // Ejecutar algoritmo de optimización
      const optimizationResult = optimizer.shelfAlgorithm(
        validPieces,
        sheetWidth,
        sheetHeight,
        allowRotation
      );

      setSheets(optimizationResult.sheets);
      setProblematicPieces([...removedPieces, ...optimizationResult.unplacedPieces]);

      return {
        success: true,
        sheets: optimizationResult.sheets,
        problematicPieces: [...removedPieces, ...optimizationResult.unplacedPieces]
      };
    } catch (error) {
      console.error('Error en optimización:', error);
      return { success: false, error: error.message };
    } finally {
      setIsOptimizing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setSheets([]);
    setProblematicPieces([]);
    setIsOptimizing(false);
  }, []);

  return {
    sheets,
    problematicPieces,
    isOptimizing,
    optimize,
    reset
  };
};