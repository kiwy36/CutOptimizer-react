/**
 * 🚀 APP - COMPONENTE RAÍZ OPTIMIZADO
 * 📦 ESTRUCTURA MEJORADA:
 * - Lazy loading para componentes pesados
 * - Suspense para estados de carga
 * - Code splitting para mejor rendimiento
 * - Error boundaries (recomendado implementar)
 */

import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Context Providers
import AuthProvider from './context/AuthContext'

// Components (cargados inmediatamente - livianos)
import Navbar from './components/navigation/Navbar'
import Footer from './components/navigation/Footer'
import LoadingSpinner from './components/shared/LoadingSpinner'
import useAuth from './hooks/useAuth'

// Pages con lazy loading
const Home = lazy(() => import('./pages/Home'))
const ProjectsGallery = lazy(() => import('./pages/ProjectsGallery'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const NewProject = lazy(() => import('./pages/NewProject'))

// Optimizer components con lazy loading
const InputPanel = lazy(() => import('./components/optimizer/InputPanel'))
const ResultsPanel = lazy(() => import('./components/optimizer/ResultsPanel'))

// Importar estilos
import './App.css'

// =============================================================================
// COMPONENTES DE CARGA
// =============================================================================

/**
 * 🌀 LoadingFallback - Componente de carga reutilizable
 */
const LoadingFallback = ({ message = "Cargando..." }) => (
  <div className="loading-container">
    <LoadingSpinner size="large" />
    <p>{message}</p>
  </div>
)

/**
 * 🎨 PageSuspense - Wrapper para páginas con lazy loading
 */
const PageSuspense = ({ children }) => (
  <Suspense fallback={<LoadingFallback />}>
    {children}
  </Suspense>
)

// =============================================================================
// COMPONENTE PROTECTED ROUTE OPTIMIZADO
// =============================================================================

/**
 * 🔒 ProtectedRoute - Versión optimizada
 * ✅ Maneja estados de carga y redirección
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingFallback message="Verificando autenticación..." />
  }

  return user ? children : <Navigate to="/" replace />
}

/**
 * 🛡️ ProtectedSuspenseRoute - Combinación de protección y lazy loading
 */
const ProtectedSuspenseRoute = ({ children }) => (
  <ProtectedRoute>
    <PageSuspense>
      {children}
    </PageSuspense>
  </ProtectedRoute>
)

// =============================================================================
// COMPONENTE APP PRINCIPAL OPTIMIZADO
// =============================================================================

/**
 * 🚀 App - Estructura optimizada con lazy loading
 */
function App() {
  return (
    <div className="app">
      <AuthProvider>
        <Router>
          {/* Navbar siempre visible - se carga inmediatamente */}
          <Navbar />
          
          {/* Contenido principal con rutas y Suspense */}
          <main className="main-content">
            <Routes>
              {/* Ruta pública */}
              <Route 
                path="/" 
                element={
                  <PageSuspense>
                    <Home />
                  </PageSuspense>
                } 
              />
              
              {/* Rutas protegidas con lazy loading */}
              <Route 
                path="/projects" 
                element={
                  <ProtectedSuspenseRoute>
                    <ProjectsGallery />
                  </ProtectedSuspenseRoute>
                } 
              />
              
              <Route 
                path="/projects/new" 
                element={
                  <ProtectedSuspenseRoute>
                    <NewProject />
                  </ProtectedSuspenseRoute>
                } 
              />
              
              <Route 
                path="/projects/:id" 
                element={
                  <ProtectedSuspenseRoute>
                    <ProjectDetail />
                  </ProtectedSuspenseRoute>
                } 
              />
              
              {/* Ruta para el optimizador (si es necesaria) */}
              <Route 
                path="/optimizer" 
                element={
                  <ProtectedSuspenseRoute>
                    <div className="optimizer-container">
                      <InputPanel />
                      <ResultsPanel />
                    </div>
                  </ProtectedSuspenseRoute>
                } 
              />
              
              {/* Ruta 404 (opcional) */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          {/* Footer siempre visible - se carga inmediatamente */}
          <Footer />
        </Router>
      </AuthProvider>
    </div>
  )
}

export default App