/**
 * 🧭 HEADER - Cabecera de navegación principal
 * 
 * 📍 FUNCIÓN:
 * - Muestra logo y nombre de la aplicación
 * - Navegación entre secciones (Home, Proyectos, Nuevo Proyecto)
 * - Estado de conexión y información del usuario
 * - Botón de logout cuando está autenticado
 * 
 * 🎯 CARACTERÍSTICAS:
 * - Responsive para móviles
 * - Muestra estado "Conectado" cuando hay usuario
 * - Navegación contextual según estado de auth
 * - Indicador visual de ruta activa
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.user - Información del usuario autenticado
 * @param {Function} props.onLogout - Función para cerrar sesión
 */

import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Header.css'

const Header = ({ user, onLogout }) => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  /**
   * 📱 Maneja la apertura/cierre del menú móvil
   */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  /**
   * 🎯 Verifica si una ruta está activa
   * @param {string} path - Ruta a verificar
   * @returns {boolean} True si la ruta está activa
   */
  const isActiveRoute = (path) => {
    return location.pathname === path
  }

  // Enlaces de navegación para usuarios autenticados
  const navLinks = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/projects', label: 'Proyectos', icon: '📁' },
    { path: '/projects/new', label: 'Nuevo Proyecto', icon: '➕' },
    { path: '/news', label: 'Noticias', icon: '📰' }
  ]

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo y nombre de la app */}
        <div className="header-brand">
          <Link to="/" className="brand-link">
            <div className="brand-logo">
              <span>CO</span>
            </div>
            <div className="brand-text">
              <h1 className="brand-title">Cut Optimizer</h1>
              <p className="brand-subtitle">Optimizador de cortes inteligente</p>
            </div>
          </Link>
        </div>

        {/* Navegación desktop */}
        <nav className="header-nav desktop-nav">
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.path} className="nav-item">
                <Link
                  to={link.path}
                  className={`nav-link ${isActiveRoute(link.path) ? 'active' : ''}`}
                >
                  <span className="nav-icon">{link.icon}</span>
                  <span className="nav-label">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Información de usuario y acciones */}
        <div className="header-actions">
          {/* Estado de conexión */}
          {user && (
            <div className="user-status">
              <div className="status-indicator"></div>
              <span className="status-text">Conectado</span>
            </div>
          )}

          {/* Botón de logout */}
          {user && (
            <button 
              className="logout-btn"
              onClick={onLogout}
              title="Cerrar sesión"
            >
              <span className="logout-icon">🚪</span>
              <span className="logout-text">Salir</span>
            </button>
          )}

          {/* Botón menú móvil */}
          <button 
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Menú de navegación"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Navegación móvil */}
        {isMobileMenuOpen && (
          <nav className="header-nav mobile-nav">
            <ul className="nav-list">
              {navLinks.map((link) => (
                <li key={link.path} className="nav-item">
                  <Link
                    to={link.path}
                    className={`nav-link ${isActiveRoute(link.path) ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="nav-icon">{link.icon}</span>
                    <span className="nav-label">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header