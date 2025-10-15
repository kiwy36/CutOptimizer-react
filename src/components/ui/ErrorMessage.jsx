import React from 'react'

/**
 * ❌ ERROR MESSAGE COMPONENT
 * 📍 Muestra mensajes de error de forma estilizada
 */
export default function ErrorMessage({ message, onRetry, retryText = "Reintentar" }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <div className="text-red-600 mb-4">
        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-red-800 font-semibold text-lg mb-2">¡Algo salió mal!</h3>
      <p className="text-red-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition-colors"
        >
          {retryText}
        </button>
      )}
    </div>
  )
}