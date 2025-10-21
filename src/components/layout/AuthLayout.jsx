/**
 * 🔐 AUTH LAYOUT - Layout para páginas de autenticación
 * 
 * 📍 FUNCIÓN:
 * - Layout especial para login/register
 * - Diseño centrado y limpio sin navegación completa
 * - Fondo atractivo para flujo de autenticación
 * - Proporciona experiencia de usuario optimizada para auth
 * 
 * 🎯 USO:
 * - Solo para rutas de autenticación (login/register)
 * - Se usa cuando el usuario NO está autenticado
 * - Proporciona contexto visual apropiado para el flujo de auth
 * 
 * @param {Object} props - Propiedades del componente
 * @param {ReactNode} props.children - Contenido a renderizar (formularios de auth)
 */

import React from 'react'
import './AuthLayout.css'

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      {/* Fondo decorativo */}
      <div className="auth-background">
        <div className="auth-background-overlay"></div>
      </div>
      
      {/* Contenido centrado */}
      <div className="auth-container">
        {/* Tarjeta de autenticación */}
        <div className="auth-card">
          {/* Header de la tarjeta */}
          <div className="auth-header">
            <div className="auth-logo">
              <div className="logo-icon">
                <span>CO</span>
              </div>
              <div className="logo-text">
                <h1>Cut Optimizer</h1>
                <p>Optimizador de cortes inteligente</p>
              </div>
            </div>
          </div>
          
          {/* Contenido de autenticación (Login/Register) */}
          <div className="auth-content">
            {children}
          </div>
          
          {/* Footer informativo */}
          <div className="auth-footer">
            <p className="auth-info">
              Gestiona y optimiza tus proyectos de corte de materiales
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout