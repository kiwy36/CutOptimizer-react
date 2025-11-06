/**
 * 🏠 HOME - Página de inicio SIMPLIFICADA
 * 📍 NUEVA ESTRUCTURA: Logo + Auth Forms + News
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
      {/* ✅ NUEVA SECCIÓN: Logo prominente */}
      <div className="logo-section">
        <h1>Cut Optimizer</h1>
        <div className="logo-placeholder">
          <span>🔧</span>
          <p>Herramienta inteligente de optimización de cortes</p>
        </div>
      </div>
      
      {/* ✅ SECCIÓN AUTH: Forms lado a lado */}
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
      
      {/* ✅ SECCIÓN NEWS: Mantener funcionalidad existente */}
      <div className="news-section">
        <Noticias />
      </div>

      {/* 🧪 TEMPORAL: Mantener botones de prueba por ahora */}
      {!user && (
        <div className="test-section">
          <h3>Pruebas de Desarrollo</h3>
          <div className="test-buttons">
            <button onClick={() => {/* mantener funcionalidad */}}>
              Crear Usuario Prueba
            </button>
            <button onClick={() => {/* mantener funcionalidad */}}>
              Login Demo
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home