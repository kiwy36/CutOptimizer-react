/**
 * 📝 REGISTER - Componente de registro MEJORADO
 * 
 * 📍 FUNCIÓN:
 * - Registro completo con datos de perfil extendido
 * - Incluye campo para nombre de usuario
 * - Crea automáticamente perfil y workspace
 * - MEJORADO: Botón para crear cuenta demo
 */

import React, { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import AuthForm from './AuthForm'
import './Register.css'

const Register = () => {
  const { register, loading, authLoading, error, clearError, createDemoUser } = useAuth()
  const [displayName, setDisplayName] = useState('')

  /**
   * 🚀 Maneja el envío del formulario de registro MEJORADO
   */
  const handleRegister = async (userData) => {
    // Limpiar errores previos
    clearError()
    
    try {
      // Preparar datos extendidos del usuario
      const userExtendedData = {
        displayName: displayName || userData.email.split('@')[0],
        preferences: {
          language: 'es',
          theme: 'light',
          defaultSheetSize: {
            width: 2440,
            height: 1220
          },
          allowRotation: true,
          algorithm: 'shelf'
        }
      }

      await register(userData.email, userData.password, userExtendedData)
      
    } catch (error) {
      console.error('Error en Register:', error)
    }
  }

  /**
   * 🧪 Maneja la creación de usuario demo
   */
  const handleDemoAccount = async () => {
    clearError()
    
    try {
      await createDemoUser()
    } catch (error) {
      console.error('Error al crear cuenta demo:', error)
    }
  }

  return (
    <div className="register-component">
      {/* Campo adicional para nombre de usuario */}
      <div className="additional-fields">
        <div className="form-group">
          <label htmlFor="displayName" className="form-label">
            👤 Nombre de usuario (opcional)
          </label>
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="form-input"
            placeholder="Tu nombre o apodo"
            disabled={loading || authLoading}
          />
          <small className="form-help">
            Si no ingresas un nombre, usaremos tu email
          </small>
        </div>
      </div>

      <AuthForm
        type="register"
        onSubmit={handleRegister}
        loading={loading || authLoading}
        error={error}
      />
      
      {/* Botón de cuenta demo */}
      <div className="demo-section">
        <div className="demo-divider">
          <span>¿Solo quieres probar?</span>
        </div>
        
        <button
          type="button"
          className="demo-btn secondary"
          onClick={handleDemoAccount}
          disabled={loading || authLoading}
        >
          {loading || authLoading ? '🔄 Creando cuenta demo...' : '🧪 Crear Cuenta Demo'}
        </button>
        
        <div className="demo-info">
          <small>
            Crea una cuenta demo con configuración preestablecida
          </small>
        </div>
      </div>
      
      {/* Información adicional específica de registro */}
      <div className="register-extra">
        <div className="benefits-info">
          <h4>🎉 ¡Bienvenido a Cut Optimizer!</h4>
          <p>Al registrarte obtendrás:</p>
          <ul>
            <li>✅ Tu propio espacio de trabajo personal</li>
            <li>✅ Guardado ilimitado de proyectos en la nube</li>
            <li>✅ Estadísticas de tu eficiencia</li>
            <li>✅ Acceso desde cualquier dispositivo</li>
            <li>✅ Soporte prioritario</li>
            <li>✅ Actualizaciones gratuitas</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Register