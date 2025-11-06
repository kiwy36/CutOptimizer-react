/**
 * 🚀 APP - COMPONENTE RAÍZ SIMPLIFICADO
 * 📦 NUEVA ESTRUCTURA:
 * - Navbar siempre visible
 * - Footer siempre visible  
 * - Rutas directas sin layouts anidados
 * - Protección de rutas con ProtectedRoute
 */

import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Context Providers
import AuthProvider from './context/AuthContext'

// Components
import Navbar from './components/navigation/Navbar'
import Footer from './components/navigation/Footer'
import LoadingSpinner from './components/ui/LoadingSpinner'

// Pages
import Home from './pages/Home'
import ProjectsGallery from './pages/ProjectsGallery'
import ProjectDetail from './pages/ProjectDetail'
import NewProject from './pages/NewProject'

// Hooks
import useAuth from './hooks/useAuth'

// Importar estilos
import './App.css'

// =============================================================================
// COMPONENTE PROTECTED ROUTE SIMPLIFICADO
// =============================================================================

/**
 * 🔒 ProtectedRoute - Versión simplificada
 * ✅ Redirige al home si no está autenticado
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinner size="large" />
        <p>Cargando...</p>
      </div>
    )
  }

  return user ? children : <Navigate to="/" replace />
}

// =============================================================================
// COMPONENTE APP PRINCIPAL
// =============================================================================

/**
 * 🚀 App - Estructura simplificada con Navbar + Contenido + Footer fijos
 */
function App() {
  return (
    <div className="app">
      <AuthProvider>
        <Router>
          {/* Navbar siempre visible */}
          <Navbar />
          
          {/* Contenido principal con rutas */}
          <main className="main-content">
            <Routes>
              {/* Ruta pública */}
              <Route path="/" element={<Home />} />
              
              {/* Rutas protegidas */}
              <Route 
                path="/projects" 
                element={
                  <ProtectedRoute>
                    <ProjectsGallery />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/projects/new" 
                element={
                  <ProtectedRoute>
                    <NewProject />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/projects/:id" 
                element={
                  <ProtectedRoute>
                    <ProjectDetail />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          
          {/* Footer siempre visible */}
          <Footer />
        </Router>
      </AuthProvider>
    </div>
  )
}

export default App