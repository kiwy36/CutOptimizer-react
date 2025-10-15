import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { projectService } from '../services/projectService'
import OptimizerWorkspace from '../components/optimizer/OptimizerWorkspace'

export default function NewProject() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Estado para los datos del optimizador
  const [optimizerData, setOptimizerData] = useState({
    sheetWidth: 2440,
    sheetHeight: 1220,
    pieces: [],
    sheets: []
  })

  const handleSaveProject = async () => {
    if (!projectName.trim()) {
      alert('Por favor, ingresa un nombre para el proyecto')
      return
    }

    if (optimizerData.pieces.length === 0) {
      alert('Agrega al menos una pieza al proyecto')
      return
    }

    setIsSaving(true)

    try {
      const projectData = {
        name: projectName,
        description: projectDescription,
        sheetWidth: optimizerData.sheetWidth,
        sheetHeight: optimizerData.sheetHeight,
        pieces: optimizerData.pieces,
        sheets: optimizerData.sheets
      }

      await projectService.createProject(projectData, user.uid)
      
      alert('Proyecto guardado exitosamente!')
      navigate('/projects')
    } catch (error) {
      console.error('Error al guardar proyecto:', error)
      alert('Error al guardar el proyecto. Intenta nuevamente.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleOptimizerUpdate = (data) => {
    setOptimizerData(data)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Nuevo Proyecto</h1>
        <p className="text-gray-600 mt-2">
          Crea y optimiza un nuevo proyecto de cortes
        </p>
      </div>

      {/* Información del proyecto */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Información del Proyecto
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Proyecto *
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Ej: Mueble de cocina"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <input
              type="text"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Ej: Cortes para mueble de cocina de melamina"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Workspace del optimizador */}
      <OptimizerWorkspace onDataUpdate={handleOptimizerUpdate} />

      {/* Botones de acción */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => navigate('/projects')}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        
        <button
          onClick={handleSaveProject}
          disabled={isSaving || !projectName.trim() || optimizerData.pieces.length === 0}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? 'Guardando...' : 'Guardar Proyecto'}
        </button>
      </div>
    </div>
  )
}