import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/ui/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Optimiza tus cortes
            <br />
            <span className="text-blue-200">Maximiza tu eficiencia</span>
          </h1>
          
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Cut Optimizer es la herramienta definitiva para carpinteros y metalmecánicos. 
            Optimiza el uso de materiales, reduce desperdicios y ahorra tiempo en tus proyectos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
            >
              Comenzar Gratis
            </Link>
            
            <Link
              to="/login"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
        
        {/* Características */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📐</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Precisión Total</h3>
            <p className="text-blue-100">
              Algoritmos avanzados que maximizan el uso de cada placa de material
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">💾</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Guarda tus Proyectos</h3>
            <p className="text-blue-100">
              Accede a tus trabajos desde cualquier dispositivo con almacenamiento en la nube
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Resultados Instantáneos</h3>
            <p className="text-blue-100">
              Optimización en tiempo real con visualización clara de los resultados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}