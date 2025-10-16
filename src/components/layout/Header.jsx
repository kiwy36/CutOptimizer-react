import React from 'react'

/**
 * 🎯 HEADER COMPONENT
 * 📍 Componente de cabecera reutilizable para páginas de autenticación
 */
export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo y nombre */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CO</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cut Optimizer</h1>
              <p className="text-sm text-gray-500">Optimizador de cortes inteligente</p>
            </div>
          </div>
          
          {/* Estado de la app */}
          <div className="hidden md:block">
            <div className="bg-green-50 border border-green-200 rounded-full px-4 py-2">
              <span className="text-green-700 text-sm font-medium">✅ Conectado</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}