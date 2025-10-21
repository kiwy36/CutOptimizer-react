/**
 * ➕ NEW PROJECT - Página para crear nuevo proyecto
 * 
 * 📍 FUNCIÓN:
 * - Formulario para crear un nuevo proyecto de optimización
 * - Configuración de placa y gestión de piezas
 * - Integración con el algoritmo de optimización
 * - Guardado en Firestore del proyecto
 * 
 * 🎯 ESTADO ACTUAL:
 * - Página placeholder para estructura de rutas
 * - Será implementada completamente en fases posteriores
 * 
 * 🔄 PLANEADO:
 * - Migración del optimizador de la versión JS
 * - Componentes InputPanel, ResultsPanel, PieceManager
 * - Integración con Firestore para guardar proyectos
 * - Visualización en tiempo real de resultados
 */

import React from 'react'
import './NewProject.css'

const NewProject = () => {
  return (
    <div className="new-project-page">
      <div className="page-header">
        <h1>Nuevo Proyecto</h1>
        <p>Crea un nuevo proyecto de optimización de cortes</p>
      </div>

      <div className="project-content">
        <div className="placeholder-message">
          <div className="placeholder-icon">➕</div>
          <h2>Próximamente</h2>
          <p>Esta página te permitirá crear nuevos proyectos de optimización.</p>
          <p>Podrás configurar placas, agregar piezas y ver resultados en tiempo real.</p>
        </div>
      </div>
    </div>
  )
}

export default NewProject