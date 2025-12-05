/**
 * 🏠 HOME - Página de inicio optimizada
 * 📍 NUEVA ESTRUCTURA: Logo + Auth Forms + News
 * 🎯 CARACTERÍSTICAS:
 * - Logo prominente con saludo personalizado
 * - Forms de auth solo para usuarios no autenticados
 * - Sección de noticias siempre visible
 * - Mensaje de bienvenida personalizado
 */

import React from 'react'
import useAuth from '../hooks/useAuth'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'
import Noticias from './News'
import './Home.css'

const Home = () => {
  const { user } = useAuth()

  return (
    <div className="home">
      {/* ✅ SECCIÓN LOGO CON SALUDO PERSONALIZADO */}
      <div className="logo-section">
        <h1>Cut Optimizer</h1>
        <div className="logo-placeholder">
          <span className="logo-icon">🔧</span>
          <div className="logo-content">
            <p className="logo-description">
              Herramienta inteligente de optimización de cortes
            </p>
            
            {/* ✅ SALUDO PERSONALIZADO PARA USUARIOS AUTENTICADOS */}
            {user && (
              <div className="user-welcome">
                <span className="welcome-icon">👋</span>
                <span className="user-greeting">
                  ¡Hola, {user.email.split('@')[0]}!
                </span>
                <span className="welcome-text">
                  Listo para optimizar tus proyectos
                </span>
              </div>
            )}
            
            {/* ✅ MENSAJE PARA USUARIOS NO AUTENTICADOS */}
            {!user && (
              <div className="guest-message">
                <span className="guest-icon">🚀</span>
                <span className="guest-text">
                  Inicia sesión para comenzar a optimizar
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* ✅ SECCIÓN AUTH: Forms lado a lado SOLO para no autenticados */}
      {!user && (
        <div className="auth-section">
          <div className="auth-forms-container">
            <div className="auth-form-card">
              <h2>Iniciar Sesión</h2>
              <Login />
            </div>
            
            <div className="auth-form-card">
              <h2>Crear Cuenta</h2>
              <Register />
            </div>
          </div>
        </div>
      )}
      
      {/* ✅ SECCIÓN NEWS: Siempre visible */}
      <div className="news-section">
        <Noticias />
      </div>
    </div>
  )
}

export default Home