/**
 * ⚠️ ERROR MESSAGE - Componente para mostrar mensajes de error
 * 
 * 📍 FUNCIÓN:
 * - Muestra mensajes de error de manera consistente en toda la app
 * - Soporta diferentes tipos de errores (servidor, validación, etc.)
 * - Diseño accesible con iconos y colores apropiados
 * - Puede ser reutilizado en formularios y otros componentes
 * 
 * 🎯 PROPS:
 * - message: Mensaje de error a mostrar
 * - type: Tipo de error ('error', 'warning', 'info') - por defecto 'error'
 * - className: Clases CSS adicionales
 * - onClose: Función opcional para cerrar el mensaje
 */

import React from 'react'
import './ErrorMessage.css'

const ErrorMessage = ({ 
  message, 
  type = 'error', 
  className = '', 
  onClose 
}) => {
  if (!message) return null

  /**
   * 🎨 Obtiene la configuración según el tipo de error
   */
  const getErrorConfig = (errorType) => {
    const config = {
      error: {
        icon: '❌',
        bgColor: 'var(--color-error-light)',
        borderColor: 'var(--color-error)',
        textColor: 'var(--color-error)'
      },
      warning: {
        icon: '⚠️',
        bgColor: 'var(--color-warning-light)',
        borderColor: 'var(--color-warning)',
        textColor: 'var(--color-warning)'
      },
      info: {
        icon: 'ℹ️',
        bgColor: 'var(--color-primary-light)',
        borderColor: 'var(--color-primary)',
        textColor: 'var(--color-primary)'
      }
    }
    return config[errorType] || config.error
  }

  const config = getErrorConfig(type)

  return (
    <div 
      className={`error-message ${type} ${className}`}
      style={{
        '--bg-color': config.bgColor,
        '--border-color': config.borderColor,
        '--text-color': config.textColor
      }}
      role="alert"
      aria-live="polite"
    >
      <div className="error-content">
        <span className="error-icon">{config.icon}</span>
        <span className="error-text">{message}</span>
      </div>
      
      {onClose && (
        <button 
          className="error-close"
          onClick={onClose}
          aria-label="Cerrar mensaje de error"
        >
          ×
        </button>
      )}
    </div>
  )
}

export default ErrorMessage