/**
 * 🚀 APP - COMPONENTE RAÍZ DE LA APLICACIÓN
 * 📦 PROVEE:
 * - Router para navegación entre páginas
 * - AuthProvider para gestión de autenticación global
 * - Estructura completa de rutas públicas y protegidas
 * - Manejo de estado de autenticación en toda la app
 * 🎯 FUNCIONALIDAD:
 * - Define todas las rutas de la aplicación
 * - Protege rutas que requieren autenticación
 * - Redirige automáticamente según estado de login
 * - Maneja layouts diferentes para auth vs contenido principal
 */

import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Context Providers
import AuthProvider from './context/AuthContext'

// Components
import LoadingSpinner from './components/ui/LoadingSpinner'

// AÑADIR ESTE IMPORT EN LA PARTE SUPERIOR:
import useAuth from './hooks/useAuth'
// Pages
import Home from './pages/Home'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import NewProject from './pages/NewProject'
import News from './pages/News'

// Layouts
import MainLayout from './components/layout/MainLayout'
import AuthLayout from './components/layout/AuthLayout'

// Importar estilos específicos de App
import './App.css'

// =============================================================================
// COMPONENTES DE RUTAS PROTEGIDAS
// =============================================================================

/**
 * 🔒 ProtectedRoute - Componente para rutas que requieren autenticación
 * ✅ FUNCIÓN:
 * - Verifica si el usuario está logueado antes de mostrar el contenido
 * - Usa el contexto de autenticación para determinar estado del usuario
 * 🚫 COMPORTAMIENTO SI NO AUTENTICADO:
 * - Redirige a la página principal (Home)
 * ⏳ ESTADOS:
 * - loading: Muestra spinner mientras verifica autenticación
 * - authenticated: Muestra el contenido protegido
 * - not authenticated: Redirige al home
 * 
 * @param {Object} children - Componentes hijos a renderizar si está autenticado
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  // Mostrar spinner mientras verifica autenticación
  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinner size="large" />
        <p>Verificando autenticación...</p>
      </div>
    )
  }

  // Redirigir al home si no está autenticado
  if (!user) {
    return <Navigate to="/" replace />
  }

  // Renderizar contenido protegido si está autenticado
  return children
}

// =============================================================================
// COMPONENTE PRINCIPAL DE CONTENIDO
// =============================================================================

/**
 * 🎯 AppContent - Componente que define todas las rutas de la aplicación
 * 📍 CARACTERÍSTICAS:
 * - Se envuelve con AuthProvider para acceso al contexto de autenticación
 * - Define rutas públicas y protegidas
 * - Usa diferentes layouts según tipo de ruta (auth vs main)
 * - Maneja redirecciones automáticas
 * 🏗️ ESTRUCTURA DE RUTAS:
 * - Rutas de autenticación: Solo accesibles para usuarios NO logueados
 * - Rutas públicas: Accesibles para todos
 * - Rutas protegidas: Requieren autenticación
 */
const AppContent = () => {
  const { user, loading } = useAuth()

  // Mostrar spinner global mientras carga la autenticación
  if (loading) {
    return (
      <div className="app-loading">
        <LoadingSpinner size="xlarge" />
        <h2>Cargando Cut Optimizer...</h2>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        {/* ========== RUTAS DE AUTENTICACIÓN (solo NO logueados) ========== */}
        {/* Estas rutas solo son accesibles cuando el usuario NO está logueado */}
        {!user && (
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<Home />} />
            {/* Redirigir cualquier ruta no autenticada al home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}

        {/* ==================== RUTAS PÚBLICAS ==================== */}
        {/* Rutas accesibles para todos los usuarios */}
        {/* (Por ahora no tenemos rutas públicas excepto el home) */}

        {/* ==================== RUTAS PROTEGIDAS ==================== */}
        {/* Estas rutas requieren que el usuario esté autenticado */}
        {user && (
          <Route path="/" element={<MainLayout />}>
            {/* Ruta principal para usuarios autenticados */}
            <Route index element={<Home />} />
            
            {/* Rutas de gestión de proyectos */}
            <Route path="projects" element={<Projects />} />
            <Route path="projects/new" element={<NewProject />} />
            <Route path="projects/:projectId" element={<ProjectDetail />} />
            
            {/* Otras rutas protegidas */}
            <Route path="news" element={<News />} />
            
            {/* Redirigir rutas desconocidas a la página principal */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}
      </Routes>
    </Router>
  )
}

// =============================================================================
// COMPONENTE APP PRINCIPAL
// =============================================================================

/**
 * 🚀 App - Componente raíz de la aplicación
 * 
 * 📦 PROVEE:
 * - Router para navegación
 * - AuthProvider para gestión de autenticación
 * - Estructura completa de rutas
 * 
 * 🔧 CONFIGURACIÓN:
 * - Envuelve toda la app con providers necesarios
 * - Define el punto de partida del routing
 */
function App() {
  return (
    <div className="app">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </div>
  )
}

export default App