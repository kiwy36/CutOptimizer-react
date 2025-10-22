/**
 * 🔘 BUTTON - Componente de botón reutilizable
 * 
 * 📍 FUNCIÓN:
 * - Botón reutilizable con diferentes variantes y estados
 * - Soporta diferentes tipos (button, submit, reset)
 * - Estados: default, hover, active, disabled, loading
 * - Variantes: primary, secondary, danger, etc.
 * 
 * 🎯 PROPS:
 * - variant: Tipo de botón ('primary', 'secondary', 'danger', 'ghost')
 * - size: Tamaño del botón ('small', 'medium', 'large')
 * - loading: Estado de carga (muestra spinner)
 * - disabled: Estado deshabilitado
 * - children: Contenido del botón
 * - ...props: Todas las demás props de button HTML
 */

import React from 'react'
import LoadingSpinner from './LoadingSpinner'
import './Button.css'

const Button = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  children,
  className = '',
  ...props
}) => {
  const isDisabled = disabled || loading
  
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${loading ? 'loading' : ''} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <LoadingSpinner size="small" className="btn-spinner" />
      )}
      <span className="btn-content">{children}</span>
    </button>
  )
}

export default Button