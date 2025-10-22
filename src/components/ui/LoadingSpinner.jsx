/**
 * ⏳ LOADING SPINNER - Componente de carga visual
 * 
 * 📍 FUNCIÓN:
 * - Muestra un spinner de carga durante operaciones asíncronas
 * - Es reutilizable en toda la aplicación
 * - Soporta diferentes tamaños y variantes
 * 
 * 🎯 VARIANTES:
 * - small: Spinner pequeño para botones o elementos pequeños
 * - medium: Spinner estándar para secciones
 * - large: Spinner grande para páginas completas
 * - xlarge: Spinner extra grande para carga inicial de la app
 * 
 * @param {string} size - Tamaño del spinner (small, medium, large, xlarge)
 * @param {string} className - Clases CSS adicionales
 * @param {string} text - Texto opcional a mostrar debajo del spinner
 */

import React from 'react'
import './LoadingSpinner.css'

const LoadingSpinner = ({ 
  size = 'medium', 
  className = '',
  text = '' 
}) => {
  return (
    <div className={`loading-spinner ${size} ${className}`}>
      {/* Spinner visual */}
      <div className="spinner"></div>
      
      {/* Texto opcional */}
      {text && <span className="spinner-text">{text}</span>}
    </div>
  )
}

export default LoadingSpinner