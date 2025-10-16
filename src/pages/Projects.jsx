import React from 'react'
import { Link } from 'react-router-dom'
import { useProjects } from '../hooks/useProjects'
import ProjectList from '../components/projects/ProjectList'

/**
 * 📁 PROJECTS PAGE
 * 📍 Página de listado de proyectos del usuario
 */
export default function Projects() {
  const { projects, loading, error, refreshProjects } = useProjects()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Proyectos</h1>
          <p className="text-gray-600 mt-2">
            Gestiona y revisa todos tus proyectos de optimización
          </p>
        </div>
        
        <Link
          to="/projects/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          ➕ Nuevo Proyecto
        </Link>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar proyectos..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Todos</option>
              <option>Recientes</option>
              <option>Con optimización</option>
            </select>
            <button 
              onClick={refreshProjects}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              🔄
            </button>
          </div>
        </div>
      </div>

      {/* Lista de proyectos */}
      <ProjectList 
        projects={projects}
        loading={loading}
        error={error}
        onRetry={refreshProjects}
      />

      {/* Empty state con acciones */}
      {!loading && (!projects || projects.length === 0) && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              ¡Crea tu primer proyecto!
            </h3>
            <p className="text-gray-600 mb-6">
              Comienza optimizando tus cortes y ahorrando material
            </p>
            <Link
              to="/projects/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              Comenzar Ahora
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}