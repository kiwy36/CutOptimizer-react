import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header del Dashboard */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          ¡Hola, {user?.displayName || 'Usuario'}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Bienvenido a tu panel de control de Cut Optimizer
        </p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Proyectos Activos</h3>
              <p className="text-2xl font-bold text-blue-600">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Optimizaciones</h3>
              <p className="text-2xl font-bold text-green-600">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">💾</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Espacio Usado</h3>
              <p className="text-2xl font-bold text-purple-600">0%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/projects/new"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-6 transition-colors"
        >
          <div className="flex items-center">
            <span className="text-3xl mr-4">➕</span>
            <div>
              <h3 className="text-xl font-semibold">Nuevo Proyecto</h3>
              <p className="text-blue-100">Crear un nuevo proyecto de optimización</p>
            </div>
          </div>
        </Link>

        <Link
          to="/projects"
          className="bg-green-600 hover:bg-green-700 text-white rounded-lg p-6 transition-colors"
        >
          <div className="flex items-center">
            <span className="text-3xl mr-4">📁</span>
            <div>
              <h3 className="text-xl font-semibold">Mis Proyectos</h3>
              <p className="text-green-100">Ver y gestionar proyectos existentes</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Tutorial rápido */}
      <div className="mt-12 bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Cómo empezar?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-900">1. Configura la placa</h3>
            <p className="text-gray-600 text-sm">Define el tamaño de tu material base</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold text-gray-900">2. Agrega las piezas</h3>
            <p className="text-gray-600 text-sm">Especifica dimensiones y cantidades</p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-semibold text-gray-900">3. Optimiza y guarda</h3>
            <p className="text-gray-600 text-sm">Ejecuta el algoritmo y guarda tu proyecto</p>
          </div>
        </div>
      </div>
    </div>
  )
}