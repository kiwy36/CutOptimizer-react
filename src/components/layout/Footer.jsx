import React from 'react'

/**
 * 🦶 FOOTER COMPONENT
 * 📍 Pie de página con información y enlaces
 */
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold">Cut Optimizer</h3>
            <p className="text-gray-400 text-sm">
              Optimizador de cortes para carpintería y metalmecánica
            </p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm mb-2">
              Desarrollado con ❤️ por Kevin
            </p>
            <a 
              href="https://port-kw.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              🌐 Visita mi portfolio
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Cut Optimizer. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}