/**
 * 🔑 LOGIN - Componente de inicio de sesión MEJORADO
 * 
 * 📍 FUNCIÓN:
 * - Formulario específico para inicio de sesión de usuarios
 * - Utiliza AuthForm como base con configuración específica
 * - Se integra con el contexto de autenticación
 * - Maneja redirección automática después del login
 * - MEJORADO: Manejo específico de errores y botón demo
 * 
 * 🎯 CARACTERÍSTICAS:
 * - Campos: email y password
 * - Validaciones específicas para login
 * - Integración con Firebase Auth
 * - Manejo de errores de autenticación específicos
 * - Estado de loading durante el proceso
 * - Botón para crear usuario demo
 */

import React from 'react'
import useAuth from '../../hooks/useAuth'
import AuthForm from './AuthForm'
import './Login.css'

const Login = () => {
  const { login, loading, authLoading, error, clearError, createDemoUser } = useAuth()

  /**
   * 🚀 Maneja el envío del formulario de login
   * @param {Object} credentials - Credenciales del usuario
   * @param {string} credentials.email - Email del usuario
   * @param {string} credentials.password - Password del usuario
   */
  const handleLogin = async (credentials) => {
    // Limpiar errores previos
    clearError()
    
    try {
      await login(credentials.email, credentials.password)
      // La redirección se maneja automáticamente en App.jsx
    } catch (error) {
      // El error se maneja en el contexto de autenticación
      console.error('Error en Login:', error)
    }
  }

  /**
   * 🧪 Maneja la creación y login de usuario demo
   */
  const handleDemoLogin = async () => {
    clearError()
    
    try {
      await createDemoUser()
      // La redirección se maneja automáticamente en App.jsx
    } catch (error) {
      console.error('Error en Demo Login:', error)
    }
  }

  return (
    <div className="login-component">
      {/* Header del formulario de login */}
      <div className="login-header">
        <h2>Iniciar Sesión</h2>
        <p>Ingresa a tu cuenta de Cut Optimizer</p>
      </div>

      {/* Formulario de login usando AuthForm */}
      <AuthForm
        type="login"
        onSubmit={handleLogin}
        loading={loading || authLoading}
        error={error}
      />
      
      {/* Botón de usuario demo */}
      <div className="demo-section">
        <div className="demo-divider">
          <span>¿Quieres probar la app?</span>
        </div>
        
        <button
          type="button"
          className="demo-btn"
          onClick={handleDemoLogin}
          disabled={loading || authLoading}
        >
          {loading || authLoading ? '🔄 Creando cuenta demo...' : '🧪 Usar Cuenta Demo'}
        </button>
        
        <div className="demo-info">
          <small>
            Se creará una cuenta demo automáticamente con proyectos de ejemplo
          </small>
        </div>
      </div>
      
      {/* Información adicional específica de login */}
      <div className="login-extra">
        <div className="security-info">
          <h4>🔒 Tu seguridad es importante</h4>
          <ul>
            <li>✅ Tus datos están protegidos con encriptación</li>
            <li>✅ No compartimos tu información con terceros</li>
            <li>✅ Puedes eliminar tu cuenta cuando quieras</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Login