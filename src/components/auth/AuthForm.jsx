/**
 * 🔐 AUTH FORM - Componente base para formularios de autenticación
 * 
 * 📍 FUNCIÓN:
 * - Componente base reutilizable para Login y Register
 * - Maneja estado local del formulario y validaciones
 * - Proporciona estructura consistente para ambos formularios
 * - Maneja errores y estado de loading
 * 
 * 🎯 CARACTERÍSTICAS:
 * - Campos: email, password, confirmPassword (opcional)
 * - Validaciones en tiempo real
 * - Manejo de errores del servidor y cliente
 * - Estado de loading durante el envío
 * - Botón de submit dinámico
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.type - Tipo de formulario ('login' o 'register')
 * @param {Function} props.onSubmit - Función a ejecutar al enviar el formulario
 * @param {boolean} props.loading - Estado de loading desde el contexto
 * @param {string} props.error - Mensaje de error desde el contexto
 */

import React, { useState } from 'react'
import './AuthForm.css'

const AuthForm = ({ type, onSubmit, loading, error }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const [formErrors, setFormErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Configuración según tipo de formulario
  const config = {
    login: {
      title: 'Iniciar Sesión',
      submitText: 'Ingresar',
      submitLoadingText: 'Ingresando...'
    },
    register: {
      title: 'Crear Cuenta',
      submitText: 'Registrarse',
      submitLoadingText: 'Creando cuenta...'
    }
  }

  const currentConfig = config[type]

  /**
   * ✅ Valida un campo específico
   * @param {string} name - Nombre del campo
   * @param {string} value - Valor del campo
   * @returns {string} Mensaje de error o string vacío si es válido
   */
  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (!value) return 'El email es requerido'
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email inválido'
        return ''
      
      case 'password':
        if (!value) return 'La contraseña es requerida'
        if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres'
        return ''
      
      case 'confirmPassword':
        if (type === 'register' && !value) return 'Confirma tu contraseña'
        if (type === 'register' && value !== formData.password) return 'Las contraseñas no coinciden'
        return ''
      
      default:
        return ''
    }
  }

  /**
   * ✅ Valida todo el formulario
   * @returns {boolean} True si el formulario es válido
   */
  const validateForm = () => {
    const errors = {}
    
    errors.email = validateField('email', formData.email)
    errors.password = validateField('password', formData.password)
    
    if (type === 'register') {
      errors.confirmPassword = validateField('confirmPassword', formData.confirmPassword)
    }
    
    setFormErrors(errors)
    return !Object.values(errors).some(error => error !== '')
  }

  /**
   * 📝 Maneja el cambio en los campos del formulario
   * @param {React.ChangeEvent} e - Evento de cambio
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Validación en tiempo real después de que el usuario interactúa con el campo
    if (touched[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }))
    }
  }

  /**
   * 👆 Maneja el blur de los campos (cuando el usuario sale del campo)
   * @param {React.FocusEvent} e - Evento de blur
   */
  const handleBlur = (e) => {
    const { name, value } = e.target
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))
    
    setFormErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }))
  }

  /**
   * 🚀 Maneja el envío del formulario
   * @param {React.FormEvent} e - Evento de envío
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Marcar todos los campos como touched para mostrar errores
    const allTouched = {
      email: true,
      password: true,
      confirmPassword: type === 'register'
    }
    setTouched(allTouched)
    
    // Validar formulario completo
    if (!validateForm()) {
      return
    }
    
    // Preparar datos para enviar (sin confirmPassword en login)
    const submitData = type === 'login' 
      ? { email: formData.email, password: formData.password }
      : { email: formData.email, password: formData.password }
    
    // Ejecutar función onSubmit del componente padre
    try {
      await onSubmit(submitData)
    } catch (error) {
      // El error se maneja en el componente padre a través del contexto
      console.error('Error en AuthForm:', error)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {/* Campo Email */}
      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`form-input ${formErrors.email ? 'error' : ''} ${touched.email && !formErrors.email ? 'valid' : ''}`}
          placeholder="tu@email.com"
          disabled={loading}
          autoComplete="email"
          required
        />
        {formErrors.email && touched.email && (
          <span className="error-message">{formErrors.email}</span>
        )}
      </div>

      {/* Campo Contraseña */}
      <div className="form-group">
        <label htmlFor="password" className="form-label">
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`form-input ${formErrors.password ? 'error' : ''} ${touched.password && !formErrors.password ? 'valid' : ''}`}
          placeholder="••••••••"
          disabled={loading}
          autoComplete={type === 'login' ? 'current-password' : 'new-password'}
          required
        />
        {formErrors.password && touched.password && (
          <span className="error-message">{formErrors.password}</span>
        )}
      </div>

      {/* Campo Confirmar Contraseña (solo para registro) */}
      {type === 'register' && (
        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirmar Contraseña
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${formErrors.confirmPassword ? 'error' : ''} ${touched.confirmPassword && !formErrors.confirmPassword ? 'valid' : ''}`}
            placeholder="••••••••"
            disabled={loading}
            autoComplete="new-password"
            required
          />
          {formErrors.confirmPassword && touched.confirmPassword && (
            <span className="error-message">{formErrors.confirmPassword}</span>
          )}
        </div>
      )}

      {/* Mensaje de error del servidor */}
      {error && (
        <div className="server-error">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Botón de envío */}
      <button
        type="submit"
        className="submit-btn"
        disabled={loading}
      >
        {loading ? currentConfig.submitLoadingText : currentConfig.submitText}
      </button>

      {/* Información adicional */}
      <div className="form-info">
        {type === 'login' ? (
          <p>
            ¿No tienes cuenta? <a href="#register" className="form-link">Regístrate aquí</a>
          </p>
        ) : (
          <p>
            ¿Ya tienes cuenta? <a href="#login" className="form-link">Inicia sesión aquí</a>
          </p>
        )}
      </div>
    </form>
  )
}

export default AuthForm