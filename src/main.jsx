/**
 * 🎯 PUNTO DE ENTRADA PRINCIPAL DE LA APLICACIÓN
 * 📍 FUNCIÓN:
 * - Renderiza la aplicación React en el DOM
 * - Envuelve la app con React.StrictMode para desarrollo
 * - Importa los estilos globales
 * 🔗 DEPENDENCIAS:
 * - React: Biblioteca principal
 * - ReactDOM: Para renderizado en DOM
 * - App: Componente raíz de la aplicación
 * - CSS: Estilos globales
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)