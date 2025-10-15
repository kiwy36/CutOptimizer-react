import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import MainLayout from './components/layout/MainLayout'
import AuthLayout from './components/layout/AuthLayout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import NewProject from './pages/NewProject'
import EditProject from './pages/EditProject'
import News from './pages/News'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import LoadingSpinner from './components/ui/LoadingSpinner'
import './App.css'

// =============================================================================
// COMPONENTES DE RUTAS PROTEGIDAS
// =============================================================================

/**
 * 🔒 ProtectedRoute - Componente para rutas que requieren autenticación
 * ✅ Función: Verifica si el usuario está logueado antes de mostrar el contenido
 * 🚫 Si no está logueado: Redirige a la página principal
 * ⏳ Muestra spinner mientras verifica el estado de autenticación
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  return user ? children : <Navigate to="/" replace />
}

/**
 * 🔐 AuthRoute - Componente para rutas de autenticación (solo usuarios NO logueados)
 * ✅ Función: Previene que usuarios logueados accedan a login/register
 * 🚫 Si está logueado: Redirige al dashboard
 * ⏳ Muestra spinner mientras verifica el estado de autenticación
 */
const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  return !user ? children : <Navigate to="/dashboard" replace />
}

// =============================================================================
// COMPONENTE PRINCIPAL DE CONTENIDO
// =============================================================================

/**
 * 🎯 AppContent - Componente que define todas las rutas de la aplicación
 * 📍 Se envuelve con AuthProvider para tener acceso al contexto de autenticación
 * 🎨 Usa diferentes layouts según el tipo de ruta (auth vs main)
 */
function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* ==================== RUTAS PÚBLICAS ==================== */}
        
        {/* 🏠 Ruta principal - Página de inicio pública */}
        <Route path="/" element={
          <AuthLayout>
            <Home />
          </AuthLayout>
        } />
        
        {/* ========== RUTAS DE AUTENTICACIÓN (solo NO logueados) ========== */}
        
        {/* 🔑 Login - Solo accesible si NO estás logueado */}
        <Route path="/login" element={
          <AuthRoute>
            <AuthLayout>
              <Login />
            </AuthLayout>
          </AuthRoute>
        } />
        
        {/* 📝 Registro - Solo accesible si NO estás logueado */}
        <Route path="/register" element={
          <AuthRoute>
            <AuthLayout>
              <Register />
            </AuthLayout>
          </AuthRoute>
        } />
        
        {/* ==================== RUTAS PROTEGIDAS ==================== */}
        
        {/* 📊 Dashboard - Principal después del login */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        {/* 📁 Lista de proyectos del usuario */}
        <Route path="/projects" element={
          <ProtectedRoute>
            <MainLayout>
              <Projects />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        {/* ➕ Crear nuevo proyecto */}
        <Route path="/projects/new" element={
          <ProtectedRoute>
            <MainLayout>
              <NewProject />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        {/* ✏️ Editar proyecto existente */}
        <Route path="/projects/edit/:projectId" element={
          <ProtectedRoute>
            <MainLayout>
              <EditProject />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        {/* 📰 Noticias y actualizaciones de la app */}
        <Route path="/news" element={
          <ProtectedRoute>
            <MainLayout>
              <News />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        {/* 🔀 Ruta por defecto - Redirige a la página principal */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

// =============================================================================
// COMPONENTE APP PRINCIPAL
// =============================================================================

/**
 * 🚀 App - Componente raíz de la aplicación
 * 📦 Provee:
 *   - Router para navegación
 *   - AuthProvider para gestión de autenticación
 *   - Estructura completa de rutas
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App