/**
 * 🏠 HOME - Página de inicio de la aplicación
 * 
 * 📍 FUNCIÓN:
 * - Página principal que muestra contenido diferente según autenticación
 * - Para usuarios NO autenticados: Muestra componentes de Login/Register + zona de pruebas
 * - Para usuarios autenticados: Muestra dashboard con resumen y News
 * - Sirve como punto de entrada para ambos estados de usuario
 * 
 * 🎯 COMPORTAMIENTO:
 * - Condicional: Si user está autenticado → Dashboard
 * - Condicional: Si user NO está autenticado → Auth components + botones de testing
 * - Redirecciones automáticas manejadas por App.jsx
 */

import React from 'react'
import useAuth from '../hooks/useAuth'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'
import News from './News'
import './Home.css'

const Home = () => {
  const { user, register, login } = useAuth()

  /**
   * 🧪 FUNCIÓN TEMPORAL PARA PROBAR REGISTRO
   * Crea un usuario de prueba automático para validar el flujo de alta en Firebase
   */
  const handleTestRegistration = async () => {
    try {
      const testEmail = `test${Date.now()}@cutoptimizer.com`
      const testPassword = 'test123456'
      
      console.log('🧪 Intentando registrar usuario de prueba:', testEmail)
      
      const result = await register(testEmail, testPassword, {
        displayName: `Usuario Prueba ${Date.now()}`
      })
      
      console.log('✅ Usuario de prueba registrado exitosamente:', result)
      alert(`✅ Usuario creado: ${testEmail}\nRevisa la consola y Firebase Console`)
      
    } catch (error) {
      console.error('❌ Error creando usuario de prueba:', error)
      alert(`❌ Error: ${error.message}`)
    }
  }

  /**
   * 🧪 FUNCIÓN TEMPORAL PARA PROBAR LOGIN
   * Permite hacer login rápido con un usuario demo (preexistente)
   */
  const handleTestLogin = async () => {
    try {
      const testEmail = 'demo@cutoptimizer.com'
      const testPassword = 'demodemo'
      
      console.log('🧪 Intentando login de prueba:', testEmail)
      
      const result = await login(testEmail, testPassword)
      
      console.log('✅ Login de prueba exitoso:', result)
      alert(`✅ Login exitoso para: ${testEmail}`)
      
    } catch (error) {
      console.error('❌ Error en login de prueba:', error)
      alert(`❌ Error: ${error.message}\n\nPuedes crear un usuario primero con el botón "Crear Usuario Prueba"`)
    }
  }

  /**
   * 🎯 Renderizado condicional basado en autenticación
   * - Si el usuario está autenticado: Muestra dashboard
   * - Si el usuario NO está autenticado: Muestra opciones de auth
   */
  if (user) {
    // Usuario AUTENTICADO - Dashboard principal
    return (
      <div className="home-authenticated">
        {/* Header de bienvenida */}
        <div className="welcome-section">
          <h1>Bienvenido a Cut Optimizer</h1>
          <p className="welcome-subtitle">
            Hola, {user.email}! Estás listo para optimizar tus proyectos de corte.
          </p>
        </div>

        {/* Estadísticas rápidas o acciones */}
        <div className="quick-actions">
          <div className="action-card">
            <div className="action-icon">📁</div>
            <h3>Mis Proyectos</h3>
            <p>Gestiona y revisa tus proyectos guardados</p>
            <a href="/projects" className="action-link">Ver proyectos</a>
          </div>
          
          <div className="action-card">
            <div className="action-icon">➕</div>
            <h3>Nuevo Proyecto</h3>
            <p>Crea un nuevo proyecto de optimización</p>
            <a href="/projects/new" className="action-link">Crear proyecto</a>
          </div>
          
          <div className="action-card">
            <div className="action-icon">📊</div>
            <h3>Estadísticas</h3>
            <p>Revisa tu historial y eficiencia</p>
            <button className="action-link" disabled>Próximamente</button>
          </div>
        </div>

        {/* Componente de Noticias integrado */}
        <div className="news-section">
          <News />
        </div>
      </div>
    )
  }

  // Usuario NO autenticado - Página de autenticación
  return (
    <div className="home-unauthenticated">
      {/* 🧪 SECCIÓN TEMPORAL DE PRUEBAS - ELIMINAR EN PRODUCCIÓN */}
      <div className="test-section">
        <h3>🧪 Pruebas de Desarrollo</h3>
        <p>Estos botones son solo para testing y se eliminarán en producción</p>
        <div className="test-buttons">
          <button 
            onClick={handleTestRegistration}
            className="test-btn register-test"
          >
            Crear Usuario Prueba
          </button>
          <button 
            onClick={handleTestLogin}
            className="test-btn login-test"
          >
            Login Demo
          </button>
        </div>
        <small>
          Revisa la consola del navegador y Firebase Console para ver los resultados
        </small>
      </div>

      {/* Contenedor de autenticación con tabs */}
      <div className="auth-container">
        <div className="auth-tabs">
          <div className="auth-tab active" data-tab="login">
            <h2>Iniciar Sesión</h2>
            <Login />
          </div>
          
          <div className="auth-tab" data-tab="register">
            <h2>Crear Cuenta</h2>
            <Register />
          </div>
        </div>

        {/* Información adicional para nuevos usuarios */}
        <div className="auth-info">
          <h3>¿Qué es Cut Optimizer?</h3>
          <p>
            Cut Optimizer es una herramienta inteligente para optimizar el corte de materiales 
            en proyectos de carpintería, metalmecánica y más. Maximiza el aprovechamiento de 
            tus placas y minimiza el desperdicio.
          </p>
          <div className="features-list">
            <div className="feature">
              <span className="feature-icon">📐</span>
              <span>Optimización automática de cortes</span>
            </div>
            <div className="feature">
              <span className="feature-icon">💾</span>
              <span>Guardado de proyectos en la nube</span>
            </div>
            <div className="feature">
              <span className="feature-icon">📊</span>
              <span>Estadísticas de eficiencia</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🎨</span>
              <span>Visualización interactiva de resultados</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
