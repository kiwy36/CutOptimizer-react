/**
 * 🧭 NAVBAR - Barra de navegación simplificada con íconos responsivos
 * 📍 SIEMPRE VISIBLE en todas las páginas
 * 🎯 CARACTERÍSTICAS:
 * - Muestra íconos en pantallas pequeñas
 * - Texto completo en pantallas grandes
 * - Botón de logout con apariencia de enlace
 * - Sin información redundante del usuario
 * - Totalmente responsivo sin menú hamburguesa
 */

import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import './Navbar.css'

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [isMobile, setIsMobile] = useState(false)

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">🔧</span>
            {(!isMobile || location.pathname === '/') && (
              <span className="brand-text">Cut Optimizer</span>
            )}
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="navbar-menu">
          {user ? (
            // Usuario autenticado - Navegación completa
            <>
              <Link 
                to="/projects" 
                className={`nav-link ${location.pathname === '/projects' ? 'active' : ''}`}
                title="Mis Proyectos"
              >
                <span className="nav-icon">📁</span>
                {!isMobile && <span className="nav-text">Mis Proyectos</span>}
              </Link>
              
              <Link 
                to="/projects/new" 
                className={`nav-link ${location.pathname === '/projects/new' ? 'active' : ''}`}
                title="Nuevo Proyecto"
              >
                <span className="nav-icon">➕</span>
                {!isMobile && <span className="nav-text">Nuevo Proyecto</span>}
              </Link>
              
              {/* Botón de logout con apariencia de enlace */}
              <button 
                onClick={handleLogout}
                className="nav-link logout-link"
                title="Cerrar sesión"
              >
                <span className="nav-icon">🚪</span>
                {!isMobile && <span className="nav-text">Salir</span>}
              </button>
            </>
          ) : (
            // Usuario no autenticado - Solo inicio
            <div className="auth-links">
              <Link 
                to="/" 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                title="Inicio"
              >
                <span className="nav-icon">🔧</span>
                {!isMobile && <span className="nav-text">Inicio</span>}
              </Link>
              
              {!isMobile && (
                <div className="login-hint-container">
                  <span className="login-hint">Inicia sesión para comenzar</span>
                  <span className="hint-arrow">→</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar