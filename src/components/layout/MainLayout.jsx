/**
 * 🏗️ MAIN LAYOUT - Layout principal para usuarios autenticados
 * 
 * 📍 FUNCIÓN:
 * - Envuelve el contenido principal de la aplicación
 * - Incluye Header con navegación y Footer
 * - Proporciona estructura consistente para todas las páginas protegidas
 * - Maneja el estado de autenticación y navegación
 * 
 * 🎯 USO:
 * - Todas las rutas protegidas usan este layout
 * - Mantiene la navegación y estructura visual consistente
 * - Proporciona contexto de usuario a los componentes hijos
 * 
 * @param {Object} props - Propiedades del componente
 * @param {ReactNode} props.children - Contenido a renderizar dentro del layout
 */

import React from 'react'
import useAuth from '../../hooks/useAuth'
import Header from './Header'
import Footer from './Footer'
import './MainLayout.css'

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth()

  /**
   * 🚪 Maneja el cierre de sesión del usuario
   * - Ejecuta la función de logout del contexto
   * - Maneja errores durante el proceso
   */
  const handleLogout = async () => {
    try {
      await logout()
      // La redirección se maneja automáticamente en App.jsx
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <div className="main-layout">
      {/* Header con navegación y información de usuario */}
      <Header 
        user={user} 
        onLogout={handleLogout}
      />
      
      {/* Contenido principal de la página */}
      <main className="main-content">
        <div className="content-container">
          {children}
        </div>
      </main>
      
      {/* Footer de la aplicación */}
      <Footer />
    </div>
  )
}

export default MainLayout