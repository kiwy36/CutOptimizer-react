import React from 'react'

/**
 * ⏳ LOADING SPINNER COMPONENT
 * 📍 Indicador de carga reutilizable
 */
export default function LoadingSpinner({ message = "Cargando..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 p-8">
      <div className="loading-spinner mb-4"></div>
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  )
}