/**
 * 🔑 LOGIN - Componente de inicio de sesión
 * 
 * 📍 FUNCIÓN:
 * - Formulario específico para inicio de sesión de usuarios
 * - Utiliza AuthForm como base con configuración específica
 * - Se integra con el contexto de autenticación
 * - Maneja redirección automática después del login
 * 
 * 🎯 CARACTERÍSTICAS:
 * - Campos: email y password
 * - Validaciones específicas para login
 * - Integración con Firebase Auth
 * - Manejo de errores de autenticación
 * - Estado de loading durante el proceso
 */

import React from 'react'
import useAuth from '../../hooks/useAuth'
import AuthForm from './AuthForm'
import './Login.css'

const Login = () => {
  const { login, loading, error, clearError } = useAuth()

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
        loading={loading}
        error={error}
      />
      
      {/* Información adicional específica de login */}
      <div className="login-extra">
        <div className="demo-credentials">
          <h4>Credenciales de Demo</h4>
          <p>
            <strong>Email:</strong> demo@cutoptimizer.com<br />
            <strong>Password:</strong> demodemo
          </p>
          <small>
            * Estas credenciales son de ejemplo para testing
          </small>
        </div>
      </div>
    </div>
  )
}

export default Login