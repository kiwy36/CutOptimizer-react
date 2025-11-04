/**
 * 📝 REGISTER - Componente de registro MEJORADO
 * 
 * 📍 FUNCIÓN:
 * - Registro completo con datos de perfil extendido
 * - Incluye campo para nombre de usuario
 * - Crea automáticamente perfil y workspace
 */

import React, { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import AuthForm from './AuthForm'

const Register = () => {
  const { register, loading, error, clearError } = useAuth()
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

  return (
    <div className="register-component">
      {/* Campo adicional para nombre de usuario */}
      <div className="additional-fields">
        <div className="form-group">
          <label htmlFor="displayName" className="form-label">
            Nombre de usuario (opcional)
          </label>
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="form-input"
            placeholder="Tu nombre o apodo"
            disabled={loading}
          />
          <small className="form-help">
            Si no ingresas un nombre, usaremos tu email
          </small>
        </div>
      </div>

      <AuthForm
        type="register"
        onSubmit={handleRegister}
        loading={loading}
        error={error}
      />
      
      {/* Información adicional específica de registro */}
      <div className="register-extra">
        <div className="security-info">
          <h4>🎉 ¡Bienvenido a Cut Optimizer!</h4>
          <p>Al registrarte obtendrás:</p>
          <ul>
            <li>✅ Tu propio espacio de trabajo personal</li>
            <li>✅ Guardado ilimitado de proyectos en la nube</li>
            <li>✅ Estadísticas de tu eficiencia</li>
            <li>✅ Acceso desde cualquier dispositivo</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Register