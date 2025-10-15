/**
 * ✅ VALIDADORES DE DATOS
 * 📍 Contiene funciones para validar entradas del usuario
 */

export const validators = {
  /**
   * 📏 Validar tamaño de placa
   */
  validateSheetSize: function(width, height) {
    const errors = []
    
    if (isNaN(width) || width <= 0) {
      errors.push('El ancho debe ser un número positivo')
    }
    
    if (isNaN(height) || height <= 0) {
      errors.push('El alto debe ser un número positivo')
    }
    
    if (width < 100 || height < 100) {
      errors.push('El tamaño mínimo de placa es 100x100mm')
    }
    
    if (width > 10000 || height > 10000) {
      errors.push('El tamaño máximo de placa es 10000x10000mm')
    }
    
    return errors
  },

  /**
   * 🧩 Validar pieza individual
   */
  validatePiece: function(width, height, quantity) {
    const errors = []
    
    if (isNaN(width) || width <= 0) {
      errors.push('El ancho de la pieza debe ser un número positivo')
    }
    
    if (isNaN(height) || height <= 0) {
      errors.push('El alto de la pieza debe ser un número positivo')
    }
    
    if (isNaN(quantity) || quantity <= 0) {
      errors.push('La cantidad debe ser un número positivo')
    }
    
    return errors
  },

  /**
   * 📧 Validar email
   */
  validateEmail: function(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  /**
   * 🔐 Validar contraseña
   */
  validatePassword: function(password) {
    return password.length >= 6
  }
}