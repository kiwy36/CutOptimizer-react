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

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  return user ? children : <Navigate to="/" replace />
}

// Componente para rutas de autenticación (solo para no logueados)
const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  return !user ? children : <Navigate to="/dashboard" replace />
}

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={
          <AuthLayout>
            <Home />
          </AuthLayout>
        } />
        
        {/* Rutas de autenticación (solo para no logueados) */}
        <Route path="/login" element={
          <AuthRoute>
            <AuthLayout>
              <Login />
            </AuthLayout>
          </AuthRoute>
        } />
        
        <Route path="/register" element={
          <AuthRoute>
            <AuthLayout>
              <Register />
            </AuthLayout>
          </AuthRoute>
        } />
        
        {/* Rutas protegidas */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/projects" element={
          <ProtectedRoute>
            <MainLayout>
              <Projects />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/projects/new" element={
          <ProtectedRoute>
            <MainLayout>
              <NewProject />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/projects/edit/:projectId" element={
          <ProtectedRoute>
            <MainLayout>
              <EditProject />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/news" element={
          <ProtectedRoute>
            <MainLayout>
              <News />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

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