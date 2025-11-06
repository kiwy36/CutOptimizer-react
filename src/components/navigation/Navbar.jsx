/**
 * 🧭 NAVBAR - Barra de navegación principal
 * 📍 SIEMPRE VISIBLE en todas las páginas
 */

import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import './Navbar.css'

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

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
            <span className="brand-text">Cut Optimizer</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="navbar-menu">
          {user ? (
            // Usuario autenticado
            <>
              <Link 
                to="/projects" 
                className={`nav-link ${location.pathname === '/projects' ? 'active' : ''}`}
              >
                📁 Mis Proyectos
              </Link>
              <Link 
                to="/projects/new" 
                className={`nav-link ${location.pathname === '/projects/new' ? 'active' : ''}`}
              >
                ➕ Nuevo Proyecto
              </Link>
              <div className="user-section">
                <span className="user-greeting">Hola, {user.email}</span>
                <button 
                  onClick={handleLogout}
                  className="logout-btn"
                  title="Cerrar sesión"
                >
                  🚪 Salir
                </button>
              </div>
            </>
          ) : (
            // Usuario no autenticado
            <div className="auth-links">
              <Link 
                to="/" 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                🏠 Inicio
              </Link>
              <span className="login-hint">Inicia sesión para comenzar</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
