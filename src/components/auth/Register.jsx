/**
 * 📝 REGISTER - Componente de registro LIMPIO Y OPTIMIZADO
 * 
 * 📍 FUNCIÓN:
 * - Registro completo con datos de perfil extendido
 * - Incluye campo opcional para nombre de usuario
 * - Crea automáticamente perfil y workspace en Firestore
 * - Diseño limpio y centrado en el registro principal
 * 
 * 🎯 CARACTERÍSTICAS:
 * - Campos: email, password, nombre de usuario (opcional)
 * - Preferencias por defecto configuradas
 * - Integración con Firebase Auth + Firestore
 * - Manejo de errores específicos
 * - Estado de loading durante el proceso
 */

import React, { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import AuthForm from './AuthForm'
import './Register.css'

const Register = () => {
  const { register, loading, authLoading, error, clearError } = useAuth()
  const [displayName, setDisplayName] = useState('')

  /**
   * 🚀 Maneja el envío del formulario de registro
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
            disabled={loading || authLoading}
          />
          <small className="form-help">
            📧 Si no ingresas un nombre, usaremos tu email
          </small>
        </div>
      </div>

      {/* Formulario principal de registro */}
      <AuthForm
        type="register"
        onSubmit={handleRegister}
        loading={loading || authLoading}
        error={error}
      />

      {/* Información de beneficios - Opcional, puedes remover si quieres minimalista */}
      <div className="register-extra">
        <div className="benefits-info">
          <h4>¡Bienvenido a Cut Optimizer!</h4>
          <p>Al registrarte obtendrás:</p>
          <ul>
            <li> Tu propio espacio de trabajo personal</li>
            <li> Guardado ilimitado de proyectos en la nube</li>
            <li> Estadísticas de tu eficiencia</li>
            <li> Acceso desde cualquier dispositivo</li>
            <li> Soporte prioritario</li>
            <li> Actualizaciones gratuitas</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Register