/**
 * 📁 PROJECTS - Página de listado de proyectos del usuario
 * 
 * 📍 FUNCIÓN:
 * - Muestra todos los proyectos guardados del usuario actual
 * - Grid de tarjetas de proyectos con información básica
 * - Funcionalidad de búsqueda y filtrado (futuro)
 * - Acciones: Editar, eliminar, ver detalles
 * 
 * 🎯 ESTADO ACTUAL:
 * - Página placeholder para estructura de rutas
 * - Será implementada completamente en fases posteriores
 * 
 * 🔄 PLANEADO:
 * - Integración con Firestore para cargar proyectos
 * - Componente ProjectList con grid de ProjectCard
 * - Filtros y búsqueda
 * - Paginación si es necesario
 */

import React from 'react'
import './Projects.css'

const Projects = () => {
  return (
    <div className="projects-page">
      <div className="page-header">
        <h1>Mis Proyectos</h1>
        <p>Gestiona y revisa todos tus proyectos de optimización guardados</p>
      </div>

      <div className="projects-content">
        <div className="placeholder-message">
          <div className="placeholder-icon">📁</div>
          <h2>Próximamente</h2>
          <p>Esta página mostrará todos tus proyectos guardados.</p>
          <p>Podrás editarlos, eliminarlos y ver sus detalles.</p>
          <a href="/projects/new" className="create-project-btn">
            Crear primer proyecto
          </a>
        </div>
      </div>
    </div>
  )
}

export default Projects