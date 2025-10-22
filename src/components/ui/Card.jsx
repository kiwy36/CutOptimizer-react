/**
 * 🃏 CARD - Componente de tarjeta reutilizable
 * 
 * 📍 FUNCIÓN:
 * - Contenedor de contenido con estilo de tarjeta
 * - Soporta diferentes variantes y tamaños
 * - Puede incluir header, body y footer
 * - Reutilizable en toda la aplicación
 * 
 * 🎯 PROPS:
 * - variant: Tipo de tarjeta ('default', 'outlined', 'elevated')
 * - padding: Espaciado interno ('none', 'small', 'medium', 'large')
 * - children: Contenido de la tarjeta
 * - className: Clases CSS adicionales
 */

import React from 'react'
import './Card.css'

const Card = ({
  variant = 'default',
  padding = 'medium',
  className = '',
  children,
  ...props
}) => {
  return (
    <div
      className={`card card-${variant} card-padding-${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

// Componentes auxiliares para la card
const CardHeader = ({ children, className = '' }) => (
  <div className={`card-header ${className}`}>
    {children}
  </div>
)

const CardBody = ({ children, className = '' }) => (
  <div className={`card-body ${className}`}>
    {children}
  </div>
)

const CardFooter = ({ children, className = '' }) => (
  <div className={`card-footer ${className}`}>
    {children}
  </div>
)

// Asignar componentes auxiliares
Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter

export default Card