import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y título */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">CO</span>
              </div>
              <span className="font-bold text-xl">Cut Optimizer</span>
            </Link>
          </div>

          {/* Menú desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/dashboard" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/dashboard') 
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-100 hover:bg-blue-500'
              }`}
            >
              Inicio
            </Link>
            <Link 
              to="/projects" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/projects') 
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-100 hover:bg-blue-500'
              }`}
            >
              Mis Proyectos
            </Link>
            <Link 
              to="/projects/new" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/projects/new') 
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-100 hover:bg-blue-500'
              }`}
            >
              Nuevo Proyecto
            </Link>
            <Link 
              to="/news" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/news') 
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-100 hover:bg-blue-500'
              }`}
            >
              Novedades
            </Link>
          </div>

          {/* User menu desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-blue-100">
              Hola, {user?.displayName || 'Usuario'}
            </span>
            <button
              onClick={handleLogout}
              className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-blue-100 hover:text-white focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-600">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/dashboard" 
              className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link 
              to="/projects" 
              className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Mis Proyectos
            </Link>
            <Link 
              to="/projects/new" 
              className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Nuevo Proyecto
            </Link>
            <Link 
              to="/news" 
              className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Novedades
            </Link>
            <div className="border-t border-blue-500 pt-2">
              <span className="block px-3 py-2 text-blue-200">
                {user?.displayName || 'Usuario'}
              </span>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-blue-100 hover:bg-blue-500 rounded-md"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}