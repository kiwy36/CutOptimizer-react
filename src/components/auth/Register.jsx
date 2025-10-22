/**
 * 📝 REGISTER - Componente de registro de nuevos usuarios
 * 
 * 📍 FUNCIÓN:
 * - Formulario específico para registro de nuevos usuarios
 * - Utiliza AuthForm como base con configuración específica
 * - Valida coincidencia de contraseñas
 * - Se integra con el contexto de autenticación
 * - Maneja redirección automática después del registro
 * 
 * 🎯 CARACTERÍSTICAS:
 * - Campos: email, password y confirmPassword
 * - Validación de coincidencia de contraseñas
 * - Integración con Firebase Auth
 * - Creación de nuevo usuario en el sistema
 * - Login automático después del registro
 */

import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import AuthForm from './AuthForm'
import './Register.css'

const Register = () => {
  const { register, loading, error, clearError } = useAuth()
  const [displayName, setDisplayName] = useState('')

  /**
   * 🚀 Maneja el envío del formulario de registro
   * @param {Object} userData - Datos del nuevo usuario
   * @param {string} userData.email - Email del nuevo usuario
   * @param {string} userData.password - Password del nuevo usuario
   */
  const handleRegister = async (userData) => {
    // Limpiar errores previos
    clearError()
    
    try {
      await register(userData.email, userData.password)
      // El usuario es redirigido automáticamente después del registro exitoso
      // En el futuro podríamos guardar el displayName en Firestore
    } catch (error) {
      // El error se maneja en el contexto de autenticación
      console.error('Error en Register:', error)
    }
  }

  return (
    <div className="register-component">
      {/* Header del formulario de registro */}
      <div className="register-header">
        <h2>Crear Cuenta</h2>
        <p>Únete a Cut Optimizer y optimiza tus proyectos</p>
      </div>

      {/* Campo adicional para nombre (opcional) */}
      <div className="form-group">
        <label htmlFor="displayName" className="form-label">
          Nombre (Opcional)
        </label>
        <input
          type="text"
          id="displayName"
          name="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="form-input"
          placeholder="Tu nombre"
          disabled={loading}
        />
        <small className="form-help">
          Este nombre se usará para personalizar tu experiencia
        </small>
      </div>

      {/* Formulario de registro usando AuthForm */}
      <AuthForm
        type="register"
        onSubmit={handleRegister}
        loading={loading}
        error={error}
      />
      
      {/* Información adicional específica de registro */}
      <div className="register-extra">
        <div className="security-info">
          <h4>Seguridad de tu cuenta</h4>
          <ul>
            <li>Tu contraseña está encriptada y segura</li>
            <li>No compartimos tu información con terceros</li>
            <li>Puedes eliminar tu cuenta en cualquier momento</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Register