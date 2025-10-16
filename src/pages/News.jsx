import React from 'react'

/**
 * 📰 NEWS PAGE
 * 📍 Página de novedades y actualizaciones de la aplicación
 */
export default function News() {
  const newsItems = [
    {
      id: 1,
      title: "🎉 ¡Cut Optimizer ya está disponible!",
      date: "2024-01-15",
      content: "Estamos emocionados de anunciar el lanzamiento oficial de Cut Optimizer. Ahora puedes optimizar tus cortes de manera más eficiente.",
      type: "announcement",
      badge: "Nuevo"
    },
    {
      id: 2,
      title: "🔄 Mejoras en el algoritmo de optimización",
      date: "2024-01-10",
      content: "Hemos mejorado nuestro algoritmo para lograr hasta un 15% más de eficiencia en la colocación de piezas.",
      type: "improvement",
      badge: "Mejora"
    },
    {
      id: 3,
      title: "📱 Interfaz móvil mejorada",
      date: "2024-01-05",
      content: "La aplicación ahora es completamente responsive y funciona perfectamente en dispositivos móviles.",
      type: "improvement",
      badge: "Mejora"
    },
    {
      id: 4,
      title: "💾 Guardado automático en la nube",
      date: "2023-12-20",
      content: "Tus proyectos ahora se guardan automáticamente en la nube. Accede desde cualquier dispositivo.",
      type: "feature",
      badge: "Función"
    }
  ]

  /**
   * 🎨 Obtener clases según el tipo de noticia
   */
  const getTypeClasses = (type) => {
    switch (type) {
      case 'announcement':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'improvement':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'feature':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          📰 Novedades
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Mantente informado sobre las últimas actualizaciones, mejoras y nuevas funciones de Cut Optimizer.
        </p>
      </div>

      {/* Lista de noticias */}
      <div className="space-y-8">
        {newsItems.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-lg shadow-md border-l-4 ${getTypeClasses(item.type)} p-6 hover:shadow-lg transition-shadow`}
          >
            {/* Header de la noticia */}
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-xl font-semibold text-gray-900">
                {item.title}
              </h2>
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {item.badge}
              </span>
            </div>

            {/* Fecha */}
            <div className="text-sm text-gray-500 mb-4">
              📅 {new Date(item.date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>

            {/* Contenido */}
            <p className="text-gray-700 leading-relaxed">
              {item.content}
            </p>

            {/* Indicador de tipo */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTypeClasses(item.type)}`}>
                {item.type === 'announcement' && '📢 Anuncio'}
                {item.type === 'improvement' && '⚡ Mejora'}
                {item.type === 'feature' && '🎯 Nueva Función'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Información de contacto */}
      <div className="mt-12 bg-blue-50 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          ¿Tienes sugerencias?
        </h3>
        <p className="text-blue-700 mb-4">
          Nos encanta escuchar a nuestros usuarios. Si tienes ideas para mejorar Cut Optimizer, no dudes en contactarnos.
        </p>
        <a
          href="https://port-kw.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:text-blue-500 font-semibold"
        >
          🌐 Contactar al desarrollador
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Roadmap futuro */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🗓️ Próximamente
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
            Exportación a PDF y Excel
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
            Múltiples tipos de materiales
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
            Integración con CNC
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
            App móvil nativa
          </li>
        </ul>
      </div>
    </div>
  )
}