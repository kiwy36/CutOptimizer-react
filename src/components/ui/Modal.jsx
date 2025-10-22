/**
 * 🪟 MODAL - Componente de modal/ventana emergente
 * 
 * 📍 FUNCIÓN:
 * - Modal reutilizable para diálogos y formularios
 * - Maneja apertura/cierre con animaciones
 * - Soporta diferentes tamaños y tipos
 * - Cierre con ESC key y click fuera
 * 
 * 🎯 PROPS:
 * - isOpen: Estado de apertura del modal
 * - onClose: Función para cerrar el modal
 * - title: Título del modal (opcional)
 * - size: Tamaño del modal ('sm', 'md', 'lg', 'xl')
 * - children: Contenido del modal
 */

import React, { useEffect } from 'react'
import './Modal.css'

const Modal = ({
  isOpen = false,
  onClose,
  title,
  size = 'md',
  children,
  className = ''
}) => {
  /**
   * 🎯 Maneja el cierre con la tecla ESC
   */
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden' // Previene scroll del body
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modal modal-${size} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del modal */}
        {(title || onClose) && (
          <div className="modal-header">
            {title && <h2 className="modal-title">{title}</h2>}
            {onClose && (
              <button 
                className="modal-close"
                onClick={onClose}
                aria-label="Cerrar modal"
              >
                ×
              </button>
            )}
          </div>
        )}

        {/* Contenido del modal */}
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal